<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\PagesController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\HeaderController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\HomepageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HappeningController;
use App\Http\Controllers\RecruiterController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\MainHeaderController;
use App\Http\Controllers\PageSectionController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\FactsAndFiguresController;

Route::get('/', function () {
    return redirect()->route('dashboard');
});
Route::get('/login', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard/Dashboard');
// })->middleware(['auth', 'verified', 'is_admin'])->name('dashboard');

Route::middleware('auth', 'is_admin')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    //Profile  
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    //Pages
    Route::resource('pages', PagesController::class)->except(['destroy']);
    Route::prefix('pages')->group(function () {
        Route::get('/{page}/destroy', [PagesController::class, 'destroy'])->name('pages.destroy');
        Route::post('/{page}/duplicate', [PagesController::class, 'duplicate'])->name('pages.duplicate');
        Route::post('/{id}/toggle-status', [PagesController::class, 'toggleStatus'])->name('pages.toggleStatus');
    });

    //pages sections
    Route::prefix('pages/sections')->group(function () {
        Route::get('/{page}', [PageSectionController::class, 'index'])->name('sections.index');
        Route::post('/store', [PageSectionController::class, 'store'])->name('sections.store');
        Route::get('/{group_key}/delete', [PageSectionController::class, 'deleteSection'])->name('sections.delete');
        Route::post('item/update', [PageSectionController::class, 'updateItem'])->name('sections.item.update');
        Route::get('item/{id}/delete', [PageSectionController::class, 'deleteItem'])->name('sections.item.delete');
    });

    //Banner
    Route::resource('banners', BannerController::class)->except(['destroy']);
    Route::prefix('banner')->group(function () {
        Route::get('/{banner}/destroy', [BannerController::class, 'destroy'])->name('banner.destroy');
        Route::post('/{id}/toggle-status', [BannerController::class, 'toggleStatus'])->name('banner.toggleStatus');
        Route::get('/{banner}/mapping', [BannerController::class, 'mapping'])->name('banner.mapping');
        Route::post('{id}/mapping', [BannerController::class, 'attachMapping'])->name('banners.mapping.attach');
    });

    //School
    Route::resource('schools', SchoolController::class)->except(['destroy']);
    Route::prefix('schools')->group(function () {
        Route::get('{id}/sections/create', [SchoolController::class, 'createSections'])->name('school.section.create');
        Route::post('{id}/sections/update', [SchoolController::class, 'storeOrUpdate'])->name('school.section.update');
        Route::get('/{school}/destroy', [SchoolController::class, 'destroy'])->name('schools.destroy');
        Route::post('/{id}/toggle-status', [SchoolController::class, 'toggleStatus'])->name('schools.toggleStatus');
    });

    //Testimonial
    Route::resource('testimonial', TestimonialController::class)->except(['destroy']);
    Route::prefix('testimonial')->group(function () {
        Route::get('/{testimonial}/destroy', [TestimonialController::class, 'destroy'])->name('testimonial.destroy');
        Route::post('/{id}/toggle-status', [TestimonialController::class, 'toggleStatus'])->name('testimonial.toggleStatus');
        Route::get('/{testimonial}/mapping', [TestimonialController::class, 'mapping'])->name('testimonial.mapping');
        Route::post('{id}/mapping', [TestimonialController::class, 'attachMapping'])->name('testimonial.mapping.attach');
    });

    //Happening
    Route::resource('happening', HappeningController::class)->except(['destroy']);
    Route::prefix('happening')->group(function () {
        Route::get('/{happening}/destroy', [HappeningController::class, 'destroy'])->name('happening.destroy');
        Route::post('/{id}/toggle-status', [HappeningController::class, 'toggleStatus'])->name('happening.toggleStatus');
        Route::get('/{happening}/mapping', [HappeningController::class, 'mapping'])->name('happening.mapping');
        Route::post('{id}/mapping', [HappeningController::class, 'attachMapping'])->name('happening.mapping.attach');
    });

    //Gallery
    Route::resource('galleries',GalleryController::class)->except(['destroy', 'update']);
    Route::prefix('galleries')->group(function () {
        Route::get('/{gallery}/destroy', [GalleryController::class, 'destroy'])->name('galleries.destroy');
        Route::post('/update/{gallery}', [GalleryController::class, 'update'])->name('galleries.update');
        Route::get('/{gallery}/mapping', [GalleryController::class, 'mapping'])->name('galleries.mapping');
        Route::post('{id}/mapping', [GalleryController::class, 'attachMapping'])->name('galleries.mapping.attach');
    });

    //Department
    Route::resource('department', DepartmentController::class)->except(['destroy']);
    Route::prefix('department')->group(function () {
        Route::get('/{department}/destroy', [DepartmentController::class, 'destroy'])->name('department.destroy');
        Route::post('/{id}/toggle-status', [DepartmentController::class, 'toggleStatus'])->name('department.toggleStatus');
        Route::get('/{department}/mapping', [DepartmentController::class, 'mapping'])->name('department.mapping');
        Route::post('{id}/mapping', [DepartmentController::class, 'attachMapping'])->name('department.mapping.attach');
        Route::get('{id}/sections/create', [DepartmentController::class, 'createSections'])->name('department.section.create');
        Route::post('{id}/sections/update', [DepartmentController::class, 'storeOrUpdate'])->name('department.section.update');
    });

    //Courses
    Route::resource('course', CourseController::class)->except(['destroy']);
    Route::prefix('course')->group(function () {
        Route::get('/{course}/destroy', [CourseController::class, 'destroy'])->name('course.destroy');
        Route::post('/{id}/toggle-status', [CourseController::class, 'toggleStatus'])->name('course.toggleStatus');
        Route::get('/{course}/mapping', [CourseController::class, 'mapping'])->name('course.mapping');
        Route::post('{id}/mapping', [CourseController::class, 'attachMapping'])->name('course.mapping.attach');
        Route::get('{id}/sections/create', [CourseController::class, 'createSections'])->name('course.section.create');
        Route::post('{id}/sections/update', [CourseController::class, 'storeOrUpdate'])->name('course.section.update');
    });

    //Programs
    Route::resource('program', ProgramController::class)->except(['destroy']);
    Route::prefix('program')->group(function () {
        Route::get('/{program}/destroy', [ProgramController::class, 'destroy'])->name('program.destroy');
        Route::post('/{id}/toggle-status', [ProgramController::class, 'toggleStatus'])->name('program.toggleStatus');
        Route::get('/{program}/mapping', [ProgramController::class, 'mapping'])->name('program.mapping');
        Route::post('{id}/mapping', [ProgramController::class, 'attachMapping'])->name('program.mapping.attach');
    });

    //Facts And Figures
    Route::resource('facts-and-figures', FactsAndFiguresController::class)->except(['destroy']);
    Route::prefix('facts-and-figures')->group(function () {
        Route::get('/{factsAndFigures}/destroy', [FactsAndFiguresController::class, 'destroy'])->name('facts-and-figures.destroy');
        Route::post('/{id}/toggle-status', [FactsAndFiguresController::class, 'toggleStatus'])->name('facts-and-figures.toggleStatus');
        Route::get('/{factsAndFigures}/mapping', [FactsAndFiguresController::class, 'mapping'])->name('facts-and-figures.mapping');
        Route::post('{id}/mapping', [FactsAndFiguresController::class, 'attachMapping'])->name('facts-and-figures.mapping.attach');
    });

    //Recruiters
    Route::resource('recruiters', RecruiterController::class)->except(['destroy']);
    Route::prefix('recruiters')->group(function () {
        Route::get('/{recruiter}/destroy', [RecruiterController::class, 'destroy'])->name('recruiters.destroy');
        Route::post('/{id}/toggle-status', [RecruiterController::class, 'toggleStatus'])->name('recruiters.toggleStatus');
        Route::get('/{recruiters}/mapping', [RecruiterController::class, 'mapping'])->name('recruiters.mapping');
        Route::post('{id}/mapping', [RecruiterController::class, 'attachMapping'])->name('recruiters.mapping.attach');
    });

    //Homepage
    Route::get('home', [HomepageController::class, 'createSections'])->name('home');
    Route::post('home/sections/update', [HomepageController::class, 'storeOrUpdate'])->name('home.section.update');

    //Main header
    Route::resource('headers', HeaderController::class)->except(['destroy']);
    Route::prefix('headers')->group(function () {
        Route::get('/{header}/destroy', [HeaderController::class, 'destroy'])->name('headers.destroy');
        Route::post('/update-order', [HeaderController::class, 'updateOrder'])->name('headers.update-order');
        Route::post('/{id}/toggle-status', [HeaderController::class, 'toggleStatus'])->name('headers.toggle-status');
    });
});

require __DIR__.'/auth.php';
