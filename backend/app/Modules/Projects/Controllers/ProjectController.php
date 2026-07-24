<?php

namespace App\Modules\Projects\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Actions\CreateProjectAction;
use App\Modules\Projects\Actions\UpdateProjectAction;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Requests\StoreProjectRequest;
use App\Modules\Projects\Requests\UpdateProjectRequest;
use App\Modules\Shared\Services\ResolveActiveMembership;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class ProjectController extends Controller
{
    public function __construct(
        private readonly ResolveActiveMembership $resolveActiveMembership,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $membership = $this->resolveActiveMembership->handle(
            $request->user(),
        );

        $projects = Project::query()
            ->with('projectManager:id,name,email')
            ->where('tenant_id', $membership->tenant_id)
            ->when(
                $request->filled('search'),
                function ($query) use ($request): void {
                    $search = trim((string) $request->string('search'));

                    $query->where(function ($query) use ($search): void {
                        $query
                            ->where('name', 'ilike', "%{$search}%")
                            ->orWhere(
                                'project_number',
                                'ilike',
                                "%{$search}%"
                            )
                            ->orWhere('city', 'ilike', "%{$search}%");
                    });
                }
            )
            ->when(
                $request->filled('status'),
                fn ($query) => $query->where(
                    'status',
                    (string) $request->string('status')
                )
            )
            ->latest()
            ->paginate(
                perPage: min(
                    max((int) $request->integer('per_page', 15), 1),
                    100,
                )
            )
            ->withQueryString();

        return response()->json([
            'data' => $projects,
        ]);
    }

    public function store(
        StoreProjectRequest $request,
        CreateProjectAction $action,
    ): JsonResponse {
        $membership = $this->resolveActiveMembership->handle(
            $request->user(),
        );

        $project = $action->execute(
            tenantId: (string) $membership->tenant_id,
            actorId: $request->user()->id,
            data: $request->validated(),
        )->load('projectManager:id,name,email');

        return response()->json([
            'message' => 'تم إنشاء المشروع بنجاح.',
            'data' => [
                'project' => $project,
            ],
        ], 201);
    }

    public function show(Request $request, string $project): JsonResponse
    {
        $membership = $this->resolveActiveMembership->handle(
            $request->user(),
        );

        $projectRecord = Project::query()
            ->where('tenant_id', $membership->tenant_id)
            ->whereKey($project)
            ->firstOrFail();

        return response()->json([
            'data' => [
                'project' => $projectRecord->load(
                    'projectManager:id,name,email'
                ),
            ],
        ]);
    }

    public function update(
        UpdateProjectRequest $request,
        string $project,
        UpdateProjectAction $action,
    ): JsonResponse {
        $membership = $this->resolveActiveMembership->handle(
            $request->user(),
        );

        $project = $action->execute(
            tenantId: (string) $membership->tenant_id,
            projectId: $project,
            actorId: $request->user()->id,
            data: $request->validated(),
        )->load('projectManager:id,name,email');

        return response()->json([
            'message' => 'تم تحديث المشروع بنجاح.',
            'data' => [
                'project' => $project,
            ],
        ]);
    }

    public function destroy(
        Request $request,
        string $project,
    ): JsonResponse {
        $membership = $this->resolveActiveMembership->handle(
            $request->user(),
        );

        $projectRecord = Project::query()
            ->where('tenant_id', $membership->tenant_id)
            ->whereKey($project)
            ->firstOrFail();

        $projectRecord->updated_by = $request->user()->id;
        $projectRecord->save();
        $projectRecord->delete();

        return response()->json([
            'message' => 'تم حذف المشروع بنجاح.',
        ]);
    }
}
