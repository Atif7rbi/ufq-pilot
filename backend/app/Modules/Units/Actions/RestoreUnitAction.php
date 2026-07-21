<?php

declare(strict_types=1);

namespace App\Modules\Units\Actions;

use App\Modules\Units\Exceptions\UnitNotArchivedException;
use App\Modules\Units\Models\Unit;
use Illuminate\Support\Facades\DB;

final class RestoreUnitAction
{
    public function execute(
        string $tenantId,
        string $unitId,
        int|string $actorId,
    ): Unit {
        return DB::transaction(function () use (
            $tenantId,
            $unitId,
            $actorId,
        ): Unit {
            $unit = Unit::query()
                ->where('tenant_id', $tenantId)
                ->whereKey($unitId)
                ->lockForUpdate()
                ->firstOrFail();

            if (! $unit->isArchived()) {
                throw new UnitNotArchivedException();
            }

            $unit->forceFill([
                'archived_at' => null,
                'archived_by' => null,
                'restored_by' => $actorId,
                'updated_by' => $actorId,
            ])->save();

            return $unit;
        });
    }
}
