<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SystemSettingController;
use App\Modules\Customers\Controllers\CustomerController;
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

    Route::get(
        '/customers',
        [CustomerController::class, 'index']
    )->name('customers.index');

    Route::post(
        '/customers',
        [CustomerController::class, 'store']
    )->name('customers.store');

    Route::get(
        '/customers/{customer}',
        [CustomerController::class, 'show']
    )->name('customers.show');

    Route::patch(
        '/customers/{customer}',
        [CustomerController::class, 'update']
    )->name('customers.update');

    Route::patch(
        '/customers/{customer}/archive',
        [CustomerController::class, 'archive']
    )->name('customers.archive');

    Route::patch(
        '/customers/{customer}/restore',
        [CustomerController::class, 'restore']
    )->name('customers.restore');
});
