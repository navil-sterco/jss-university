<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\Pages;
use App\Models\Course;
use App\Models\Department;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DepartmentController extends Controller
{
    public function index($slug)
    {
        $today = Carbon::today();
        $departments = Department::where('slug',$slug)->first();

        if (!$departments) {
            return response()->json([
                'status' => false,
                'message' => 'Data not found',
            ], 404);
        }
        $id = $departments->id;

        $sections = [
            'banners' => $departments->banners->where('status', 1)->take(5)->map(fn($item) => [
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
                'title' => $departments->title,
                'subtitle' => $departments->subtitle,
                'description' => $departments->description,
                'stats' => $departments->factsAndFigures->where('status', true)->sortBy('display_order')->values()->take(3)->map(fn($item) => [
                    'id' => $item->id,
                    'logo' => $item->image ? asset($item->image) : "",
                    'value' => $item->figure,
                    'label' => $item->title,
                    'description' => $item->description,
                ]),
                'image' => $departments->image ? asset($departments->image) : asset('assets/img/placeholder.png'),
                'vision' => (object) [
                    'title' => $departments->vision_title,
                    'description' => $departments->vision_description,
                ],
                'mission' => (object) [
                    'title' => $departments->mission_title,
                    'points' => $departments->mission_points,
                ],
            ],

            'dean_message' => [
                'title' => $departments->hod_title, // missing
                'name' => $departments->hod_name,
                'designation' => $departments->hod_designation,
                'message' => $departments->hod_messages,
                'img' => asset($departments->hod_image),
            ],
            
            'courses_data' => [
                'title' => $departments->courses_title,
                'subtitle' => $departments->courses_subtitle,
                'image' => $departments->courses_image ? asset($departments->courses_image) : asset('assets/img/placeholder.png'),
                'courses' => Course::where('department_id',$id)->where('status', 1)->orderBy('display_order', 'asc')->take(5)->get()->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'category' => $item->degree->name ?? null,
                        'title' => $item->name,
                        'link' => $item->apply_now_link,
                    ];
                }),

                'admission_bar' => (object) [
                    'title' => $departments->academic_year,
                    'links' => $departments->useful_links ? json_decode($departments->useful_links) : null,
                    'download_button' => $departments->brochure ? asset($departments->brochure) : null,
                    'apply_button' => $departments->apply_now_link ? asset($departments->apply_now_link) : null,
                ],
            ],

            'faculty_data' => [
                'title' => $departments->faculty_title,
                'subtitle' => $departments->faculty_subtitle,
                'members' => $departments->faculties->where('status', 1)->map(fn($item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'designation' => $item->type->name ?? 'N/A',
                    'img' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                    'url' => $item->slug ? $item->slug : null,
                ]),
            ],

            'laboratories_data' => [
                'title' => $departments->lab_title,
                'subtitle' => $departments->lab_subtitle,
                'description' => $departments->lab_description,
                'url' => $departments->lab_url,
                'apply_button' => $departments->apply_now_link ? asset($departments->apply_now_link) : null,
                'labs' => Pages::where('department_id',$id)->where('type', "Laboratory")->where('status', 1)->orderBy('display_order', 'asc')->take(5)->get()->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->title,
                        'img' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                        'url' => $item->slug,
                    ];
                }),
            ],

            'faqs' => $departments->faqs->where('status', 1)->take(5)->map(fn($item) => [
                'id' => $item->id,
                'question' => $item->question,
                'answer' => $item->answer,
            ]),

            'happenings' => [
                'title' => $departments->happening_title,
                'subtitle' => $departments->happening_subtitle,
                'happenings' => $departments->happenings->where('status', 1)->sortBy('display_order')->values()->take(9)->map(function ($item) use ($today) {
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
            'departments_id' => $departments->id,
            'departments_name' => $departments->name,
            'departments_slug' => $departments->slug,
            'sections' => $sections,
        ]);
    }
}
