<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\School;
use App\Models\Department;
use App\Models\Pages;
use App\Models\PageSection;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $schools = School::select('id', 'name')->get();
        $departments = Department::filter(['search' => $search])->orderBy('display_order', 'asc')->paginate(10)->withQueryString()->through(function ($department) {
            return [
                'id' => $department->id,
                'name' => $department->name,
                'school' => $department->school->name,
                'slug' => $department->slug,
                'menu_name' => $department->menu_name,
                'academic_year' => $department->academic_year,
                'apply_now_link' => $department->apply_now_link,
                'brochure' => $department->brochure,
                'useful_links' => json_decode($department->useful_links, true) ?? [],
                'short_name' => $department->short_name,
                'status' => $department->status,
                'display_order' => $department->display_order,
                'school_id' => $department->school_id,
            ];
        });

        return Inertia::render('Departments/Index', [
            'departments' => $departments,
            'schools' => $schools,
            'searchTerm' => $search ?? '',
        ]);
    }

    public function create()
    {
        $schools = School::select('id', 'name')->get();
        return Inertia::render('Departments/Create', [
            'schools' => $schools,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:departments,slug',
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'school_id' => 'required|exists:schools,id',
            'menu_name' => 'nullable|string|max:255',
            'name_short' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer|min:0',
            'academic_year' => 'nullable|string|max:50',
            'apply_now_link' => 'nullable|url|max:500',
            'brochure' => 'nullable|file|mimes:pdf,doc,docx|max:4000',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:1000',
            'useful_links' => 'nullable|array',
            'useful_links.*.text' => 'nullable|string|max:255',
            'useful_links.*.url' => 'nullable|url|max:500',
        ]);

        $data = $request->all();

        // Handle slug generation
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);

            if (Department::where('slug', $data['slug'])->exists()) {
                return back()
                    ->withErrors(['slug' => 'The generated slug already exists. Please enter a unique slug.'])
                    ->withInput();
            }
        }

        if ($request->hasFile('brochure')) {
            $brochure = $request->file('brochure');
            $brochureName = time() . '_' . uniqid() . '.' . $brochure->getClientOriginalExtension();
            $brochure->move(public_path('assets/pdf/department/'), $brochureName);

            $data['brochure'] = 'assets/pdf/department/' . $brochureName;
        }
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/pdf/department/'), $imageName);

            $data['image'] = 'assets/pdf/department/' . $imageName;
        }

        if (isset($data['useful_links']) && is_array($data['useful_links'])) {
            $filteredLinks = array_filter($data['useful_links'], function ($link) {
                return !empty(trim($link['text'] ?? '')) || !empty(trim($link['url'] ?? ''));
            });
            $data['useful_links'] = !empty($filteredLinks) ? json_encode(array_values($filteredLinks)) : null;
        } else {
            $data['useful_links'] = null;
        }

        if (empty($data['display_order'])) {
            $data['display_order'] = 100;
        }

        $data = array_map(function ($value) {
            return $value === '' ? null : $value;
        }, $data);

        Department::create($data);

        return redirect()->route('department.index')->with('success', 'Department created successfully!');
    }

    public function edit(Department $department)
    {
        $schools = School::select('id', 'name')->get();
        $data = $department->only([
            'id',
            'name',
            'school_id',
            'menu_name',
            'image',
            'brochure',
            'academic_year',
            'useful_links',
            'apply_now_link',
            'name_short',
            'slug',
            'display_order',
        ]);

        if (isset($data['useful_links']) && is_string($data['useful_links'])) {
            $data['useful_links'] = json_decode($data['useful_links'], true) ?? [];
        } else {
            $data['useful_links'] = [];
        }

        return Inertia::render('Departments/Edit', [
            'department' => $data,
            'schools' => $schools,
        ]);
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:departments,slug,' . $department->id,
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'school_id' => 'required|exists:schools,id',
            'menu_name' => 'nullable|string|max:255',
            'name_short' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer|min:0',
            'academic_year' => 'nullable|string|max:50',
            'apply_now_link' => 'nullable|url|max:500',
            'brochure' => 'nullable|file|mimes:pdf,doc,docx|max:10240', // 10MB max
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:1000',
            'useful_links' => 'nullable|array',
            'useful_links.*.text' => 'nullable|string|max:255',
            'useful_links.*.url' => 'nullable|url|max:500',
        ]);

        $data = $request->all();

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);

            if (Department::where('slug', $data['slug'])->where('id', '!=', $department->id)->exists()) {
                return back()
                    ->withErrors(['slug' => 'The generated slug already exists. Please enter a unique slug.'])
                    ->withInput();
            }
        }

        if ($request->hasFile('brochure')) {
            if ($department->brochure && file_exists(public_path($department->brochure))) {
                unlink(public_path($department->brochure));
            }

            $brochure = $request->file('brochure');
            $brochureName = time() . '_' . uniqid() . '.' . $brochure->getClientOriginalExtension();
            $brochure->move(public_path('assets/pdf/department/'), $brochureName);

            $data['brochure'] = 'assets/pdf/department/' . $brochureName;
        } else {
            $data['brochure'] = $department->brochure;
        }

        if ($request->hasFile('image')) {
            if ($department->image && file_exists(public_path($department->image))) {
                unlink(public_path($department->image));
            }

            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/pdf/department/'), $imageName);

            $data['image'] = 'assets/pdf/department/' . $imageName;
        } else {
            $data['image'] = $department->image;
        }

        if (isset($data['useful_links']) && is_array($data['useful_links'])) {
            $filteredLinks = array_filter($data['useful_links'], function ($link) {
                return !empty(trim($link['text'] ?? '')) || !empty(trim($link['url'] ?? ''));
            });
            $data['useful_links'] = !empty($filteredLinks) ? json_encode(array_values($filteredLinks)) : null;
        } else {
            $data['useful_links'] = null;
        }

        $data = array_map(function ($value) {
            return $value === '' ? null : $value;
        }, $data);

        $department->update($data);

        return redirect()->route('department.index')->with('success', 'Department updated successfully!');
    }

    public function destroy(Department $department)
    {
        $imageFields = ['image', 'hod_image', 'courses_image'];

        $brochureField = 'brochure';

        foreach ($imageFields as $field) {
            if ($department->$field && File::exists(public_path($department->$field))) {
                File::delete(public_path($department->$field));
            }
        }

        if ($department->$brochureField && File::exists(public_path($department->$brochureField))) {
            File::delete(public_path($department->$brochureField));
        }

        $department->delete();

        return redirect()->back()->with('success', 'Department and its files have been deleted successfully.');
    }

    public function toggleStatus($id)
    {
        $department = Department::findOrFail($id);
        $department->status = !$department->status;
        $department->save();

        return redirect()->route('department.index')->with('success', 'Department Status Updated!');
    }

    public function createSections(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        // Load Department "Research" page content (stored in pages + page_sections)
        $researchTitle = '';
        $researchContent = '';
        $researchSlug = $department->slug . '/research';
        $researchPage = Pages::where('slug', $researchSlug)
            ->where('department_id', $department->id)
            ->first();

        if ($researchPage) {
            $researchSection = PageSection::where('page_id', $researchPage->id)
                ->where('section_type', 'departmentResearch')
                ->orderBy('position')
                ->first();

            $researchTitle = $researchSection->content['title'] ?? $researchPage->title ?? 'Research';
            $researchContent = $researchSection->content['content'] ?? '';
        }

        // Append as dynamic attributes for Inertia page
        $department->research_title = $researchTitle;
        $department->research_content = $researchContent;

        return Inertia::render('Departments/CreateOrUpdateSections', [
            'department' => $department,
        ]);
    }

    public function storeOrUpdate(Request $request, $id = null)
    {
        $department = Department::findOrFail($id);

        $rules = [
            // About Department
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'vision_title' => 'nullable|string|max:255',
            'vision_description' => 'nullable|string',
            'mission_title' => 'nullable|string|max:255',
            'mission_points' => 'nullable|array',
            'mission_points.*' => 'nullable|string',
            'display_order' => 'nullable|integer',
            'status' => 'nullable|boolean',

            // Dean/HOD Message
            'hod_title' => 'nullable|string|max:255',
            'hod_name' => 'nullable|string|max:255',
            'hod_designation' => 'nullable|string|max:255',
            'hod_messages' => 'nullable|array',
            'hod_messages.*' => 'nullable|string',
            'hod_messages_list' => 'nullable|array',
            'hod_messages_list.*' => 'nullable|string',

            // Courses
            'courses_title' => 'nullable|string|max:255',
            'courses_subtitle' => 'nullable|string|max:255',

            // Faculty
            'faculty_title' => 'nullable|string|max:255',
            'faculty_subtitle' => 'nullable|string|max:255',

            // Laboratories
            'lab_title' => 'nullable|string|max:255',
            'lab_subtitle' => 'nullable|string|max:255',
            'lab_description' => 'nullable|string|max:255',
            'lab_url' => 'nullable|string|max:255',

            // Happening
            'happening_title' => 'nullable|string|max:255',
            'happening_subtitle' => 'nullable|string|max:255',

            'placement_title' => 'nullable|string|max:255',
            'placement_subtitle' => 'nullable|string|max:255',
            'hall_of_fame_heading' => 'nullable|string|max:255',
            'hall_of_fame_url' => 'nullable|url|max:255',

            // Laboratory Page Data
            'name_of_laboratory' => 'nullable|array',
            'name_of_laboratory.*' => 'nullable|string|max:255',
            'name_of_equipment' => 'nullable|array',
            'name_of_equipment.*' => 'nullable|string|max:255',
            'lab_images' => 'nullable|array',
            'lab_images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2000',

            // Research (stored into department pages)
            'research_title' => 'nullable|string|max:255',
            'research_content' => 'nullable|string',

            // Program Count Section
            'department_title' => 'nullable|string|max:255',
            'department_desc' => 'nullable|string',
            'department_programs_count' => 'nullable|string|max:100',
            'department_programs_text' => 'nullable|string|max:255',
            'department_buttons' => 'nullable|string|max:255',
        ];

        // Single file upload rules
        if ($request->hasFile('image')) {
            $rules['image'] = 'image|mimes:jpg,jpeg,png,webp|max:2000';
        }

        if ($request->hasFile('hod_image')) {
            $rules['hod_image'] = 'image|mimes:jpg,jpeg,png,webp|max:2000';
        }

        if ($request->hasFile('courses_image')) {
            $rules['courses_image'] = 'image|mimes:jpg,jpeg,png,webp|max:2000';
        }

        $validated = $request->validate($rules);

        // Handle single file uploads
        $fileFields = [
            'image' => 'departments/',
            'hod_image' => 'departments/',
            'courses_image' => 'departments/',
            'hall_of_fame_image' => 'departments/',
        ];

        foreach ($fileFields as $field => $folder) {
            if ($request->hasFile($field)) {
                // Delete old file if exists
                if ($department->$field && file_exists(public_path($department->$field))) {
                    unlink(public_path($department->$field));
                }

                $file = $request->file($field);
                $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('assets/img/' . $folder), $fileName);
                $validated[$field] = 'assets/img/' . $folder . $fileName;
            }
        }

        // Handle multiple lab images upload
        if ($request->hasFile('lab_images')) {
            $labImages = [];
            $existingImages = $department->lab_images ?? [];

            // Delete old images if they exist
            if (!empty($existingImages)) {
                foreach ($existingImages as $oldImage) {
                    if (file_exists(public_path($oldImage))) {
                        unlink(public_path($oldImage));
                    }
                }
            }

            foreach ($request->file('lab_images') as $image) {
                $fileName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('assets/img/departments/labs/'), $fileName);
                $labImages[] = 'assets/img/departments/labs/' . $fileName;
            }

            $validated['lab_images'] = $labImages;
        }

        // Clean up array fields
        $arrayFields = ['mission_points', 'hod_messages','hod_messages_list', 'name_of_laboratory', 'name_of_equipment'];
        foreach ($arrayFields as $field) {
            if (!empty($validated[$field])) {
                // Filter out empty values
                $validated[$field] = array_values(array_filter($validated[$field], function ($value) {
                    return !is_null($value) && trim($value) !== '';
                }));

                // If array is empty after filtering, set to null
                if (empty($validated[$field])) {
                    $validated[$field] = null;
                }
            }
        }

        $department->update($validated);

        // --- Research page upsert (department pages) ---
        $researchTitle = $request->input('research_title');
        $researchContent = $request->input('research_content');
        $hasResearchData = (is_string($researchTitle) && trim($researchTitle) !== '') || (is_string($researchContent) && trim($researchContent) !== '');

        $researchSlug = $department->slug . '/research';
        $researchPage = Pages::where('slug', $researchSlug)
            ->where('department_id', $department->id)
            ->first();

        if ($hasResearchData) {
            $pageData = [
                'department_id' => $department->id,
                'title' => (is_string($researchTitle) && trim($researchTitle) !== '') ? trim($researchTitle) : 'Research',
                'type' => 'Research',
                'slug' => $researchSlug,
                'display_order' => 4,
                'status' => 1,
            ];

            if ($researchPage) {
                $researchPage->update($pageData);
            } else {
                $researchPage = Pages::create($pageData);
            }

            // Ensure pivot mapping exists (tabs builder uses $department->pages relation)
            $researchPage->departments()->syncWithoutDetaching([$department->id]);

            // Replace existing section content (single item)
            PageSection::where('page_id', $researchPage->id)
                ->where('section_type', 'departmentResearch')
                ->delete();

            PageSection::create([
                'page_id' => $researchPage->id,
                'group_key' => 'department-research',
                'section_type' => 'departmentResearch',
                'position' => 1,
                'content' => [
                    'title' => $pageData['title'],
                    'content' => $researchContent ?? '',
                ],
            ]);
        } else if ($researchPage) {
            // If cleared, keep the page but remove its content
            PageSection::where('page_id', $researchPage->id)
                ->where('section_type', 'departmentResearch')
                ->delete();
        }

        return redirect()->back()->with('success', 'Department sections updated successfully.');
    }
}
