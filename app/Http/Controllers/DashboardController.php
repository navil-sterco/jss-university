<?php

namespace App\Http\Controllers;
use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Banner;
use App\Models\Course;
use App\Models\School;
use App\Models\Program;
use App\Models\Happening;
use App\Models\Recruiter;
use App\Models\Department;
use App\Models\Testimonial;
use App\Models\FactsAndFigures;


class DashboardController extends Controller
{
    public function index()
    {
        $schoolCount = School::count();
        $schoolActiveCount = School::where('status', 'active')->count();
        $schoolActivePercent = $schoolCount > 0 ? round(($schoolActiveCount / $schoolCount) * 100) : 0;

        $departmentCount = Department::count();
        $departmentActiveCount = Department::where('status', 'active')->count();
        $departmentActivePercent = $departmentCount > 0 ? round(($departmentActiveCount / $departmentCount) * 100) : 0;

        $programCount = Program::count();
        $programActiveCount = Program::where('status', 'active')->count();
        $programActivePercent = $programCount > 0 ? round(($programActiveCount / $programCount) * 100) : 0;

        $courseCount = Course::count();
        $courseActiveCount = Course::where('status', 'active')->count();
        $courseActivePercent = $courseCount > 0 ? round(($courseActiveCount / $courseCount) * 100) : 0;

        $bannerCount = Banner::count();
        $testimonialCount = Testimonial::count();
        $happeningCount = Happening::count();
        $factsAndFiguresCount = FactsAndFigures::count();
        $recruiterCount = Recruiter::count();

        $today = Carbon::today();

        $upcomingEvent= Happening::where('status', 1)->whereDate('event_date_from', '>=', $today)->take(2)->get();

        $schools = School::select('name', 'slug')->take(5)->get();

        return Inertia::render('Dashboard/Dashboard',[
            'schoolcount' => $schoolCount,
            'schoolactivecount' => $schoolActiveCount,
            'schoolactivepercent' => $schoolActivePercent,
            
            'departmentcount' => $departmentCount,
            'departmentactivecount' => $departmentActiveCount,
            'departmentactivepercent' => $departmentActivePercent,
            
            'programcount' => $programCount,
            'programactivecount' => $programActiveCount,
            'programactivepercent' => $programActivePercent,
            
            'coursecount' => $courseCount,
            'courseactivecount' => $courseActiveCount,
            'courseactivepercent' => $courseActivePercent,
            
            'bannercount' => $bannerCount,
            'testimonialcount' => $testimonialCount,
            'happeningcount' => $happeningCount,
            'factsandfigurescount' => $factsAndFiguresCount,
            'recruitercount' => $recruiterCount,
            'upcomingevent' => $upcomingEvent,
            'schools' => $schools,
        ]);
    }
}
