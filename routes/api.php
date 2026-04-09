<?php

use App\Http\Controllers\Api\AdmissionController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\ContactUsController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\FooterController;
use App\Http\Controllers\Api\HamburgerController;
use App\Http\Controllers\Api\HappeningController;
use App\Http\Controllers\Api\HeaderController;
use App\Http\Controllers\Api\HomepageController;
use App\Http\Controllers\Api\LeadershipController;
use App\Http\Controllers\Api\MobileHeaderController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\ResearchController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\SchoolHeaderController;
use App\Http\Controllers\Api\SeoSettingController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\PopupController;
use Illuminate\Support\Facades\Route;

Route::get('/header', [HeaderController::class, 'header']);
Route::get('/hamburger', [HamburgerController::class, 'hamburger']);
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
Route::get('/courses/search-by-school/{slug}', [ProgramController::class,'searchCourseBySchool']);
Route::get('/courses/search-by-department/{slug}', [ProgramController::class,'searchCourseByDepartment']);

Route::get('/homepage', [HomepageController::class, 'index']);
Route::get('/homepage/sections/{section}', [HomepageController::class, 'getSection']);
Route::get('/homepage/sections', [HomepageController::class, 'getMultipleSections']);

Route::get('/leadership', [LeadershipController::class, 'listing']);
Route::get('/academic-council', [LeadershipController::class, 'academic_council']);
Route::get('/alumuni', [LeadershipController::class, 'alumuni']);
Route::get('/leadership/{slug}', [LeadershipController::class, 'detail']);

Route::get('/faculties', [FacultyController::class, 'listing']);
Route::get('/faculties/types/all', [FacultyController::class, 'types']);
Route::get('/faculties/{slug}', [FacultyController::class, 'detail']);

Route::get('/programs/{slug}', [ProgramController::class, 'listing']);
Route::get('/course/{slug}', [ProgramController::class, 'detail']);
Route::get('/program-list', [ProgramController::class, 'programList']);
Route::get('/school-department-list', [ProgramController::class, 'schoolDeparmentList']);

Route::get('/school-pages/{school}/{slug}', [SchoolController::class, 'schoolPages']);
Route::get('/faculties/types/school/{school}', [SchoolController::class, 'types']);
Route::get('/faculties/types/department/{department}', [DepartmentController::class, 'types']);
Route::get('/department-pages/{department}/{slug}', [DepartmentController::class, 'departmentPages']);
Route::get('/research/patents', [ResearchController::class, 'patents']);
Route::get('/research/conferences', [ResearchController::class, 'conferences']);
Route::get('/research/journals', [ResearchController::class, 'jss_research_journals']);
Route::get('/research/projects-submitted', [ResearchController::class, 'projects_submitted']);
Route::get('/research/projects-sanctioned', [ResearchController::class, 'projects_sanctioned']);
Route::get('/admission/faq', [FaqController::class, 'admission_faq']);
Route::get('/testimonials', [TestimonialController::class, 'list']);
Route::get('/testimonials/{slug}', [TestimonialController::class, 'details']);
Route::get('happening/count', [HappeningController::class, 'count']);


Route::get('/search', [SeoSettingController::class, 'globalSearch']);
Route::get('/seo/{slug}', [SeoSettingController::class, 'seo'])->where('slug', '.*');
Route::get('/popup', [PopupController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    
});