<?php

namespace App\Modules\Projects\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Actions\CreateProjectAction;
use App\Modules\Projects\Actions\UpdateProjectAction;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Requests\StoreProjectRequest;
use App\Modules\Projects\Requests\UpdateProjectRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $projects = Project::query()
            ->with('projectManager:id,name,email')
            ->latest()
            ->paginate(
                perPage: min(
                    max((int) $request->integer('per_page', 15), 1),
                    100,
                )
            );

        return response()->json([
            'data' => $projects,
        ]);
    }

    public function store(
        StoreProjectRequest $request,
        CreateProjectAction $action,
    ): JsonResponse {
        $project = $action->execute(
            $request->validated(),
            $request->user(),
        )->load('projectManager:id,name,email');

        return response()->json([
            'message' => 'تم إنشاء المشروع بنجاح.',
            'data' => [
                'project' => $project,
            ],
        ], 201);
    }

    public function show(Project $project): JsonResponse
    {
        return response()->json([
            'data' => [
                'project' => $project->load(
                    'projectManager:id,name,email'
                ),
            ],
        ]);
    }

    public function update(
        UpdateProjectRequest $request,
        Project $project,
        UpdateProjectAction $action,
    ): JsonResponse {
        $project = $action->execute(
            $project,
            $request->validated(),
            $request->user(),
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
        Project $project,
    ): JsonResponse {
        $project->updated_by = $request->user()->id;
        $project->save();
        $project->delete();

        return response()->json([
            'message' => 'تم حذف المشروع بنجاح.',
        ]);
    }
}
