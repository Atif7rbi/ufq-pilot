<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Modules\Reservations\Actions\ExpireReservationAction;
use App\Modules\Reservations\Enums\ReservationStatus;
use App\Modules\Reservations\Models\Reservation;
use Carbon\CarbonInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

        $reservationIds = Reservation::query()
            ->where('status', ReservationStatus::Active->value)
            ->orderBy('id')
            ->pluck('id');

        $rawReservations = DB::table('reservations')
            ->whereIn('id', $reservationIds)
            ->select(['id', 'status', 'expires_at'])
            ->orderBy('id')
            ->get();

        Log::debug('Reservation expiration job started', [
            'candidate_count' => $reservationIds->count(),
            'clock' => $expiredAt->toISOString(),
            'clock_timezone' => $expiredAt->getTimezone()->getName(),
            'raw_reservations' => $rawReservations->map(
                fn (object $reservation): array => [
                    'id' => $reservation->id,
                    'status' => $reservation->status,
                    'expires_at' => $reservation->expires_at,
                ]
            )->all(),
        ]);

        $reservationIds->each(
            fn (string $id) => $action->execute($id, $expiredAt)
        );
    }
}
