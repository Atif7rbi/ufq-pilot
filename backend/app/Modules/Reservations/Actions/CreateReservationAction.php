<?php

declare(strict_types=1);

namespace App\Modules\Reservations\Actions;

use App\Modules\Customers\Enums\CustomerStatus;
use App\Modules\Customers\Models\Customer;
use App\Modules\Projects\Enums\ProjectStatus;
use App\Modules\Reservations\Enums\ReservationStatus;
use App\Modules\Reservations\Exceptions\ReservationUnitUnavailableException;
use App\Modules\Reservations\Models\Reservation;
use App\Modules\Reservations\Policies\ReservationPolicy;
use App\Modules\Units\Enums\UnitStatus;
use App\Modules\Units\Models\Unit;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Log;

final class CreateReservationAction
{
    public function execute(string $tenantId, int|string $actorId, array $data): Reservation
    {
        return DB::transaction(function () use ($tenantId, $actorId, $data): Reservation {
            $unit = Unit::query()
                ->with('project:id,status')
                ->where('tenant_id', $tenantId)
                ->whereKey($data['unit_id'])
                ->lockForUpdate()
                ->firstOrFail();

            $customer = Customer::query()
                ->where('tenant_id', $tenantId)
                ->whereKey($data['customer_id'])
                ->firstOrFail();

            if (
                $unit->isArchived()
                || $unit->status !== UnitStatus::Available
                || $unit->project === null
                || $unit->project->status !== ProjectStatus::Active
                || $customer->status === CustomerStatus::Archived
                || $customer->archived_at !== null
                || Reservation::query()
                    ->where('unit_id', $unit->id)
                    ->where('status', ReservationStatus::Active->value)
                    ->exists()
            ) {
                throw new ReservationUnitUnavailableException();
            }

            $reservedAt = Date::now()->toImmutable();
            $expiresAt = isset($data['expires_at'])
                ? Date::parse(
                    $data['expires_at'],
                    config('app.timezone'),
                )->toImmutable()
                : $reservedAt->add(ReservationPolicy::defaultDuration());

            $expiresAtForStorage = $expiresAt
                ->utc()
                ->format('Y-m-d H:i:sP');

            Log::debug('Reservation creation expiry input parsed', [
                'request_expires_at' => $data['expires_at'] ?? null,
                'application_timezone' => config('app.timezone'),
                'reserved_at' => $reservedAt->toISOString(),
                'reserved_at_timezone' => $reservedAt->getTimezone()->getName(),
                'expires_at_parsed' => $expiresAt->toISOString(),
                'expires_at_timezone' => $expiresAt->getTimezone()->getName(),
            ]);

            $reservationData = [
                'tenant_id' => $tenantId,
                'unit_id' => $unit->id,
                'customer_id' => $customer->id,
                'status' => ReservationStatus::Active,
                'reserved_at' => $reservedAt,
                'expires_at' => $expiresAtForStorage,
                'notes' => $data['notes'] ?? null,
                'created_by' => $actorId,
                'updated_by' => $actorId,
            ];

            Log::debug('Reservation creation payload before save', [
                'expires_at' => $reservationData['expires_at'],
            ]);

            $reservation = Reservation::query()->create($reservationData);

            Log::debug('Reservation creation persisted', [
                'reservation_id' => $reservation->id,
                'model_expires_at' => $reservation->expires_at->toISOString(),
                'model_expires_at_timezone' => $reservation->expires_at
                    ->getTimezone()
                    ->getName(),
                'database_expires_at' => DB::table('reservations')
                    ->where('id', $reservation->id)
                    ->value('expires_at'),
            ]);

            return $reservation;
        });
    }
}
