<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Actions;

use App\Modules\Customers\Enums\CustomerStatus;
use App\Modules\Customers\Models\Customer;
use App\Modules\Projects\Enums\ProjectStatus;
use App\Modules\Reservations\Enums\ReservationStatus;
use App\Modules\Reservations\Exceptions\ReservationUnitUnavailableException;
use App\Modules\Reservations\Models\Reservation;
use App\Modules\Reservations\Policies\ReservationPolicy;
use App\Modules\Units\Enums\UnitStatus;
use App\Modules\Units\Models\Unit;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

final class CreateReservationAction
{
    public function execute(string $tenantId, int|string $actorId, array $data): Reservation
    {
        return DB::transaction(function () use ($tenantId, $actorId, $data): Reservation {
            $unit = Unit::query()
                ->with('project:id,status')
                ->where('tenant_id', $tenantId)
                ->whereKey($data['unit_id'])
                ->lockForUpdate()
                ->firstOrFail();

            $customer = Customer::query()
                ->where('tenant_id', $tenantId)
                ->whereKey($data['customer_id'])
                ->firstOrFail();

            if (
                $unit->isArchived()
                || $unit->status !== UnitStatus::Available
                || $unit->project === null
                || $unit->project->status !== ProjectStatus::Active
                || $customer->status === CustomerStatus::Archived
                || $customer->archived_at !== null
                || Reservation::query()
                    ->where('unit_id', $unit->id)
                    ->where('status', ReservationStatus::Active->value)
                    ->exists()
            ) {
                throw new ReservationUnitUnavailableException();
            }

            $reservedAt = now()->utc();
            $expiresAt = isset($data['expires_at'])
                ? Carbon::parse(
                    $data['expires_at'],
                    config('app.timezone'),
                )->utc()
                : $reservedAt->copy()->add(ReservationPolicy::defaultDuration());

            $reservation = Reservation::query()->create([
                'tenant_id' => $tenantId,
                'unit_id' => $unit->id,
                'customer_id' => $customer->id,
                'status' => ReservationStatus::Active,
                'reserved_at' => $reservedAt,
                'expires_at' => $expiresAt,
                'notes' => $data['notes'] ?? null,
                'created_by' => $actorId,
                'updated_by' => $actorId,
            ]);

            Log::debug('Reservation action return boundary', [
                'object_id' => spl_object_id($reservation),
                'class' => $reservation::class,
                'raw_reserved_at' => $reservation->getRawOriginal('reserved_at'),
                'raw_expires_at' => $reservation->getRawOriginal('expires_at'),
                'attribute_reserved_at' => $reservation->getAttributes()['reserved_at'] ?? null,
                'attribute_expires_at' => $reservation->getAttributes()['expires_at'] ?? null,
                'cast_reserved_at' => $reservation->reserved_at?->toISOString(),
                'cast_expires_at' => $reservation->expires_at?->toISOString(),
                'reserved_timezone' => $reservation->reserved_at?->getTimezone()->getName(),
                'expires_timezone' => $reservation->expires_at?->getTimezone()->getName(),
            ]);

            return $reservation;
        });
    }
}
