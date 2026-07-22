<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Actions;

use App\Modules\Reservations\Enums\ReservationStatus;
use App\Modules\Reservations\Models\Reservation;
use App\Modules\Units\Models\Unit;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

final class ExpireReservationAction
{
    public function execute(
        string $reservationId,
        CarbonInterface $expiredAt,
    ): void
    {
        DB::transaction(function () use ($reservationId, $expiredAt): void {
            Log::debug('Reservation expiration action entered', [
                'reservation_id' => $reservationId,
            ]);

            $reservation = Reservation::query()->whereKey($reservationId)->lockForUpdate()->firstOrFail();

            Unit::query()->whereKey($reservation->unit_id)->lockForUpdate()->firstOrFail();

            $rawExpiresAt = DB::table('reservations')
                ->where('id', $reservation->id)
                ->value('expires_at');

            $isFuture = $reservation->expires_at->greaterThan($expiredAt);

            Log::debug('Reservation expiration condition evaluated', [
                'reservation_id' => $reservation->id,
                'status' => $reservation->status->value,
                'expires_at_raw' => $rawExpiresAt,
                'expires_at_cast' => $reservation->expires_at->toISOString(),
                'expires_at_timezone' => $reservation->expires_at->getTimezone()->getName(),
                'clock' => $expiredAt->toISOString(),
                'clock_timezone' => $expiredAt->getTimezone()->getName(),
                'expires_at_lte_clock' => ! $isFuture,
            ]);

            if (
                $reservation->status !== ReservationStatus::Active
                || $isFuture
            ) {
                Log::debug('Reservation expiration action returned early', [
                    'reservation_id' => $reservation->id,
                ]);

                return;
            }

            Log::debug('Reservation expiration action saving expired status', [
                'reservation_id' => $reservation->id,
            ]);

            $reservation->forceFill(['status' => ReservationStatus::Expired])->save();

            $reservation->refresh();

            Log::debug('Reservation expiration action saved status', [
                'reservation_id' => $reservation->id,
                'model_status' => $reservation->status->value,
                'database_status' => DB::table('reservations')
                    ->where('id', $reservation->id)
                    ->value('status'),
            ]);

        });
    }
}
