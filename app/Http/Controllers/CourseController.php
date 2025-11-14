<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Course;
use App\Models\Degree;
use App\Models\Program;
use App\Models\Department;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $departments = Department::select('id','name')->get();
        $programs = Program::select('id','name')->get();

        $courses = Course::filter(['search' => $search])->orderBy('display_order', 'asc')->paginate(10)->withQueryString()->through(function ($course) {
            return [
                'id' => $course->id,
                'department_id' => $course->department_id,
                'degree_id' => $course->degree_id,
                'banner' => asset($course->banner),
                'program_structure' => asset($course->program_structure),
                'scholarship' => asset($course->scholarship),
                'eligibility_marks' => $course->eligibility_marks,
                'eligibility_desc' => $course->eligibility_desc,
                'department_name' => $course->department ?  $course->department->name : null,
                'degree_name' => $course->degree ?  $course->degree->name : null,
                'name' => $course->name,
                'menu_name' => $course->menu_name,
                'name_short' => $course->name_short,
                'useful_links' => json_decode($course->useful_links, true) ?? [],
                'slug' => $course->slug,
                'course_duration' => $course->course_duration,
                'annual_fees' => $course->annual_fees,
                'academic_year' => $course->academic_year,
                'apply_now_link' => $course->apply_now_link,
                'status' => $course->status,
                'display_order' => $course->display_order,
            ];
        });


        return Inertia::render('Courses/Index', [
            'courses' => $courses,
            'departments' => $departments,
            'searchTerm' => $search ?? '',
        ]);
    }

    public function create()
    {
        $departments = Department::select('id','name')->get();
        $degree = Degree::select('id','name')->get();

        return Inertia::render('Courses/Create',[
            'degree' => $degree,
            'departments' => $departments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'degree_id' => 'required|exists:degrees,id',
            'name' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:courses,slug',
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'menu_name' => 'nullable|string|max:255',
            'name_short' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer',
            'status' => 'nullable|boolean',
            'course_duration' => 'nullable|string|max:255',
            'annual_fees' => 'nullable|string|max:255',
            'academic_year' => 'nullable|string|max:255',
            'apply_now_link' => 'nullable|url|max:255',
            'useful_links' => 'nullable|array',
            'useful_links.*.text' => 'nullable|string|max:255',
            'useful_links.*.url' => 'nullable|url|max:500',
            // New file validation rules
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'eligibility_marks' => 'nullable|string|max:255',
            'eligibility_desc' => 'nullable|string',
            'program_structure' => 'nullable|file|mimes:pdf|max:10240',
            'scholarship' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        $data = $request->all();

        // Handle banner image upload
        if ($request->hasFile('banner')) {
            $banner = $request->file('banner');
            $bannerName = time() . '_' . uniqid() . '.' . $banner->getClientOriginalExtension();
            $banner->move(public_path('assets/img/courses/banners/'), $bannerName);
            $data['banner'] = 'assets/img/courses/banners/' . $bannerName;
        }

        // Handle program structure PDF upload
        if ($request->hasFile('program_structure')) {
            $programStructure = $request->file('program_structure');
            $programStructureName = time() . '_' . uniqid() . '_program.' . $programStructure->getClientOriginalExtension();
            $programStructure->move(public_path('assets/files/courses/program-structure/'), $programStructureName);
            $data['program_structure'] = 'assets/files/courses/program-structure/' . $programStructureName;
        }

        // Handle scholarship PDF upload
        if ($request->hasFile('scholarship')) {
            $scholarship = $request->file('scholarship');
            $scholarshipName = time() . '_' . uniqid() . '_scholarship.' . $scholarship->getClientOriginalExtension();
            $scholarship->move(public_path('assets/files/courses/scholarship/'), $scholarshipName);
            $data['scholarship'] = 'assets/files/courses/scholarship/' . $scholarshipName;
        }

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
            
            if (Course::where('slug', $data['slug'])->exists()) {
                return back()
                    ->withErrors(['slug' => 'The generated slug already exists. Please enter a unique slug.'])
                    ->withInput();
            }
        }

        if (isset($data['useful_links']) && is_array($data['useful_links'])) {
            $filteredLinks = array_filter($data['useful_links'], function($link) {
                return !empty(trim($link['text'] ?? '')) || !empty(trim($link['url'] ?? ''));
            });
            $data['useful_links'] = !empty($filteredLinks) ? json_encode(array_values($filteredLinks)) : null;
        } else {
            $data['useful_links'] = null;
        }

        $data = array_map(function($value) {
            return $value === '' ? null : $value;
        }, $data);

        Course::create($data);

        return redirect()->route('course.index')->with('success', 'Course created successfully!');
    }

    public function edit(Course $course)
    {
        $departments = Department::select('id','name')->get();
        $degree = Degree::select('id','name')->get();

        $data = $course->only([
            'id',
            'department_id',
            'degree_id',
            'name',
            'menu_name',
            'name_short',
            'slug',
            'display_order',
            'status',
            'course_duration',
            'annual_fees',
            'academic_year',
            'useful_links',
            'apply_now_link',
            // New fields
            'banner',
            'eligibility_marks',
            'eligibility_desc',
            'program_structure',
            'scholarship',
        ]);

        if (isset($data['useful_links']) && is_string($data['useful_links'])) {
            $data['useful_links'] = json_decode($data['useful_links'], true) ?? [];
        } else {
            $data['useful_links'] = [];
        }

        return Inertia::render('Courses/Edit',[
            'departments' => $departments,
            'degree' => $degree,
            'course' => $data,
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'degree_id' => 'required|exists:degrees,id',
            'name' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:courses,slug,' . $course->id,
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'menu_name' => 'nullable|string|max:255',
            'name_short' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer',
            'status' => 'nullable|boolean',
            'course_duration' => 'nullable|string|max:255',
            'annual_fees' => 'nullable|string|max:255',
            'academic_year' => 'nullable|string|max:255',
            'apply_now_link' => 'nullable|url|max:255',
            'useful_links' => 'nullable|array',
            'useful_links.*.text' => 'nullable|string|max:255',
            'useful_links.*.url' => 'nullable|url|max:500',
            // New file validation rules
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'eligibility_marks' => 'nullable|string|max:255',
            'eligibility_desc' => 'nullable|string',
            'program_structure' => 'nullable|file|mimes:pdf|max:10240',
            'scholarship' => 'nullable|file|mimes:pdf|max:10240',
            'remove_banner' => 'nullable|boolean',
            'remove_program_structure' => 'nullable|boolean',
            'remove_scholarship' => 'nullable|boolean',
        ]);

        $data = $request->all();

        // Handle banner image upload/removal
        if ($request->has('remove_banner') && $request->remove_banner) {
            // Remove existing banner
            if ($course->banner && file_exists(public_path($course->banner))) {
                unlink(public_path($course->banner));
            }
            $data['banner'] = null;
        } elseif ($request->hasFile('banner')) {
            // Remove existing banner if new one is uploaded
            if ($course->banner && file_exists(public_path($course->banner))) {
                unlink(public_path($course->banner));
            }
            
            $banner = $request->file('banner');
            $bannerName = time() . '_' . uniqid() . '.' . $banner->getClientOriginalExtension();
            $banner->move(public_path('assets/img/courses/banners/'), $bannerName);
            $data['banner'] = 'assets/img/courses/banners/' . $bannerName;
        }

        // Handle program structure PDF upload/removal
        if ($request->has('remove_program_structure') && $request->remove_program_structure) {
            // Remove existing program structure
            if ($course->program_structure && file_exists(public_path($course->program_structure))) {
                unlink(public_path($course->program_structure));
            }
            $data['program_structure'] = null;
        } elseif ($request->hasFile('program_structure')) {
            // Remove existing program structure if new one is uploaded
            if ($course->program_structure && file_exists(public_path($course->program_structure))) {
                unlink(public_path($course->program_structure));
            }
            
            $programStructure = $request->file('program_structure');
            $programStructureName = time() . '_' . uniqid() . '_program.' . $programStructure->getClientOriginalExtension();
            $programStructure->move(public_path('assets/files/courses/program-structure/'), $programStructureName);
            $data['program_structure'] = 'assets/files/courses/program-structure/' . $programStructureName;
        }

        // Handle scholarship PDF upload/removal
        if ($request->has('remove_scholarship') && $request->remove_scholarship) {
            // Remove existing scholarship
            if ($course->scholarship && file_exists(public_path($course->scholarship))) {
                unlink(public_path($course->scholarship));
            }
            $data['scholarship'] = null;
        } elseif ($request->hasFile('scholarship')) {
            // Remove existing scholarship if new one is uploaded
            if ($course->scholarship && file_exists(public_path($course->scholarship))) {
                unlink(public_path($course->scholarship));
            }
            
            $scholarship = $request->file('scholarship');
            $scholarshipName = time() . '_' . uniqid() . '_scholarship.' . $scholarship->getClientOriginalExtension();
            $scholarship->move(public_path('assets/files/courses/scholarship/'), $scholarshipName);
            $data['scholarship'] = 'assets/files/courses/scholarship/' . $scholarshipName;
        }

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
            $exists = Course::where('slug', $data['slug'])->where('id', '!=', $course->id)->exists();

            if ($exists) {
                return back()->withErrors(['slug' => 'The generated slug already exists. Please enter a unique slug.'])->withInput();
            }
        }

        if (isset($data['useful_links']) && is_array($data['useful_links'])) {
            $filteredLinks = array_filter($data['useful_links'], function($link) {
                return !empty(trim($link['text'] ?? '')) || !empty(trim($link['url'] ?? ''));
            });
            $data['useful_links'] = !empty($filteredLinks) ? json_encode(array_values($filteredLinks)) : null;
        } else {
            $data['useful_links'] = null;
        }

        $data = array_map(function($value) {
            return $value === '' ? null : $value;
        }, $data);

        $course->update($data);

        return redirect()->route('course.index')->with('success', 'Course updated successfully!');
    }

    public function destroy(Course $course)
    {
        $fileFields = [
            'banner',
            'program_structure',
            'scholarship',
            // Keep existing fields
            'curriculum_image',
            'curriculum_pdf',
            'fee_structure_image',
            'fee_structure_pdf',
        ];

        foreach ($fileFields as $field) {
            if (!empty($course->$field) && file_exists(public_path($course->$field))) {
                unlink(public_path($course->$field));
            }
        }

        $course->delete();

        return redirect()->route('course.index')->with('success', 'Course deleted successfully along with all files.');
    }

    public function toggleStatus($id)
    {
        $course = Course::findOrFail($id);
        $course->status = !$course->status;
        $course->save();

        return redirect()->route('course.index')->with('success', 'Course Status Updated!');
    }

    public function createSections(Request $request, $id)
    {
        return Inertia::render('Courses/CreateOrUpdateSections', [
            'course' => Course::find($id),
        ]);
    }

    public function storeOrUpdate(Request $request, $id = null)
    {
        $course = Course::findOrFail($id);

        $rules = [
            // Eligibility
            'eligibility_criteria' => 'nullable|string|max:255',
            'eligibility_criteria_desc' => 'nullable|string|max:255',
            'eligibility_criteria_notices' => 'nullable|array',
            'eligibility_criteria_notices.*' => 'nullable|string|max:255',

            // Program Info
            'program_structure' => 'nullable|string|max:255',
            'scholarship' => 'nullable|string|max:255',

            // Program Outcomes
            'peos' => 'nullable|array',
            'peos.*' => 'nullable|string|max:255',
            'pos' => 'nullable|array',
            'pos.*' => 'nullable|string|max:255',
            'pso' => 'nullable|array',
            'pso.*' => 'nullable|string|max:255',

            // Curriculum
            'curriculum_title' => 'nullable|string|max:255',
            'curriculum_desc' => 'nullable|array',
            'curriculum_desc.*' => 'nullable|string',

            // Fee Structure
            'fee_structure_title' => 'nullable|string|max:255',
            'fee_structure_short_description' => 'nullable|string|max:255',
            'course_total_fees' => 'nullable|string|max:255',
            
            // Career Opportunities
            'career_title' => 'nullable|string|max:255',
            'career_subtitle' => 'nullable|string|max:255',
            'career_desc' => 'nullable|string|max:255',

            // Overview
            'overview_title' => 'nullable|string|max:255',
            'overview_desc' => 'nullable|string|max:255',
        ];

        if ($request->hasFile('curriculum_image')) {
            $rules['curriculum_image'] = 'image|mimes:jpg,jpeg,png,webp|max:2000';
        }

        if ($request->hasFile('overview_image')) {
            $rules['overview_image'] = 'image|mimes:jpg,jpeg,png,webp|max:2000';
        }

        if ($request->hasFile('career_image')) {
            $rules['career_image'] = 'image|mimes:jpg,jpeg,png,webp|max:2000';
        }

        if ($request->hasFile('curriculum_pdf')) {
            $rules['curriculum_pdf'] = 'mimes:pdf|max:5000';
        }

        if ($request->hasFile('fee_structure_image')) {
            $rules['fee_structure_image'] = 'image|mimes:jpg,jpeg,png,webp|max:2000';
        }

        if ($request->hasFile('fee_structure_pdf')) {
            $rules['fee_structure_pdf'] = 'mimes:pdf|max:5000';
        }

        $validated = $request->validate($rules);

        $fileFields = [
            'curriculum_image' => 'courses/curriculum/',
            'overview_image' => 'courses/overview/',
            'career_image' => 'courses/career/',
            'curriculum_pdf' => 'courses/curriculum/',
            'fee_structure_image' => 'courses/fee_structure/',
            'fee_structure_pdf' => 'courses/fee_structure/',
        ];

        foreach ($fileFields as $field => $folder) {
            if ($request->hasFile($field)) {
                if ($course->$field && file_exists(public_path($course->$field))) {
                    unlink(public_path($course->$field));
                }

                $file = $request->file($field);
                $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('assets/img/' . $folder), $fileName);
                $validated[$field] = 'assets/img/' . $folder . $fileName;
            }
        }

        $jsonFields = [
            'eligibility_criteria_notices',
            'peos',
            'pos',
            'pso',
            'curriculum_desc',
            'career_opportunities',
        ];

        foreach ($jsonFields as $field) {
            if (!empty($validated[$field])) {
                $validated[$field] = array_values($validated[$field]);
            }
        }

        $course->update($validated);

        return redirect()->back()->with('success', 'Course section updated successfully.');
    }
}
