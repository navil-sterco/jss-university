<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\FooterController;
use App\Http\Controllers\Api\HeaderController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\HomepageController;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\AdmissionController;
use App\Http\Controllers\Api\ContactUsController;
use App\Http\Controllers\Api\HappeningController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\LeadershipController;
use App\Http\Controllers\Api\SeoSettingController;
use App\Http\Controllers\Api\MobileHeaderController;
use App\Http\Controllers\Api\SchoolHeaderController;
use App\Http\Controllers\Api\PasswordResetLinkController;

Route::prefix('auth')->group(function() {
    Route::post('/register', [RegisterController::class, 'store']);
    Route::post('/login', [LoginController::class, 'login']);
    Route::post('/logout', [LoginController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
});

Route::get('/header', [HeaderController::class, 'header']);
Route::get('/school-header', [SchoolHeaderController::class, 'header']);
Route::get('/mobile-header', [MobileHeaderController::class, 'header']);
Route::get('/admission', [AdmissionController::class, 'index']);
Route::get('/footer',[FooterController::class, 'index']);

Route::get('/homepage/banners', [BannerController::class, 'index']);
Route::get('/pages/{slug}', [PageController::class, 'show']);

Route::get('/schools/all', [SchoolController::class, 'allSchools']);
Route::get('/school/{slug}', [SchoolController::class, 'index']);
Route::get('/department/{slug}', [DepartmentController::class, 'index']);

Route::prefix('happenings')->group(function () {
    Route::get('/', [HappeningController::class, 'happenings']);
    Route::get('/gallery', [HappeningController::class, 'gallery']);
    Route::get('/media-coverage', [HappeningController::class, 'mediaCoverage']);
    Route::get('/press-release', [HappeningController::class, 'pressRlease']);
    Route::get('/event-types', [HappeningController::class, 'getEventTypes']);
    Route::get('/{slug}', [HappeningController::class, 'show']);
});

Route::post('/contact-form', [ContactUsController::class,'store']);
Route::get('/contact-info', [ContactUsController::class,'index']);
Route::get('/course-list', [ContactUsController::class,'coursesList']);
Route::get('/courses/search', [ProgramController::class,'searchCourse']);

Route::get('/homepage', [HomepageController::class, 'index']);
Route::get('/homepage/sections/{section}', [HomepageController::class, 'getSection']);
Route::get('/homepage/sections', [HomepageController::class, 'getMultipleSections']);

Route::get('/leadership', [LeadershipController::class, 'listing']);
Route::get('/leadership/{slug}', [LeadershipController::class, 'detail']);

Route::get('/faculties', [FacultyController::class, 'listing']);
Route::get('/faculties/types/all', [FacultyController::class, 'types']);
Route::get('/faculties/{slug}', [FacultyController::class, 'detail']);

Route::get('/programs/{slug}', [ProgramController::class, 'listing']);
Route::get('/course/{slug}', [ProgramController::class, 'detail']);
Route::get('/program-list', [ProgramController::class, 'programList']);
Route::get('/school-department-list', [ProgramController::class, 'schoolDeparmentList']);

Route::get('/seo/{slug}', [SeoSettingController::class, 'seo'])->where('slug', '.*');

Route::middleware('auth:sanctum')->group(function () {
    
});