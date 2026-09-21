<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\BulletinController;
use App\Http\Controllers\Admin\HthController;
use App\Http\Controllers\Admin\IkmController;
use App\Http\Controllers\Admin\PosHujanController;
use App\Http\Controllers\Admin\PtspController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\WarningController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PortalController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PortalController::class, 'beranda'])->name('beranda');
Route::get('/profil', [PortalController::class, 'profil'])->name('profil');
Route::get('/cuaca', [PortalController::class, 'cuaca'])->name('cuaca');
Route::get('/iklim', [PortalController::class, 'iklim'])->name('iklim');
Route::get('/gempa', [PortalController::class, 'gempa'])->name('gempa');
Route::get('/layanan', [PortalController::class, 'layanan'])->name('layanan');

Route::post('/layanan/ptsp', [PortalController::class, 'submitPtsp'])->name('layanan.ptsp.submit');
Route::post('/layanan/ikm', [PortalController::class, 'submitIkm'])->name('layanan.ikm.submit');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('role:superadmin,admin,staf')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/hth', [HthController::class, 'index'])->name('hth.index');
        Route::post('/hth', [HthController::class, 'store'])->name('hth.store');
        Route::put('/hth/{hth}', [HthController::class, 'update'])->name('hth.update');

        Route::get('/bulletins', [BulletinController::class, 'index'])->name('bulletins.index');
        Route::post('/bulletins', [BulletinController::class, 'store'])->name('bulletins.store');
        Route::delete('/bulletins/{bulletin}', [BulletinController::class, 'destroy'])->name('bulletins.destroy');

        Route::get('/pos-hujan', [PosHujanController::class, 'index'])->name('pos-hujan.index');
        Route::post('/pos-hujan', [PosHujanController::class, 'store'])->name('pos-hujan.store');
        Route::put('/pos-hujan/{posHujan}', [PosHujanController::class, 'update'])->name('pos-hujan.update');
        Route::delete('/pos-hujan/{posHujan}', [PosHujanController::class, 'destroy'])->name('pos-hujan.destroy');

        Route::get('/ptsp', [PtspController::class, 'index'])->name('ptsp.index');
        Route::put('/ptsp/{ticket}/status', [PtspController::class, 'updateStatus'])->name('ptsp.update-status');
    });

    Route::middleware('role:superadmin,admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/warnings', [WarningController::class, 'index'])->name('warnings.index');
        Route::post('/warnings', [WarningController::class, 'store'])->name('warnings.store');

        Route::get('/ikm', [IkmController::class, 'index'])->name('ikm.index');
    });

    Route::middleware('role:superadmin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::patch('/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

        Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
