<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Actions;

use App\Modules\Reservations\Enums\ReservationStatus;
use App\Modules\Reservations\Exceptions\ReservationNotActiveException;
use App\Modules\Reservations\Models\Reservation;
use Illuminate\Support\Facades\DB;

final class UpdateReservationAction
{
    public function execute(string $tenantId, string $reservationId, int|string $actorId, array $data): Reservation
    {
        return DB::transaction(function () use ($tenantId, $reservationId, $actorId, $data): Reservation {
            $reservation = Reservation::query()
                ->where('tenant_id', $tenantId)->whereKey($reservationId)
                ->lockForUpdate()->firstOrFail();

            if ($reservation->status !== ReservationStatus::Active) {
                throw new ReservationNotActiveException();
            }

            $reservation->fill([
                ...array_intersect_key($data, array_flip(['expires_at', 'notes'])),
                'updated_by' => $actorId,
            ]);
            $reservation->save();

            return $reservation;
        });
    }
}
