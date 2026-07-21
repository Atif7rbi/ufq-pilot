<?php

declare(strict_types=1);

namespace App\Modules\Units\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Shared\Services\ResolveActiveMembership;
use App\Modules\Units\Actions\CreateUnitAction;
use App\Modules\Units\Actions\UpdateUnitAction;
use App\Modules\Units\Models\Unit;
use App\Modules\Units\Requests\StoreUnitRequest;
use App\Modules\Units\Requests\UpdateUnitRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class UnitController extends Controller
{
    public function __construct(
        private readonly ResolveActiveMembership $resolveActiveMembership,
    ) {
    }

    public function store(
        StoreUnitRequest $request,
        CreateUnitAction $action,
    ): JsonResponse {
        $membership = $this->resolveActiveMembership->handle(
            $request->user()
        );

        $unit = $action->execute(
            tenantId: (string) $membership->tenant_id,
            actorId: $request->user()->id,
            data: $request->validated(),
        );

        return response()->json([
            'message' => 'تم إنشاء الوحدة بنجاح.',
            'data' => [
                'unit' => $unit,
            ],
        ], 201);
    }

    public function show(
        Request $request,
        string $unit,
    ): JsonResponse {
        $membership = $this->resolveActiveMembership->handle(
            $request->user()
        );

        $unitRecord = Unit::query()
            ->where('tenant_id', $membership->tenant_id)
            ->whereKey($unit)
            ->firstOrFail();

        return response()->json([
            'data' => [
                'unit' => $unitRecord,
            ],
        ]);
    }

    public function update(
        UpdateUnitRequest $request,
        string $unit,
        UpdateUnitAction $action,
    ): JsonResponse {
        $membership = $this->resolveActiveMembership->handle(
            $request->user()
        );

        $unitRecord = $action->execute(
            tenantId: (string) $membership->tenant_id,
            unitId: $unit,
            actorId: $request->user()->id,
            data: $request->validated(),
        );

        return response()->json([
            'message' => 'تم تحديث الوحدة بنجاح.',
            'data' => [
                'unit' => $unitRecord,
            ],
        ]);
    }
}
