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

            return Reservation::query()->create([
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
        });
    }
}
