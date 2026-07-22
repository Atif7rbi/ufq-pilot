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
            $reservation = Reservation::query()->whereKey($reservationId)->lockForUpdate()->firstOrFail();

            Unit::query()->whereKey($reservation->unit_id)->lockForUpdate()->firstOrFail();

            Log::debug('Reservation expiration evaluation', [
                'reservation_id' => $reservation->id,
                'status' => $reservation->status->value,
                'expires_at' => $reservation->expires_at->toISOString(),
                'expires_at_timezone' => $reservation->expires_at->getTimezone()->getName(),
                'clock' => $expiredAt->toISOString(),
                'clock_timezone' => $expiredAt->getTimezone()->getName(),
                'is_future' => $reservation->expires_at->greaterThan($expiredAt),
            ]);

            if (
                $reservation->status !== ReservationStatus::Active
                || $reservation->expires_at->greaterThan($expiredAt)
            ) {
                return;
            }

            $reservation->forceFill(['status' => ReservationStatus::Expired])->save();

            Log::debug('Reservation expired', [
                'reservation_id' => $reservation->id,
                'status' => $reservation->fresh()->status->value,
            ]);
        });
    }
}
