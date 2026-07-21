<?php

declare(strict_types=1);

namespace App\Modules\Units\Actions;

use App\Modules\Units\Exceptions\UnitAlreadyArchivedException;
use App\Modules\Units\Models\Unit;
use Illuminate\Support\Facades\DB;

final class ArchiveUnitAction
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

            if ($unit->isArchived()) {
                throw new UnitAlreadyArchivedException();
            }

            $unit->forceFill([
                'archived_at' => now(),
                'archived_by' => $actorId,
                'restored_by' => null,
                'updated_by' => $actorId,
            ])->save();

            return $unit;
        });
    }
}
