<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Actions;

use App\Modules\Reservations\Enums\ReservationStatus;
use App\Modules\Reservations\Exceptions\ReservationNotActiveException;
use App\Modules\Reservations\Models\Reservation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Date;

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

            if (array_key_exists('expires_at', $data)) {
                $data['expires_at'] = Date::parse(
                    $data['expires_at'],
                    config('app.timezone'),
                )
                    ->utc()
                    ->format('Y-m-d H:i:sP');
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
