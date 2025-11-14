<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\School;
use App\Models\Department;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $schools = School::select('id','name')->get();
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
        $schools = School::select('id','name')->get();
        return Inertia::render('Departments/Create',[
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

        if (isset($data['useful_links']) && is_array($data['useful_links'])) {
            $filteredLinks = array_filter($data['useful_links'], function($link) {
                return !empty(trim($link['text'] ?? '')) || !empty(trim($link['url'] ?? ''));
            });
            $data['useful_links'] = !empty($filteredLinks) ? json_encode(array_values($filteredLinks)) : null;
        } else {
            $data['useful_links'] = null;
        }

        if (empty($data['display_order'])) {
            $data['display_order'] = 100;
        }

        $data = array_map(function($value) {
            return $value === '' ? null : $value;
        }, $data);

        Department::create($data);

        return redirect()->route('department.index')->with('success', 'Department created successfully!');
    }

    public function edit(Department $department)
    {
        $schools = School::select('id','name')->get();
        $data = $department->only([
            'id',
            'name',
            'school_id',
            'menu_name',
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
        return Inertia::render('Departments/CreateOrUpdateSections', [
            'department' => Department::find($id),
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
            'mission_points.*' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer',
            'status' => 'nullable|boolean',

            // Dean/HOD Message
            'hod_title' => 'nullable|string|max:255',
            'hod_name' => 'nullable|string|max:255',
            'hod_designation' => 'nullable|string|max:255',
            'hod_messages' => 'nullable|array',
            'hod_messages.*' => 'nullable|string',

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
        ];

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

        $fileFields = [
            'image' => 'departments/',
            'hod_image' => 'departments/',
            'courses_image' => 'departments/',
        ];

        foreach ($fileFields as $field => $folder) {
            if ($request->hasFile($field)) {
                if ($department->$field && file_exists(public_path($department->$field))) {
                    unlink(public_path($department->$field));
                }

                $file = $request->file($field);
                $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('assets/img/' . $folder), $fileName);
                $validated[$field] = 'assets/img/' . $folder . $fileName;
            }
        }
        if (!empty($validated['mission_points'])) {
            $validated['mission_points'] = array_values($validated['mission_points']);
        }
        if (!empty($validated['hod_messages'])) {
            $validated['hod_messages'] = array_values($validated['hod_messages']);
        }
        
        $department->update($validated);

        return redirect()->back()->with('success', 'Department updated successfully.');
    }
}
