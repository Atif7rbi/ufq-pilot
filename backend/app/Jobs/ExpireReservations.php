<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Modules\Reservations\Actions\ExpireReservationAction;
use App\Modules\Reservations\Enums\ReservationStatus;
use App\Modules\Reservations\Models\Reservation;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

final class ExpireReservations implements ShouldQueue
{
    use Queueable;

    public function handle(ExpireReservationAction $action): void
    {
        Reservation::query()
            ->where('status', ReservationStatus::Active->value)
            ->where('expires_at', '<=', now())
            ->orderBy('id')
            ->eachById(fn (Reservation $reservation) => $action->execute($reservation->id));
    }
}
