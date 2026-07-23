<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SystemSettingController;
use App\Modules\Customers\Controllers\CustomerController;
use App\Modules\Projects\Controllers\ProjectController;
use App\Modules\Reservations\Controllers\ReservationController;
use App\Modules\Units\Controllers\UnitController;
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

    Route::get('/reservations', [ReservationController::class, 'index'])->name('reservations.index');
    Route::get('/reservations/available-units', [ReservationController::class, 'availableUnits'])->name('reservations.available-units');
    Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');
    Route::get('/reservations/{reservation}', [ReservationController::class, 'show'])->name('reservations.show');
    Route::patch('/reservations/{reservation}', [ReservationController::class, 'update'])->name('reservations.update');
    Route::post('/reservations/{reservation}/cancel', [ReservationController::class, 'cancel'])->name('reservations.cancel');

    Route::post(
        '/units',
        [UnitController::class, 'store']
    )->name('units.store');

    Route::get(
        '/units',
        [UnitController::class, 'index']
    )->name('units.index');

    Route::get(
        '/units/{unit}',
        [UnitController::class, 'show']
    )->name('units.show');

    Route::patch(
        '/units/{unit}',
        [UnitController::class, 'update']
    )->name('units.update');

    Route::patch(
        '/units/{unit}/archive',
        [UnitController::class, 'archive']
    )->name('units.archive');

    Route::patch(
        '/units/{unit}/restore',
        [UnitController::class, 'restore']
    )->name('units.restore');

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
