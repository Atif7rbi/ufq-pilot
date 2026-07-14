<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSystemSettingRequest;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;

class SystemSettingController extends Controller
{
    public function show(): JsonResponse
    {
        $settings = SystemSetting::query()->firstOrFail();

        return response()->json([
            'data' => $settings,
        ]);
    }

    public function update(
        UpdateSystemSettingRequest $request
    ): JsonResponse {
        $settings = SystemSetting::query()->firstOrFail();

        $settings->update($request->validated());

        return response()->json([
            'message' => 'تم تحديث إعدادات النظام بنجاح.',
            'data' => $settings->fresh(),
        ]);
    }
}
