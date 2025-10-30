<?php

namespace App\Http\Controllers\Api;

use App\Models\School;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SchoolController extends Controller
{
    public function index($id)
    {
        $school = School::with('banners')->find($id);

        if (!$school) {
            return response()->json([
                'status' => false,
                'message' => 'School not found',
            ], 404);
        }

        $sections = [
            'banners' => $school->banners->map(fn($banner) => [
                'id' => $banner->id,
                'title' => $banner->heading,
                'desc' => $banner->subheading,
                'linked_text' => $banner->linked_text,
                'url' => $banner->link,
                'img' => asset($banner->image),
                'display_order' => $banner->display_order,
            ]),

            'about_school' => [
                'title' => $school->about_school_title,
                'subtitle' => $school->about_school_subtitle,
                'description' => $school->about_school_description,
                'logo_content' => $school->about_school_logo_content,
                'stats_number' => $school->about_school_stats_number,
                'stats_content' => $school->about_school_stats_content,
                'chancellor_img' => $school->about_school_chancellor_img,
                'chancellor_logo' => $school->about_school_chancellor_logo,
                'highlight' => [
                    'rank' => $school->highlight_1_rank,
                    'text' => $school->highlight_1_text,
                    'source' => $school->highlight_1_source,
                ],
                'buttons' => [
                    ['text' => $school->button_1_text, 'url' => $school->button_1_url],
                    ['text' => $school->button_2_text, 'url' => $school->button_2_url],
                    ['text' => $school->button_3_text, 'url' => $school->button_3_url],
                ],
            ],

            'departments' => [
                'title' => $school->department_title,
                'description' => $school->department_desc,
                'programs_count' => $school->department_programs_count,
                'programs_text' => $school->department_programs_text,
                'buttons' => [
                    ['text' => $school->department_button_1_text, 'url' => $school->department_button_1_url],
                    ['text' => $school->department_button_2_text, 'url' => $school->department_button_2_url],
                ],
            ],

            'placements' => [
                'title' => $school->placement_title,
                'subtitle' => $school->placement_subtitle,
                'hall_of_fame' => [
                    'image' => $school->hall_of_fame_image,
                    'heading' => $school->hall_of_fame_heading,
                    'url' => $school->hall_of_fame_url,
                ],
            ],

            'testimonials' => [
                'title' => $school->testimonial_title,
                'subtitle' => $school->testimonial_subtitle,
            ],

            'happenings' => [
                'title' => $school->happening_title,
                'subtitle' => $school->happening_subtitle,
            ],
        ];

        return response()->json([
            'status' => true,
            'school_id' => $school->id,
            'school_name' => $school->name,
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
