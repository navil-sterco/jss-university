<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\School;
use App\Models\Program;
use App\Models\Department;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SchoolController extends Controller
{
    public function index($slug)
    {
        $today = Carbon::today();
        $school = School::where('slug',$slug)->first();
        $id = $school->id;

        if (!$school) {
            return response()->json([
                'status' => false,
                'message' => 'School not found',
            ], 404);
        }

        $sections = [
            'banners' => $school->banners->take(5)->map(fn($item) => [
                'id' => $item->id,
                'title' => $item->heading,
                'desc' => $item->subheading,
                'linked_text' => $item->linked_text,
                'url' => $item->link,
                'desktop_banner' => asset($item->image),
                'mobile_banner' => asset($item->mobile_image),
                'display_order' => $item->display_order,
            ]),

            'about_school' => [
                'title' => $school->about_school_title,
                'subtitle' => $school->about_school_subtitle,
                'description' => $school->about_school_description,
                'logo_content' => $school->about_school_logo_content,
                'stats_number' => $school->about_school_stats_number,
                'stats_content' => $school->about_school_stats_content,
                'chancellor_img' => $school->about_school_chancellor_img ? asset($school->about_school_chancellor_img) : asset('assets/img/placeholder.png'),
                'chancellor_logo' => $school->about_school_chancellor_logo ? asset($school->about_school_chancellor_logo) : asset('assets/img/placeholder.png'),
                'highlights' => $school->about_highlights,
                'buttons' => $school->about_buttons,
            ],

            'course_data' => [
                'title' => $school->department_title,
                'description' => $school->department_desc,
                'programs' => Program::where('status', 1)->orderBy('display_order', 'asc')->take(5)->get()->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                        'name_short' => $item->name_short,
                        'slug' => $item->slug,
                    ];
                }),
                'programs_count' => $school->department_programs_count,
                'programs_text' => $school->department_programs_text,
                'buttons' => $school->department_buttons,
                'departments' => Department::where('school_id',$id)->where('status', 1)->orderBy('display_order', 'asc')->take(5)->get()->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'slug' => $item->slug,
                        'short_name' => $item->short_name,
                    ];
                }),
            ],

            'placements' => [
                'title' => $school->placement_title,
                'subtitle' => $school->placement_subtitle,
                'facts_and_figures' => $school->factsAndFigures->where('status', true)->sortBy('display_order')->values()->take(5)->map(fn($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'figure' => $item->figure,
                ]),
                'hall_of_fame' => [
                    'image' => $school->hall_of_fame_image ? asset($school->hall_of_fame_image) : asset('assets/img/placeholder.png'),
                    'heading' => $school->hall_of_fame_heading,
                    'url' => $school->hall_of_fame_url,
                ],
                'testimonials' => $school->testimonials->where('status', true)->where('type','placement')->sortBy('display_order')->values()->take(15)->map(fn($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'name' => $item->name,
                    'course' => $item->course,
                    'batch' => $item->batch,
                    'slug' => $item->slug,
                    'alt_text' => $item->alt_text,
                    'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                    'video_url' => $item->video_url,
                    'short_description' => $item->short_description,
                    'designation' => $item->designation,
                    'location' => $item->location,
                    'company' => $item->company,
                ]),
                'recruiters' => $school->recruiters->where('status', true)->sortBy('display_order')->values()->take(20)->map(fn($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                    'description' => $item->description,
                ]),
            ],

            'testimonials' => [
                'title' => $school->testimonial_title,
                'subtitle' => $school->testimonial_subtitle,
                'testimonials' => $school->testimonials->where('status', true)->whereNotIn('type','placement')->sortBy('display_order')->values()->take(5)->map(fn($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'name' => $item->name,
                    'course' => $item->course,
                    'batch' => $item->batch,
                    'slug' => $item->slug,
                    'alt_text' => $item->alt_text,
                    'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                    'video_url' => $item->video_url,
                    'short_description' => $item->short_description,
                    'designation' => $item->designation,
                    'location' => $item->location,
                    'company' => $item->company,
                ]),
            ],

            'happenings' => [
                'title' => $school->happening_title,
                'subtitle' => $school->happening_subtitle,
                'happenings' => $school->happenings->where('status', 1)->sortBy('display_order')->values()->take(9)->map(function ($item) use ($today) {
                    return [
                        'id' => $item->id,
                        'event_type' => $item->event_type,
                        'upcoming_event' => $item->event_date_from > $today,
                        'title' => $item->title,
                        'slug' => $item->slug,
                        'alt_text' => $item->title,
                        'image' => $item->image 
                            ? asset($item->image) 
                            : asset('assets/img/placeholder.png'),
                        'banner_images' => $item->banner_images 
                            ? asset($item->banner_images) 
                            : asset('assets/img/placeholder.png'),
                        'event_date_from' => $item->event_date_from,
                        'event_date_to' => $item->event_date_to,
                        'short_description' => $item->short_description,
                    ];
                }),
            ],
        ];

        return response()->json([
            'status' => true,
            'school_id' => $school->id,
            'school_name' => $school->name,
            'school_slug' => $school->slug,
            'sections' => $sections,
        ]);
    }

    public function allSchools()
    {
        $schools = School::where('status', 1)
            ->orderBy('name', 'asc')
            ->get(['id', 'name']);

        return response()->json([
            'success' => true,
            'data' => $schools
        ], 200);
    }
}
