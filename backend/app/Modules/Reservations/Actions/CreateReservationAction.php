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

            $reservedAt = Date::now()->toImmutable()->utc();
            $expiresAt = isset($data['expires_at'])
                ? Date::parse(
                    $data['expires_at'],
                    config('app.timezone'),
                )->toImmutable()->utc()
                : $reservedAt->add(ReservationPolicy::defaultDuration());

            $reservation = Reservation::query()->create([
                'tenant_id' => $tenantId,
                'unit_id' => $unit->id,
                'customer_id' => $customer->id,
                'status' => ReservationStatus::Active,
                'reserved_at' => $reservedAt,
                'expires_at' => $expiresAt,
                'notes' => $data['notes'] ?? null,
                'created_by' => $actorId,
                'updated_by' => $actorId,
            ]);

            $rawExpiresAt = DB::selectOne(
                'select expires_at from reservations where id = ?',
                [$reservation->id],
            );

            $utcExpiresAt = DB::selectOne(
                "select expires_at, expires_at at time zone 'UTC' as expires_at_utc from reservations where id = ?",
                [$reservation->id],
            );

            $timezone = DB::selectOne(
                "select current_setting('TIMEZONE') as timezone",
            );

            Log::debug('Reservation creation UTC verification', [
                'reservation_id' => $reservation->id,
                'expires_at' => $rawExpiresAt->expires_at,
                'expires_at_utc' => $utcExpiresAt->expires_at_utc,
                'database_timezone' => $timezone->timezone,
            ]);

            return $reservation;
        });
    }
}
