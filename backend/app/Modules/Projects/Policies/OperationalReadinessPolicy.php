<?php

declare(strict_types=1);

namespace App\Modules\Projects\Policies;

use App\Modules\Projects\Enums\ProjectStatus;
use App\Modules\Projects\Exceptions\ProjectNotOperationallyReadyException;
use App\Modules\Projects\Models\Project;

final class OperationalReadinessPolicy
{
    public function assert(Project $project): void
    {
        if (
            $project->status !== ProjectStatus::Draft
            || $project->isArchived()
            || $project->tenant_id === null
            || blank($project->name)
            || blank($project->city)
            || $project->project_type === null
        ) {
            throw new ProjectNotOperationallyReadyException();
        }
    }
}
