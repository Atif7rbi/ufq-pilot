<?php

declare(strict_types=1);

namespace App\Modules\Collections\Actions;

use App\Modules\Collections\Contracts\CollectionAuditRecorderInterface;
use App\Modules\Collections\DTOs\CollectionScheduleResult;
use App\Modules\Collections\Enums\CollectionStatus;
use App\Modules\Collections\Exceptions\InvalidCancellationReasonException;
use App\Modules\Collections\Models\Collection;
use App\Modules\Collections\Policies\AmendmentEligibilityPolicy;
use App\Modules\Collections\Support\DerivedScheduleStateResolver;
use App\Modules\Collections\Support\LogCollectionAuditRecorder;
use App\Modules\Collections\Validation\CollectionLineValidator;
use App\Modules\Collections\Validation\CollectionScheduleValidator;
use App\Modules\Collections\Validation\ExpectedActiveCollectionIdsValidator;
use App\Modules\Contracts\Models\Contract;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * DDL spec section 25 (Amendment).
 *
 * Cancel-and-replace is the only mutation pattern for a Scheduled
 * Collection schedule (section 26, Financial Immutability). Order of
 * operations follows the frozen amendment specification:
 *
 * Validate request structure -> Lock Contract -> Lock Collections ->
 * compare the locked active Collection IDs with the expected generation ->
 * validate lifecycle and amendment eligibility -> cancel replaced rows ->
 * create replacements directly as scheduled -> validate sequence -> validate
 * due-date order -> validate final total -> write audit -> commit.
 *
 * Because the cross-row validations run after the cancel-and-replace
 * writes (as specified), a validation failure rolls back the entire
 * transaction, undoing both the cancellation and the replacement rows.
 */
final class AmendCollectionScheduleAction
{
    public function __construct(
        private readonly AmendmentEligibilityPolicy $eligibilityPolicy = new AmendmentEligibilityPolicy(),
        private readonly DerivedScheduleStateResolver $stateResolver = new DerivedScheduleStateResolver(),
        private readonly CollectionLineValidator $lineValidator = new CollectionLineValidator(),
        private readonly CollectionScheduleValidator $scheduleValidator = new CollectionScheduleValidator(),
        private readonly ExpectedActiveCollectionIdsValidator $expectedActiveIdsValidator = new ExpectedActiveCollectionIdsValidator(),
        private readonly ?CollectionAuditRecorderInterface $auditRecorder = null,
    ) {
    }

    /**
     * @param  array<int, mixed>  $expectedActiveCollectionIds
     * @param  array<int, \App\Modules\Collections\DTOs\CollectionLineData>  $replacementLines
     */
    public function execute(
        string $tenantId,
        string $contractId,
        int|string $actorId,
        array $expectedActiveCollectionIds,
        array $replacementLines,
        string $cancellationReason,
    ): CollectionScheduleResult {
        $expectedCanonicalIds = $this->expectedActiveIdsValidator
            ->validateAndCanonicalize($expectedActiveCollectionIds);
        $normalizedCancellationReason = $this->normalizeCancellationReason($cancellationReason);

        foreach ($replacementLines as $line) {
            $this->lineValidator->validate($line);
        }

        return DB::transaction(function () use (
            $tenantId,
            $contractId,
            $actorId,
            $expectedCanonicalIds,
            $replacementLines,
            $normalizedCancellationReason,
        ): CollectionScheduleResult {
            $contract = Contract::query()
                ->where('tenant_id', $tenantId)
                ->whereKey($contractId)
                ->lockForUpdate()
                ->firstOrFail();

            $allCollections = Collection::query()
                ->where('tenant_id', $tenantId)
                ->where('contract_id', $contract->id)
                ->orderBy('sequence')
                ->lockForUpdate()
                ->get()
                ->all();

            $replacedCollections = $this->stateResolver->activeOnly($allCollections);

            $this->expectedActiveIdsValidator->assertMatchesActiveCollections(
                $expectedCanonicalIds,
                $replacedCollections,
            );

            $currentState = $this->stateResolver->resolve($allCollections);

            $this->eligibilityPolicy->assert($contract, $currentState);

            $cancelledAt = now();

            foreach ($replacedCollections as $collection) {
                $collection->forceFill([
                    'status' => CollectionStatus::Cancelled,
                    'cancelled_at' => $cancelledAt,
                    'cancelled_by' => $actorId,
                    'cancellation_reason' => $normalizedCancellationReason,
                    'updated_by' => $actorId,
                ])->save();
            }

            $scheduledAt = now();
            $replacements = [];

            foreach ($replacementLines as $line) {
                $collection = new Collection();
                $collection->id = (string) Str::ulid();
                $collection->forceFill([
                    'tenant_id' => $tenantId,
                    'contract_id' => $contract->id,
                    'sequence' => $line->sequence,
                    'title' => $line->title,
                    'amount' => $line->amount,
                    'due_date' => $line->dueDate,
                    'notes' => $line->notes,
                    'status' => CollectionStatus::Scheduled,
                    'scheduled_at' => $scheduledAt,
                    'scheduled_by' => $actorId,
                    'created_by' => $actorId,
                    'updated_by' => null,
                ])->save();

                $replacements[] = $collection;
            }

            $rows = $this->scheduleValidator->rowsFromCollections($replacements);
            $this->scheduleValidator->assertUniqueActiveSequences($rows);
            $this->scheduleValidator->assertNonDecreasingDueDates($rows);
            $this->scheduleValidator->assertTotalMatches($rows, (string) $contract->total_amount);

            $this->auditRecorder()->record(
                $tenantId,
                $contract->id,
                'collection_schedule_amended',
                $actorId,
                [
                    'cancelled_count' => count($replacedCollections),
                    'replacement_count' => count($replacements),
                    'cancellation_reason' => $normalizedCancellationReason,
                ],
            );

            usort($replacements, static fn (Collection $a, Collection $b): int => $a->sequence <=> $b->sequence);

            return new CollectionScheduleResult(
                $replacements,
                $this->stateResolver->resolve($replacements),
            );
        });
    }

    private function normalizeCancellationReason(string $reason): string
    {
        $trimmed = trim($reason);

        if ($trimmed === '' || mb_strlen($trimmed) > 500) {
            throw new InvalidCancellationReasonException();
        }

        return $trimmed;
    }

    private function auditRecorder(): CollectionAuditRecorderInterface
    {
        return $this->auditRecorder ?? new LogCollectionAuditRecorder();
    }
}
