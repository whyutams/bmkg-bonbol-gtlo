<?php

use App\Http\Controllers\PortalController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:60,1')->prefix('bmkg')->group(function () {
    Route::get('/gempa-terkini', [PortalController::class, 'apiGempaTerkini'])->name('api.bmkg.gempa.terkini');
    Route::get('/gempa-katalog', [PortalController::class, 'apiGempaKatalog'])->name('api.bmkg.gempa.katalog');
    Route::get('/gempa-dirasakan', [PortalController::class, 'apiGempaDirasakan'])->name('api.bmkg.gempa.dirasakan');
    Route::get('/shakemap/{filename}', [PortalController::class, 'apiShakemap'])->name('api.bmkg.gempa.shakemap');
    Route::get('/cuaca', [PortalController::class, 'apiCuaca'])->name('api.bmkg.cuaca');
});
