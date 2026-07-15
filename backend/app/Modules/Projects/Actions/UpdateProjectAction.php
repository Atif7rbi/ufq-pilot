<?php

namespace App\Modules\Projects\Actions;

use App\Models\User;
use App\Modules\Projects\Models\Project;
use Illuminate\Support\Facades\DB;

class UpdateProjectAction
{
    public function execute(
        Project $project,
        array $data,
        User $actor,
    ): Project {
        return DB::transaction(function () use (
            $project,
            $data,
            $actor,
        ): Project {
            if (isset($data['country_code'])) {
                $data['country_code'] = strtoupper(
                    $data['country_code']
                );
            }

            if (isset($data['currency'])) {
                $data['currency'] = strtoupper(
                    $data['currency']
                );
            }

            $data['updated_by'] = $actor->id;

            $project->update($data);

            return $project->refresh();
        });
    }
}
