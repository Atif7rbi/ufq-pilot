<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SystemSettingController;
use App\Modules\Projects\Controllers\ProjectController;
use App\Modules\Users\Controllers\TenantUserController;
use Illuminate\Support\Facades\Route;

Route::get(
    '/system-settings',
    [SystemSettingController::class, 'show']
);

Route::post(
    '/auth/login',
    [AuthController::class, 'login']
)->middleware('throttle:5,1');

Route::middleware([
    'auth:sanctum',
    'tenant.active',
])->group(function (): void {

    Route::get(
        '/auth/user',
        [AuthController::class, 'user']
    );

    Route::post(
        '/auth/logout',
        [AuthController::class, 'logout']
    );

    Route::put(
        '/system-settings',
        [SystemSettingController::class, 'update']
    );

    Route::apiResource(
        'projects',
        ProjectController::class
    );

    Route::apiResource(
        'users',
        TenantUserController::class
    );
});
