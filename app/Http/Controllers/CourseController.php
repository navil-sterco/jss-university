<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Degree;
use App\Models\Department;
use App\Models\Pages;
use App\Models\Program;
use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CourseController extends Controller
{
    /**
     * Multipart/form-data may send useful_links as a JSON string; normalize before validation.
     */
    protected function normalizeUsefulLinksFromRequest(Request $request): void
    {
        if (! $request->has('useful_links')) {
            return;
        }

        $links = $request->input('useful_links');
        if (is_array($links)) {
            return;
        }
        if (is_string($links)) {
            if ($links === '') {
                $request->merge(['useful_links' => []]);

                return;
            }
            $decoded = json_decode($links, true);
            $request->merge(['useful_links' => is_array($decoded) ? $decoded : []]);
        }
    }

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
                'image' => asset($course->image),
                'program_structure' => asset($course->program_structure),
                'scholarship' => $course->scholarship,
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
        $this->normalizeUsefulLinksFromRequest($request);

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
            'apply_now_link' => 'nullable|max:255',
            'useful_links' => 'nullable|array',
            'useful_links.*.text' => 'nullable|string|max:255',
            'useful_links.*.url' => 'nullable|string|max:500',
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'school_listing_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'eligibility_marks' => 'nullable|string|max:255',
            'fee_structure_pdf' => 'nullable|string|max:255',
            'eligibility_desc' => 'nullable|string',
            'program_structure' => 'nullable|file|mimes:pdf|max:10240',
            'brouchure' => 'nullable|file|mimes:pdf|max:10240',
            'scholarship' => 'nullable|string|max:255',
        ]);

        $data = $request->all();

        // Handle banner image upload
        if ($request->hasFile('banner')) {
            $banner = $request->file('banner');
            $bannerName = time() . '_' . uniqid() . '.' . $banner->getClientOriginalExtension();
            $banner->move(public_path('assets/img/courses/banners/'), $bannerName);
            $data['banner'] = 'assets/img/courses/banners/' . $bannerName;
        }

        // Handle main/featured image upload (for course listing)
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/courses/main/'), $imageName);
            $data['image'] = 'assets/img/courses/main/' . $imageName;
        }
        if ($request->hasFile('school_listing_image')) {
            $image = $request->file('school_listing_image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/courses/school-listing/'), $imageName);
            $data['school_listing_image'] = 'assets/img/courses/school-listing/' . $imageName;
        }

        // Handle program structure PDF upload
        if ($request->hasFile('program_structure')) {
            $programStructure = $request->file('program_structure');
            $programStructureName = time() . '_' . uniqid() . '_program.' . $programStructure->getClientOriginalExtension();
            $programStructure->move(public_path('assets/files/courses/program-structure/'), $programStructureName);
            $data['program_structure'] = 'assets/files/courses/program-structure/' . $programStructureName;
        }
        if ($request->hasFile('brouchure')) {
            $brouchure = $request->file('brouchure');
            $brouchureName = time() . '_' . uniqid() . '_program.' . $brouchure->getClientOriginalExtension();
            $brouchure->move(public_path('assets/files/courses/brouchure/'), $brouchureName);
            $data['brouchure'] = 'assets/files/courses/brouchure/' . $brouchureName;
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
            'banner',
            'image',
            'school_listing_image',
            'eligibility_marks',
            'fee_structure_pdf',
            'eligibility_desc',
            'program_structure',
            'brouchure',
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
        $this->normalizeUsefulLinksFromRequest($request);

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
            'apply_now_link' => 'nullable|max:255',
            'useful_links' => 'nullable|array',
            'useful_links.*.text' => 'nullable|string|max:255',
            'useful_links.*.url' => 'nullable|string|max:500',
            'eligibility_marks' => 'nullable|string|max:255',
            'fee_structure_pdf' => 'nullable|string|max:255',
            'eligibility_desc' => 'nullable|string',
            'remove_banner' => 'nullable|boolean',
            'remove_image' => 'nullable|boolean',
            'remove_program_structure' => 'nullable|boolean',
            'remove_brouchure' => 'nullable|boolean',
            'scholarship' => 'nullable|string|max:255',
        ]);

        $data = $request->all();

        if ($request->has('remove_banner') && $request->remove_banner) {
            if ($course->banner && file_exists(public_path($course->banner))) {
                unlink(public_path($course->banner));
            }
            $data['banner'] = null;
        } elseif ($request->hasFile('banner')) {
            $request->validate([
                'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);
            if ($course->banner && file_exists(public_path($course->banner))) {
                unlink(public_path($course->banner));
            }
            
            $banner = $request->file('banner');
            $bannerName = time() . '_' . uniqid() . '.' . $banner->getClientOriginalExtension();
            $banner->move(public_path('assets/img/courses/banners/'), $bannerName);
            $data['banner'] = 'assets/img/courses/banners/' . $bannerName;
        } else {
            $data['banner'] = $course->banner;
        }

        if ($request->has('remove_image') && $request->remove_image) {
            if ($course->image && file_exists(public_path($course->image))) {
                unlink(public_path($course->image));
            }
            $data['image'] = null;
        } elseif ($request->hasFile('image')) {
            $request->validate([
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);
            if ($course->image && file_exists(public_path($course->image))) {
                unlink(public_path($course->image));
            }
            
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/courses/main/'), $imageName);
            $data['image'] = 'assets/img/courses/main/' . $imageName;
        } else {
            $data['image'] = $course->image;
        }

        if ($request->has('remove_program_structure') && $request->remove_program_structure) {
            if ($course->program_structure && file_exists(public_path($course->program_structure))) {
                unlink(public_path($course->program_structure));
            }
            $data['program_structure'] = null;
        } elseif ($request->hasFile('program_structure')) {
            $request->validate([
                'program_structure' => 'nullable|file|mimes:pdf|max:10240',
            ]);
            if ($course->program_structure && file_exists(public_path($course->program_structure))) {
                unlink(public_path($course->program_structure));
            }
            
            $programStructure = $request->file('program_structure');
            $programStructureName = time() . '_' . uniqid() . '_program.' . $programStructure->getClientOriginalExtension();
            $programStructure->move(public_path('assets/files/courses/program-structure/'), $programStructureName);
            $data['program_structure'] = 'assets/files/courses/program-structure/' . $programStructureName;
        } else {
            $data['program_structure'] = $course->program_structure;
        }

        if ($request->has('remove_brouchure') && $request->remove_brouchure) {
            if ($course->brouchure && file_exists(public_path($course->brouchure))) {
                unlink(public_path($course->brouchure));
            }
            $data['brouchure'] = null;
        } elseif ($request->hasFile('brouchure')) {
            $request->validate([
                'brouchure' => 'nullable|file|mimes:pdf|max:10240',
            ]);
            if ($course->brouchure && file_exists(public_path($course->brouchure))) {
                unlink(public_path($course->brouchure));
            }
            
            $brouchure = $request->file('brouchure');
            $brouchureName = time() . '_' . uniqid() . '_program.' . $brouchure->getClientOriginalExtension();
            $brouchure->move(public_path('assets/files/courses/brouchure/'), $brouchureName);
            $data['brouchure'] = 'assets/files/courses/brouchure/' . $brouchureName;
        } else {
            $data['brouchure'] = $course->brouchure;
        }

        if ($request->has('remove_school_listing_image') && $request->remove_school_listing_image) {
            if ($course->school_listing_image && file_exists(public_path($course->school_listing_image))) {
                unlink(public_path($course->school_listing_image));
            }
            $data['school_listing_image'] = null;
        } elseif ($request->hasFile('school_listing_image')) {
            $request->validate([
                'school_listing_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);
            if ($course->school_listing_image && file_exists(public_path($course->school_listing_image))) {
                unlink(public_path($course->school_listing_image));
            }
            
            $schoolListingImage = $request->file('school_listing_image');
            $schoolListingImageName = time() . '_' . uniqid() . '.' . $schoolListingImage->getClientOriginalExtension();
            $schoolListingImage->move(public_path('assets/img/courses/school-listing/'), $schoolListingImageName);
            $data['school_listing_image'] = 'assets/img/courses/school-listing/' . $schoolListingImageName;
        } else {
            $data['school_listing_image'] = $course->school_listing_image;
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
            $data['useful_links'] = $course->useful_links;
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
            'image',
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

        // FormData may send these as JSON strings (see CreateOrUpdateSections.jsx)
        foreach (['peos', 'pos', 'pso', 'eligibility_criteria_notices', 'curriculum_desc', 'tab_section_info', 'tab_section_tabs'] as $key) {
            $val = $request->input($key);
            if (is_string($val) && $val !== '') {
                $decoded = json_decode($val, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $request->merge([$key => $decoded]);
                }
            }
        }

        $rules = [
            // Eligibility
            'eligibility_criteria' => 'nullable|string|max:255',
            'eligibility_criteria_desc' => 'nullable|string|max:255',
            'eligibility_criteria_notices' => 'nullable|array',
            'eligibility_criteria_notices.*' => 'nullable|string|max:255',

            // Program Info
            'program_structure' => 'nullable|string|max:255',
            'scholarship' => 'nullable|string|max:255',

            // Program Outcomes - Now arrays of objects with title and description
            'peos' => 'nullable|array',
            'peos.*.title' => 'nullable|string|max:255',
            'peos.*.description' => 'nullable|string',
            'pos' => 'nullable|array',
            'pos.*.title' => 'nullable|string|max:255',
            'pos.*.description' => 'nullable|string',
            'pso' => 'nullable|array',
            'pso.*.title' => 'nullable|string|max:255',
            'pso.*.description' => 'nullable|string',

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
            'career_desc' => 'nullable|string',

            // Overview
            'overview_title' => 'nullable|string',
            'overview_desc' => 'nullable|string',

            // description (stored into pages)
            'description_title' => 'nullable|string|max:255',
            'description_content' => 'nullable|string',

            // Tab Section
            'tab_section_info' => 'nullable|array',
            'tab_section_info.*.title' => 'nullable|string|max:255',
            'tab_section_info.*.subtitle' => 'nullable|string|max:255',
            'tab_section_info.*.image' => 'nullable',
            'tab_section_tabs' => 'nullable|array',
            'tab_section_tabs.*.name' => 'nullable|string|max:255',
            'tab_section_tabs.*.data' => 'nullable|string',
        ];

        // File validation rules
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

        $rules = array_merge($rules, [
            'remove_overview_image' => 'nullable|boolean',
            'remove_curriculum_image' => 'nullable|boolean',
            'remove_curriculum_pdf' => 'nullable|boolean',
            'remove_fee_structure_image' => 'nullable|boolean',
            'remove_fee_structure_pdf' => 'nullable|boolean',
            'remove_career_image' => 'nullable|boolean',
        ]);

        $validated = $request->validate($rules);

        $removableFileFields = [
            'overview_image' => 'remove_overview_image',
            'curriculum_image' => 'remove_curriculum_image',
            'curriculum_pdf' => 'remove_curriculum_pdf',
            'fee_structure_image' => 'remove_fee_structure_image',
            'fee_structure_pdf' => 'remove_fee_structure_pdf',
            'career_image' => 'remove_career_image',
        ];

        foreach ($removableFileFields as $field => $removeFlag) {
            if ($request->boolean($removeFlag)) {
                if (! empty($course->$field) && file_exists(public_path($course->$field))) {
                    unlink(public_path($course->$field));
                }
                $validated[$field] = null;
            }
        }

        // Handle file uploads
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
                // Delete old file if exists
                if ($course->$field && file_exists(public_path($course->$field))) {
                    unlink(public_path($course->$field));
                }

                $file = $request->file($field);
                $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('assets/img/' . $folder), $fileName);
                $validated[$field] = 'assets/img/' . $folder . $fileName;
            }
        }

        // Handle JSON fields
        $jsonFields = [
            'eligibility_criteria_notices',
            'curriculum_desc',
            'career_opportunities',
        ];

        foreach ($jsonFields as $field) {
            if (!empty($validated[$field])) {
                $validated[$field] = json_encode(array_values($validated[$field]));
            }
        }

        // Handle PEOS, POS, PSO - arrays of objects
        $objectArrayFields = ['peos', 'pos', 'pso', 'tab_section_info', 'tab_section_tabs'];
        
        foreach ($objectArrayFields as $field) {
            if (isset($validated[$field])) {
                // Filter out empty objects (where both title and description are empty)
                $filteredItems = array_filter($validated[$field], function ($item) use ($field) {
                    if ($field === "tab_section_info") {
                        return !empty($item['title']) || !empty($item['subtitle']) || !empty($item['image']);
                    }
                    if ($field === "tab_section_tabs") {
                        return !empty($item['name']) || !empty($item['data']);
                    }
                    return !empty($item['title']) || !empty($item['description']);
                });

                // Re-index array
                $filteredItems = array_values($filteredItems);

                // Handle files for tab_section_info
                if ($field === "tab_section_info") {
                    $oldInfo = json_decode($course->tab_section_info, true) ?? [];
                    foreach ($filteredItems as $index => &$item) {
                        $fileKey = "tab_section_info_{$index}_image";
                        
                        // Handle replacement or removal
                        if ($request->hasFile($fileKey)) {
                            // Delete old image if it exists in the corresponding position of old data
                            // Note: This isn't perfect if items are reordered, but it's better than nothing.
                            // In a more robust system, we'd use UUIDs or track file deletions explicitly.
                            if (isset($oldInfo[$index]['image']) && !empty($oldInfo[$index]['image'])) {
                                if (file_exists(public_path($oldInfo[$index]['image']))) {
                                    unlink(public_path($oldInfo[$index]['image']));
                                }
                            }

                            $file = $request->file($fileKey);
                            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                            $folderPath = public_path('assets/img/courses/tabs/');
                            if (!file_exists($folderPath)) {
                                mkdir($folderPath, 0755, true);
                            }
                            $file->move($folderPath, $fileName);
                            $item['image'] = 'assets/img/courses/tabs/' . $fileName;
                        } elseif (isset($item['image']) && $item['image'] === null) {
                            // Image was explicitly removed in frontend
                            if (isset($oldInfo[$index]['image']) && !empty($oldInfo[$index]['image'])) {
                                if (file_exists(public_path($oldInfo[$index]['image']))) {
                                    unlink(public_path($oldInfo[$index]['image']));
                                }
                            }
                        }
                    }
                }

                if (count($filteredItems) > 0) {
                    $validated[$field] = json_encode($filteredItems);
                } else {
                    $validated[$field] = null;
                }
            }
        }

        // If fields are not present in request but existed before, set them to null
        $fieldsToCheck = array_merge($objectArrayFields, $jsonFields);
        foreach ($fieldsToCheck as $field) {
            if (!isset($validated[$field]) && $course->$field) {
                $validated[$field] = null;
            }
        }

        $course->update($validated);

        return redirect()->back()->with('success', 'Course section updated successfully.');
    }

    public function mapping($id)
    {
        $courses = Course::with(['schools:id,name', 'pages:id,title', 'departments:id,name'])->findOrFail($id);
        $schools = School::select('id', 'name')->get();
        $pages = Pages::select('id', 'title')->get();
        $departments = Department::with('school:id,name')->get()->map(function ($department) {
            return [
                'id' => $department->id,
                'name' => $department->name,
                'school' => $department->school ? $department->school->name : null,
            ];
        });

        return Inertia::render('Courses/Mapping', [
            'courses' => $courses,
            'schools' => $schools,
            'pages' => $pages,
            'departments' => $departments,
        ]);
    }

    public function attachMapping(Request $request, $id)
    {
        $courses = Course::findOrFail($id);

        $validated = $request->validate([
            'school_ids' => 'nullable|array',
            'school_ids.*' => 'exists:schools,id',
            'page_ids' => 'nullable|array',
            'page_ids.*' => 'exists:pages,id',
            'department_ids' => 'nullable|array',
            'department_ids.*' => 'exists:departments,id',
        ]);

        $courses->schools()->sync($validated['school_ids'] ?? []);
        $courses->pages()->sync($validated['page_ids'] ?? []);
        $courses->departments()->sync($validated['department_ids'] ?? []);

        return redirect()->route('course.index', $courses->id)->with('success', 'Courses mapped successfully!');
    }
    
    public function duplicate($id)
    {
        $course = Course::with(['schools','pages','departments'])->findOrFail($id);

        DB::beginTransaction();
        try {
            $new = $course->replicate();
            $new->name = 'Copy of ' . $course->name;

            // generate unique slug
            $baseSlug = Str::slug($new->name);
            $slug = $baseSlug;
            $i = 1;
            while (Course::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-copy' . $i++;
            }
            $new->slug = $slug;

            // preserve file paths (do not copy actual files)
            $new->banner = $course->banner;
            $new->image = $course->image;
            $new->program_structure = $course->program_structure;
            $new->scholarship = $course->scholarship;

            $new->save();

            // duplicate relationships
            $new->schools()->sync($course->schools->pluck('id')->toArray());
            $new->pages()->sync($course->pages->pluck('id')->toArray());
            $new->departments()->sync($course->departments->pluck('id')->toArray());

            DB::commit();

            return redirect()->route('course.index')->with('success', 'Course duplicated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to duplicate course: ' . $e->getMessage());
        }
    }
}
