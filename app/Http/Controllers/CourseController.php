<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Course;
use App\Models\Program;
use App\Models\Department;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $departments = Department::select('id','name')->get();
        $programs = Program::select('id','name')->get();

        $courses = Course::filter(['search' => $search])->orderBy('display_order', 'asc')->paginate(10)->withQueryString()->through(function ($course) {
            return [
                'id' => $course->id,
                'department_id' => $course->department_id,
                'program_id' => $course->program_id,
                'department_name' => $course->department ?  $course->department->name : null,
                'program_name' => $course->program ?  $course->program->name : null,
                'name' => $course->name,
                'menu_name' => $course->menu_name,
                'name_short' => $course->name_short,
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::select('id','name')->get();
        $programs = Program::select('id','name')->get();

        return Inertia::render('Courses/Create',[
            'programs' => $programs,
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'program_id' => 'required|exists:programs,id',
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
        ]);

        $data = $request->all();

        // Generate slug if empty
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
            $count = Course::where('slug', 'LIKE', "{$data['slug']}%")->count();
            if ($count > 0) {
                $data['slug'] .= '-' . ($count + 1);
            }
        }

        Course::create($data);

        return redirect()->route('course.index')->with('success', 'Course created successfully!');
    }


    /**
     * Display the specified resource.
     */
    public function show(Course $course)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        $departments = Department::select('id','name')->get();
        $programs = Program::select('id','name')->get();

        return Inertia::render('Courses/Edit',[
            'departments' => $departments,
            'programs' => $programs,
            'course' => $course,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'program_id' => 'required|exists:programs,id',
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
        ]);

        $data = $request->all();

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
            $count = Course::where('slug', 'LIKE', "{$data['slug']}%")
                        ->where('id', '!=', $course->id)
                        ->count();
            if ($count > 0) {
                $data['slug'] .= '-' . ($count + 1);
            }
        }

        $course->update($data);

        return redirect()->route('course.index')->with('success', 'Course updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $fileFields = [
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
            'career_opportunities' => 'nullable|array',
            'career_opportunities.*' => 'nullable|string|max:255',
        ];

        if ($request->hasFile('curriculum_image')) {
            $rules['curriculum_image'] = 'image|mimes:jpg,jpeg,png,webp|max:2000';
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
