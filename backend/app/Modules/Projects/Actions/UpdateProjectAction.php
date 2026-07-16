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
            unset(
                $data['country_code'],
                $data['currency'],
            );

            $data['country_code'] = 'SA';
            $data['currency'] = 'SAR';
            $data['updated_by'] = $actor->id;

            $project->update($data);

            return $project->refresh();
        });
    }
}
