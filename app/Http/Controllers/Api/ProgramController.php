<?php

namespace App\Http\Controllers\Api;

use App\Models\Course;
use App\Models\Degree;
use App\Models\School;
use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;

class ProgramController extends Controller
{
    public function listing($slug)
    {
        $validated = request()->validate([
            'department_id' => 'nullable|integer|exists:departments,id',
            'school_id' => 'nullable|integer|exists:schools,id',
            'per_page' => 'nullable|integer|min:1|max:100',
            'search' => 'nullable|string|max:255',
        ]);

        $degreeIds = Degree::whereHas('programs', function ($q) use ($slug) {
            $q->where('slug', $slug);
        })->pluck('id')->toArray();

        $courses = Course::with([
            'degree:id,short_name',
            'department:id,name',
            'department.school:id,name'
        ])
        ->select('id', 'name', 'banner', 'slug', 'degree_id', 'department_id')
        ->whereIn('degree_id', $degreeIds)
        ->filter(['search' => $validated['search'] ?? null])
        ->when($validated['department_id'] ?? null, function ($query) use ($validated) {
            $query->where('department_id', $validated['department_id']);
        })
        ->when($validated['school_id'] ?? null, function ($query) use ($validated) {
            $query->whereHas('department', function ($q) use ($validated) {
                $q->where('school_id', $validated['school_id']);
            });
        })
        ->orderBy('id', 'desc')
        ->paginate($validated['per_page'] ?? 9)
        ->withQueryString();

        $transformedCourses = $courses->through(function ($course) {
            return [
                'name' => $course->name,
                'banner' => $course->banner ? url($course->banner) : null,
                'slug' => $course->slug,
                'degree_name' => $course->degree->short_name ?? '',
                'department_name' => $course->department->name ?? '',
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $transformedCourses,
            'message' => 'Courses retrieved successfully'
        ]);
    }

    public function detail($slug): JsonResponse
    {
        $course = Course::where('slug', $slug)->first();
        
        if (!$course) {
            return response()->json([
                'success' => false,
                'message' => 'Course not found',
                'data' => null
            ], 404);
        }

        $courseData = [
            'id' => $course->id,
            'name' => $course->name,
            'slug' => $course->slug,
            'banner' => [
                'name' => $course->name,
                'image' => $course->banner ? asset($course->banner) : null,
            ],
            'admissionSection' => [
                'academic_year' => $course->academic_year,
                'course_duration' => $course->course_duration,
                'annual_fees' => $course->annual_fees,
                'program_structure' => $course->program_structure ? asset($course->program_structure) : null,
                'scholarship' => $course->scholarship ? asset($course->scholarship) : null,
                'apply_now_link' => $course->apply_now_link,
                'eligibility_marks' => $course->eligibility_marks,
                'eligibility_desc' => $course->eligibility_desc,
            ],
            'overview' => [
                'overview_title' => $course->overview_title,
                'overview_desc' => $course->overview_desc,
                'overview_image' => $course->overview_image ? asset($course->overview_image) : null,
                'apply_now_link' => $course->apply_now_link,
            ],
            'eligibility' => [
                'eligibility_criteria' => $course->eligibility_criteria,
                'eligibility_criteria_desc' => $course->eligibility_criteria_desc,
                'eligibility_criteria_notices' => $course->eligibility_criteria_notices,
            ],
            'peos' => $course->peos,
            'pos' => $course->pos,
            'pso' => $course->pso,
            'apply_now_link' => $course->apply_now_link,
            'curriculum' => [
                'curriculum_title' => $course->curriculum_title,
                'curriculum_desc' => $course->curriculum_desc,
                'curriculum_image' => $course->curriculum_image ? asset($course->curriculum_image) : null,
                'curriculum_pdf' => $course->curriculum_pdf ? asset($course->curriculum_pdf) : null,
            ],
            'fee_structure' => [
                'fee_structure_title' => $course->fee_structure_title,
                'fee_structure_short_description' => $course->fee_structure_short_description,
                'course_total_fees' => $course->course_total_fees,
                'fee_structure_pdf' => $course->fee_structure_pdf ? asset($course->fee_structure_pdf) : null,
                'fee_structure_image' => $course->fee_structure_image ? asset($course->fee_structure_image) : null,
                'apply_now_link' => $course->apply_now_link,
                'academic_year' => $course->academic_year,
            ],
            'testimonials' => $course->testimonials->where('status', true)->where('type','placement')->sortBy('display_order')->values()->take(15)->map(fn($item) => [
                'id' => $item->id,
                'title' => $item->title,
                'name' => $item->name,
                'course' => $item->course,
                'batch' => $item->batch,
                'designation' => $item->designation,
                'company' => $item->company,
                'slug' => $item->slug,
                'alt_text' => $item->alt_text,
                'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                'video_url' => $item->video_url,
                'short_description' => $item->short_description,
                'apply_now_link' => $course->apply_now_link,
            ]),
            'career_opportunities' => [
                'career_title' => $course->career_title,
                'career_subtitle' => $course->career_subtitle,
                'career_desc' => $course->career_desc,
                'career_image' => $course->career_image ? asset($course->career_image) : null,
                'useful_links' => $course->useful_links,
            ],
        ];

        return response()->json([
            'success' => true,
            'message' => 'Course retrieved successfully',
            'data' => $courseData
        ]);
    }
    
    public function programList()
    {
        $programs = Program::select('id','name','slug','image')->get()
            ->map(function ($program) {
                $program->image = $program->image 
                    ? asset($program->image)
                    : asset('assets/img/placeholder/banner-placeholder.png');

                return $program;
            });

        return response()->json([
            'status' => true,
            'data' => $programs,
        ]);
    }

    public function schoolDeparmentList()
    {
        $schoolDepartment = School::select('id', 'name','slug')
            ->with(['departments' => function($query) {
                $query->select('id', 'name', 'school_id','slug');
            }])
            ->get();

        return response()->json([
            'status' => true,
            'data' => $schoolDepartment,
        ]);
    }

    public function searchCourse()
    {
        $validated = request()->validate([
            'search' => 'nullable|string|max:255',
        ]);

        $courses = Course::select('id', 'name')
        ->filter(['search' => $validated['search'] ?? null])
        ->orderBy('id', 'desc')
        ->get();

        return response()->json([
            'success' => true,
            'data' => $courses,
            'message' => 'Courses retrieved successfully'
        ]);
    }
}
