<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Actions;

use App\Modules\Reservations\Enums\ReservationStatus;
use App\Modules\Reservations\Models\Reservation;
use App\Modules\Units\Models\Unit;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

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

            if (
                $reservation->status !== ReservationStatus::Active
                || $reservation->expires_at->greaterThan($expiredAt)
            ) {
                return;
            }

            $reservation->forceFill(['status' => ReservationStatus::Expired])->save();
        });
    }
}
