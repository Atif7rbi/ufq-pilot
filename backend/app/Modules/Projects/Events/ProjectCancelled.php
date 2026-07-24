<?php

declare(strict_types=1);

namespace App\Modules\Projects\Events;

final readonly class ProjectCancelled
{
    public function __construct(
        public string $projectId,
        public string $tenantId,
        public int|string $actorId,
    ) {
    }
}
