<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Modules\Reservations\Actions\ExpireReservationAction;
use App\Modules\Reservations\Enums\ReservationStatus;
use App\Modules\Reservations\Models\Reservation;
use Carbon\CarbonInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

final class ExpireReservations implements ShouldQueue
{
    use Queueable;

    public function handle(ExpireReservationAction $action): void
    {
        $this->expireAt($action, now());
    }

    public function expireAt(
        ExpireReservationAction $action,
        CarbonInterface $expiredAt,
    ): void
    {

        Reservation::query()
            ->where('status', ReservationStatus::Active->value)
            ->orderBy('id')
            ->pluck('id')
            ->each(fn (string $id) => $action->execute($id, $expiredAt));
    }
}
