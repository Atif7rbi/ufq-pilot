<?php

use App\Http\Controllers\Api\SystemSettingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/system-settings', [SystemSettingController::class, 'show']);

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::put(
        '/system-settings',
        [SystemSettingController::class, 'update']
    );
});
