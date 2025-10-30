<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\HomepageController;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\HappeningController;
use App\Http\Controllers\Api\PasswordResetLinkController;

Route::prefix('auth')->group(function() {
    Route::post('/register', [RegisterController::class, 'store']);
    Route::post('/login', [LoginController::class, 'login']);
    Route::post('/logout', [LoginController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
});

Route::get('homepage/banners', [BannerController::class, 'index']);
Route::get('/pages/{id}', [PageController::class, 'show']);

Route::get('/school/{id}', [SchoolController::class, 'index']);

Route::prefix('happenings')->group(function () {
    Route::get('/', [HappeningController::class, 'index']);
    Route::get('/event-types', [HappeningController::class, 'getEventTypes']);
    Route::get('/{slug}', [HappeningController::class, 'show']);
});
Route::get('/schools/all', [SchoolController::class, 'allSchools']);

Route::get('/homepage', [HomepageController::class, 'index']);
Route::get('/homepage/sections/{section}', [HomepageController::class, 'getSection']);
Route::get('/homepage/sections', [HomepageController::class, 'getMultipleSections']);

Route::middleware('auth:sanctum')->group(function () {
    
});