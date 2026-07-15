<?php

namespace App\Modules\Shared\Services;

use App\Modules\Shared\Contracts\BusinessNumberGeneratorInterface;
use App\Modules\Shared\Exceptions\BusinessNumberGenerationException;
use Illuminate\Support\Facades\DB;
use Throwable;

class BusinessNumberGenerator implements BusinessNumberGeneratorInterface
{
    /**
     * @return array{
     *     number: string,
     *     year: int,
     *     sequence: int
     * }
     */
    public function generate(
        string $prefix,
        int $year,
        ?int $requestedSequence = null,
    ): array {
        $normalizedPrefix = strtoupper(trim($prefix));

        if (! preg_match('/^[A-Z]{2,10}$/', $normalizedPrefix)) {
            throw new BusinessNumberGenerationException(
                'Business number prefix is invalid.'
            );
        }

        if ($year < 2000 || $year > 9999) {
            throw new BusinessNumberGenerationException(
                'Business number year is invalid.'
            );
        }

        if ($requestedSequence !== null && $requestedSequence < 1) {
            throw new BusinessNumberGenerationException(
                'Business number sequence must be greater than zero.'
            );
        }

        try {
            return DB::transaction(function () use (
                $normalizedPrefix,
                $year,
                $requestedSequence,
            ): array {
                DB::table('business_number_sequences')->insertOrIgnore([
                    'prefix' => $normalizedPrefix,
                    'year' => $year,
                    'current_value' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $sequenceRow = DB::table('business_number_sequences')
                    ->where('prefix', $normalizedPrefix)
                    ->where('year', $year)
                    ->lockForUpdate()
                    ->first();

                if ($sequenceRow === null) {
                    throw new BusinessNumberGenerationException(
                        'Business number sequence could not be initialized.'
                    );
                }

                $sequence = $requestedSequence
                    ?? ((int) $sequenceRow->current_value + 1);

                $newCurrentValue = max(
                    (int) $sequenceRow->current_value,
                    $sequence,
                );

                DB::table('business_number_sequences')
                    ->where('prefix', $normalizedPrefix)
                    ->where('year', $year)
                    ->update([
                        'current_value' => $newCurrentValue,
                        'updated_at' => now(),
                    ]);

                $formattedSequence = str_pad(
                    (string) $sequence,
                    3,
                    '0',
                    STR_PAD_LEFT,
                );

                return [
                    'number' => sprintf(
                        '%s-%d-%s',
                        $normalizedPrefix,
                        $year,
                        $formattedSequence,
                    ),
                    'year' => $year,
                    'sequence' => $sequence,
                ];
            }, 3);
        } catch (BusinessNumberGenerationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            throw new BusinessNumberGenerationException(
                'Business number could not be generated.',
                previous: $exception,
            );
        }
    }
}
