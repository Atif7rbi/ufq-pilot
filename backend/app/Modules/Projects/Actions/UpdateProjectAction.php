<?php

namespace App\Modules\Projects\Actions;

use App\Modules\Projects\Models\Project;
use Illuminate\Support\Facades\DB;

class UpdateProjectAction
{
    public function execute(
        string $tenantId,
        string $projectId,
        array $data,
        int|string $actorId,
    ): Project {
        return DB::transaction(function () use (
            $tenantId,
            $projectId,
            $data,
            $actorId,
        ): Project {
            $project = Project::query()
                ->where('tenant_id', $tenantId)
                ->whereKey($projectId)
                ->lockForUpdate()
                ->firstOrFail();

            unset(
                $data['tenant_id'],
                $data['created_by'],
                $data['updated_by'],
                $data['archived_at'],
                $data['archived_by'],
                $data['restored_by'],
                $data['country_code'],
                $data['currency'],
            );

            $data['country_code'] = 'SA';
            $data['currency'] = 'SAR';
            $data['updated_by'] = $actorId;

            $project->update($data);

            return $project->refresh();
        });
    }
}
