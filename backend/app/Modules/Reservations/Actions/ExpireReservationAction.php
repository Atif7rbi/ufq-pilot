<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Actions;

use App\Modules\Reservations\Enums\ReservationStatus;
use App\Modules\Reservations\Models\Reservation;
use App\Modules\Units\Models\Unit;
use Illuminate\Support\Facades\DB;

final class ExpireReservationAction
{
    public function execute(string $reservationId): void
    {
        DB::transaction(function () use ($reservationId): void {
            $reservation = Reservation::query()->whereKey($reservationId)->lockForUpdate()->firstOrFail();

            Unit::query()->whereKey($reservation->unit_id)->lockForUpdate()->firstOrFail();

            if ($reservation->status !== ReservationStatus::Active || $reservation->expires_at->isFuture()) {
                return;
            }

            $reservation->forceFill(['status' => ReservationStatus::Expired])->save();
        });
    }
}
