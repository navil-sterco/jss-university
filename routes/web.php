<?php

use App\Http\Controllers\AdmissionController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\ContactFormController;
use App\Http\Controllers\ContactInfoController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DegreeController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\FactsAndFiguresController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\FooterController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\HamburgerController;
use App\Http\Controllers\HappeningController;
use App\Http\Controllers\HeaderController;
use App\Http\Controllers\HomepageController;
use App\Http\Controllers\LeadershipCategoryController;
use App\Http\Controllers\LeadershipController;
use App\Http\Controllers\MainHeaderController;
use App\Http\Controllers\MobileHeaderController;
use App\Http\Controllers\PopupController;
use App\Http\Controllers\PagesController;
use App\Http\Controllers\PageSectionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProgramController;
use App\Http\Controllers\RecruiterController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\SchoolHeaderController;
use App\Http\Controllers\SectionTemplateController;
use App\Http\Controllers\SeoSettingController;
use App\Http\Controllers\TabController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\TypeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
        Route::get('/{page}/mapping', [PagesController::class, 'mapping'])->name('pages.mapping');
        Route::post('{id}/mapping', [PagesController::class, 'attachMapping'])->name('pages.mapping.attach');
    });

    //pages sections
    Route::prefix('pages/sections')->group(function () {
        Route::get('/{page}', [PageSectionController::class, 'index'])->name('sections.index');
        Route::post('/store', [PageSectionController::class, 'store'])->name('sections.store');
        Route::get('/{group_key}/delete', [PageSectionController::class, 'deleteSection'])->name('sections.delete');
        Route::post('item/update', [PageSectionController::class, 'updateItem'])->name('sections.item.update');
        Route::get('item/{id}/delete', [PageSectionController::class, 'deleteItem'])->name('sections.item.delete');
    });

    // Section templates (Page Builder inputs)
    Route::resource('section-templates', SectionTemplateController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->names('section-templates');

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
        Route::post('/{course}/duplicate', [CourseController::class, 'duplicate'])->name('course.duplicate');
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

    //Degree
    Route::resource('degree', DegreeController::class)->except(['destroy']);
    Route::prefix('degree')->group(function () {
        Route::get('/{degree}/destroy', [DegreeController::class, 'destroy'])->name('degree.destroy');
        Route::post('/{id}/toggle-status', [DegreeController::class, 'toggleStatus'])->name('degree.toggleStatus');
        Route::get('/{degree}/mapping', [DegreeController::class, 'mapping'])->name('degree.mapping');
        Route::post('{id}/mapping', [DegreeController::class, 'attachMapping'])->name('degree.mapping.attach');
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

    //Faq's
    Route::resource('faq', FaqController::class)->except(['destroy']);
    Route::prefix('faq')->group(function () {
        Route::get('/{faq}/destroy', [FaqController::class, 'destroy'])->name('faq.destroy');
        Route::post('/{id}/toggle-status', [FaqController::class, 'toggleStatus'])->name('faq.toggleStatus');
        Route::get('/{faq}/mapping', [FaqController::class, 'mapping'])->name('faq.mapping');
        Route::post('{id}/mapping', [FaqController::class, 'attachMapping'])->name('faq.mapping.attach');
    });

    //Faculties
    Route::resource('faculty', FacultyController::class)->except(['destroy']);
    Route::prefix('faculty')->group(function () {
        Route::get('/{faculty}/destroy', [FacultyController::class, 'destroy'])->name('faculty.destroy');
        Route::post('/{faculty}/duplicate', [FacultyController::class, 'duplicate'])->name('faculty.duplicate');
        Route::post('/{id}/toggle-status', [FacultyController::class, 'toggleStatus'])->name('faculty.toggleStatus');
        Route::get('/{faculty}/mapping', [FacultyController::class, 'mapping'])->name('faculty.mapping');
        Route::post('{id}/mapping', [FacultyController::class, 'attachMapping'])->name('faculty.mapping.attach');
    });

    //Leadership
    Route::resource('leadership', LeadershipController::class)->except(['destroy']);
    Route::prefix('leadership')->group(function () {
        Route::get('/{leadership}/destroy', [LeadershipController::class, 'destroy'])->name('leadership.destroy');
        Route::post('/{id}/toggle-status', [LeadershipController::class, 'toggleStatus'])->name('leadership.toggleStatus');
        Route::get('/{leadership}/mapping', [LeadershipController::class, 'mapping'])->name('leadership.mapping');
        Route::post('{id}/mapping', [LeadershipController::class, 'attachMapping'])->name('leadership.mapping.attach');
    });

    //Types
    Route::resource('types', TypeController::class)->only(['store', 'update', 'destroy']);
    // leadership categories for dynamic select
    Route::resource('leadership-categories', LeadershipCategoryController::class)->only(['store', 'update', 'destroy']);

    //Homepage
    Route::get('home', [HomepageController::class, 'createSections'])->name('home');
    Route::post('home/sections/update', [HomepageController::class, 'storeOrUpdate'])->name('home.section.update');

    //Main Header
    Route::resource('headers', HeaderController::class)->except(['destroy']);
    Route::prefix('headers')->group(function () {
        Route::get('/{header}/destroy', [HeaderController::class, 'destroy'])->name('headers.destroy');
        Route::post('/update-order', [HeaderController::class, 'updateOrder'])->name('headers.update-order');
        Route::post('/{id}/toggle-status', [HeaderController::class, 'toggleStatus'])->name('headers.toggle-status');
    });

    //School Header
    Route::resource('school-header', SchoolHeaderController::class)->except(['destroy']);
    Route::prefix('school-headers')->group(function () {
        Route::get('/{schoolHeader}/destroy', [SchoolHeaderController::class, 'destroy'])->name('school-header.destroy');
        Route::post('/update-order', [SchoolHeaderController::class, 'updateOrder'])->name('school-header.update-order');
        Route::post('/{schoolHeader}/toggle-status', [SchoolHeaderController::class, 'toggleStatus'])->name('school-header.toggle-status');
    });

    //Mobile Header
    Route::resource('mobile-headers', MobileHeaderController::class)->except(['destroy']);
    Route::prefix('mobile-headers')->group(function () {
        Route::get('/{mobileHeader}/destroy', [MobileHeaderController::class, 'destroy'])->name('mobile-headers.destroy');
        Route::post('/update-order', [MobileHeaderController::class, 'updateOrder'])->name('mobile-headers.update-order');
        Route::post('/{mobileHeader}/toggle-status', [MobileHeaderController::class, 'toggleStatus'])->name('mobile-headers.toggle-status');
    });

    //Hamburger Header
    Route::resource('hamburger', HamburgerController::class)->except(['destroy']);
    Route::prefix('hamburger')->group(function () {
        Route::get('/{hamburger}/destroy', [HamburgerController::class, 'destroy'])->name('hamburger.destroy');
        Route::post('/update-order', [HamburgerController::class, 'updateOrder'])->name('hamburger.update-order');
        Route::post('/{id}/toggle-status', [HamburgerController::class, 'toggleStatus'])->name('hamburger.toggle-status');
    });

    //Footer
    Route::get('/footer',[FooterController::class, 'index'])->name('footer.index');
    Route::put('/footer/update',[FooterController::class, 'update'])->name('footer.update');

    //Contact Info
    Route::get('/contact',[ContactInfoController::class, 'edit'])->name('contact.edit');
    Route::put('/contact',[ContactInfoController::class, 'update'])->name('contact.update');

    //Contact Form
    Route::resource('form', ContactFormController::class)->except(['destroy']);
    Route::prefix('form')->group(function () {
        Route::get('/{contactForm}/destroy', [ContactFormController::class, 'destroy'])->name('form.destroy');
    });

    //Admission
    Route::get('/admission',[AdmissionController::class, 'edit'])->name('admission.edit');
    Route::put('/admission',[AdmissionController::class, 'update'])->name('admission.update');

    //Tabs
    Route::resource('tab', TabController::class)->except(['destroy']);
    Route::prefix('tab')->group(function () {
        Route::get('/{tab}/destroy', [TabController::class, 'destroy'])->name('tab.destroy');
    });

    //Seo
    Route::resource('seo', SeoSettingController::class)->except(['destroy']);
    Route::prefix('seo')->group(function () {
        Route::get('/{seo}/destroy', [SeoSettingController::class, 'destroy'])->name('seo.destroy');
    });

    //Popup
    Route::get('/popup', [PopupController::class, 'edit'])->name('popup.edit');
    Route::post('/popup', [PopupController::class, 'update'])->name('popup.update');
});

require __DIR__.'/auth.php';
