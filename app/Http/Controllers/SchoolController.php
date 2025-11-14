<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\School;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $schools = School::filter(['search' => $search])->orderBy('display_order', 'asc')->paginate(10)->withQueryString()->through(function ($school) {
            return [
                'id' => $school->id,
                'name' => $school->name,
                'slug' => $school->slug,
                'menu_name' => $school->menu_name,
                'name_short' => $school->name_short,
                'short_description' => $school->short_description,
                'image' => $school->image ? asset($school->image) : asset('assets/img/placeholder.png'),
                'prospectus' => $school->prospectus ? asset($school->prospectus) : null,
                'apply_now_link' => $school->apply_now_link,
                'useful_links' => json_decode($school->useful_links, true) ?? [],
                'display_order' => $school->display_order,
                'academic_years' => $school->academic_years,
                'mobile_contact' => $school->mobile_contact,
                'virtual_tour' => $school->virtual_tour,
                'virtual_display_order' => $school->virtual_display_order,
                'status' => $school->status,
            ];
        });

        return Inertia::render('Schools/Index', [
            'schools' => $schools,
            'searchTerm' => $search ?? '',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Schools/Create'); 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:schools,slug',
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'menu_name' => 'nullable|string|max:255',
            'short_name' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:1000',
            'prospectus' => 'nullable|mimes:pdf|max:1000',
            'apply_now_link' => 'nullable|url|max:500',
            'useful_links' => 'nullable|array',
            'useful_links.*.text' => 'nullable|string|max:255',
            'useful_links.*.url' => 'nullable|url|max:500',
        ]);

        $data = $request->all();

        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);

            if (School::where('slug', $data['slug'])->exists()) {
                return back()
                    ->withErrors(['slug' => 'The generated slug already exists. Please enter a unique slug.'])
                    ->withInput();
            }
        }


        $imageFields = [
            'image','prospectus'
        ];

        foreach ($imageFields as $field) {
            if ($request->hasFile($field)) {
                if (!empty($school->$field) && file_exists(public_path($school->$field))) {
                    unlink(public_path($school->$field));
                }
                $file = $request->file($field);
                $name = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $path = 'assets/img/schools/' . $name;
                $file->move(public_path('assets/img/schools/'), $name);
                $data[$field] = $path;
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

        School::create($data);

        return redirect()->route('schools.index')->with('success', 'School created successfully!');
    }


    /**
     * Display the specified resource.
     */
    public function show(School $school)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(School $school)
    {
        $data = $school->only([
            'id',
            'name',
            'menu_name',
            'name_short',
            'short_description',
            'academic_years',
            'mobile_contact',
            'virtual_tour',
            'virtual_display_order',
            'slug',
            'image',
            'prospectus',
            'display_order',
            'useful_links',
            'apply_now_link',
        ]);

        if (isset($data['useful_links']) && is_string($data['useful_links'])) {
            $data['useful_links'] = json_decode($data['useful_links'], true) ?? [];
        } else {
            $data['useful_links'] = [];
        }

        if ($data['image']) {
            $data['image'] = asset($data['image']);
        }

        if ($data['prospectus']) {
            $data['prospectus'] = asset($data['prospectus']);
        }

        return Inertia::render('Schools/Edit', [
            'school' => $data,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, School $school)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:schools,slug,' . $school->id,
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'menu_name' => 'nullable|string|max:255',
            'name_short' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'academic_years' => 'nullable|string|max:255',
            'mobile_contact' => 'nullable|string|max:255',
            'virtual_tour' => 'nullable|string|max:500',
            'display_order' => 'nullable|integer',
            'virtual_display_order' => 'nullable|integer',

            // removal flags
            'remove_image' => 'nullable|boolean',
            'remove_prospectus' => 'nullable|boolean',
            'apply_now_link' => 'nullable|url|max:500',
            'useful_links' => 'nullable|array',
            'useful_links.*.text' => 'nullable|string|max:255',
            'useful_links.*.url' => 'nullable|url|max:500',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);

            $exists = School::where('slug', $validated['slug'])
                ->where('id', '!=', $school->id)
                ->exists();

            if ($exists) {
                return back()
                    ->withErrors(['slug' => 'The generated slug already exists. Please enter a unique slug.'])
                    ->withInput();
            }
        }


        if ($request->hasFile('image')) {
            $request->validate(['image' => 'image|mimes:jpg,jpeg,png,webp|max:2048']);
            
            if ($school->image && file_exists(public_path($school->image))) {
                unlink(public_path($school->image));
            }

            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/schools/'), $imageName);
            $validated['image'] = 'assets/img/schools/' . $imageName;

        } elseif ($request->has('remove_image') && $request->remove_image) {
            if ($school->image && file_exists(public_path($school->image))) {
                unlink(public_path($school->image));
            }
            $validated['image'] = null;
        }

        if ($request->hasFile('prospectus')) {
            $request->validate(['prospectus' => 'mimes:pdf|max:5120']);
            
            if ($school->prospectus && file_exists(public_path($school->prospectus))) {
                unlink(public_path($school->prospectus));
            }

            $prospectus = $request->file('prospectus');
            $prospectusName = time() . '_' . uniqid() . '.' . $prospectus->getClientOriginalExtension();
            $prospectus->move(public_path('assets/pdf/schools/'), $prospectusName);
            $validated['prospectus'] = 'assets/pdf/schools/' . $prospectusName;

        } elseif ($request->has('remove_prospectus') && $request->remove_prospectus) {
            if ($school->prospectus && file_exists(public_path($school->prospectus))) {
                unlink(public_path($school->prospectus));
            }
            $validated['prospectus'] = null;
        }

        
        if (isset($validated['useful_links']) && is_array($validated['useful_links'])) {
            $filteredLinks = array_filter($validated['useful_links'], function($link) {
                return !empty(trim($link['text'] ?? '')) || !empty(trim($link['url'] ?? ''));
            });
            $validated['useful_links'] = !empty($filteredLinks) ? json_encode(array_values($filteredLinks)) : null;
        } else {
            $validated['useful_links'] = null;
        }

        $validated = array_map(function($value) {
            return $value === '' ? null : $value;
        }, $validated);

        $school->update($validated);

        return redirect()->route('schools.index')->with('success', 'School updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(School $school)
    {
        $fileFields = [
            'image',
            'prospectus',
            'about_school_chancellor_img',
            'about_school_chancellor_logo',
            'hall_of_fame_image',
        ];

        foreach ($fileFields as $field) {
            if (!empty($school->$field)) {
                $filePath = public_path($school->$field);
                if (file_exists($filePath)) {
                    @unlink($filePath);
                }
            }
        }

        $school->delete();

        return redirect()
            ->route('schools.index')
            ->with('success', 'School and associated files deleted successfully!');
    }

    public function toggleStatus($id)
    {
        $school = School::findOrFail($id);
        $school->status = !$school->status;
        $school->save();

        return redirect()->route('schools.index')->with('success', 'School Status Updated!');
    }

    public function createSections($id)
    {
        $school = School::findOrFail($id);

        return Inertia::render('Schools/CreateOrUpdateSections',[
            'school' => $school,
        ]); 
    } 

    public function storeOrUpdate(Request $request, $id)
    {
        $school = School::find($id);

        if (!$school) {
            return redirect()->back()->with('error', 'School not found.');
        }

        $rules = [
            // === ABOUT SCHOOL SECTION ===
            'about_school_title' => 'nullable|string|max:255',
            'about_school_subtitle' => 'nullable|string|max:255',
            'about_school_description' => 'nullable|string',
            'about_school_url' => 'nullable|url|max:255',
            'about_school_logo_content' => 'nullable|string|max:255',
            'about_school_stats_number' => 'nullable|string|max:255',
            'about_school_stats_content' => 'nullable|string|max:255',
            'about_highlights' => 'nullable|array',
            'about_highlights.*.rank' => 'nullable|string|max:255',
            'about_highlights.*.text' => 'nullable|string|max:255',
            'about_highlights.*.source' => 'nullable|string|max:255',
            'about_buttons' => 'nullable|array',
            'about_buttons.*.text' => 'nullable|string|max:255',
            'about_buttons.*.url' => 'nullable|url|max:255',

            // === DEPARTMENT SECTION ===
            'department_title' => 'nullable|string|max:255',
            'department_desc' => 'nullable|string',
            'department_programs_count' => 'nullable|string|max:255',
            'department_programs_text' => 'nullable|string|max:255',
            'department_buttons' => 'nullable|array',
            'department_buttons.*.text' => 'nullable|string|max:255',
            'department_buttons.*.url' => 'nullable|url|max:255',

            // === PLACEMENT SECTION ===
            'placement_title' => 'nullable|string|max:255',
            'placement_subtitle' => 'nullable|string|max:255',
            'hall_of_fame_heading' => 'nullable|string|max:255',
            'hall_of_fame_url' => 'nullable|url|max:255',

            // === TESTIMONIAL SECTION ===
            'testimonial_title' => 'nullable|string|max:255',
            'testimonial_subtitle' => 'nullable|string|max:255',

            // === HAPPENING SECTION ===
            'happening_title' => 'nullable|string|max:255',
            'happening_subtitle' => 'nullable|string|max:255',
        ];



        // Conditionally validate images only if uploaded
        if ($request->hasFile('about_school_chancellor_img')) {
            $rules['about_school_chancellor_img'] = 'image|mimes:jpg,jpeg,png,webp|max:1000';
        }

        if ($request->hasFile('about_school_chancellor_logo')) {
            $rules['about_school_chancellor_logo'] = 'image|mimes:jpg,jpeg,png,webp|max:1000';
        }

        if ($request->hasFile('hall_of_fame_image')) {
            $rules['hall_of_fame_image'] = 'image|mimes:jpg,jpeg,png,webp|max:1000';
        }
        
        
        $validated = $request->validate($rules);

        // Handle Chancellor Image
        if ($request->hasFile('about_school_chancellor_img')) {
            $image = $request->file('about_school_chancellor_img');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/schools/'), $imageName);
            $validated['about_school_chancellor_img'] = 'assets/img/schools/' . $imageName;
        }

        // Handle Chancellor Logo
        if ($request->hasFile('about_school_chancellor_logo')) {
            $image = $request->file('about_school_chancellor_logo');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/schools/'), $imageName);
            $validated['about_school_chancellor_logo'] = 'assets/img/schools/' . $imageName;
        }

        // Handle Hall of Fame Image
        if ($request->hasFile('hall_of_fame_image')) {
            $image = $request->file('hall_of_fame_image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/schools/'), $imageName);
            $validated['hall_of_fame_image'] = 'assets/img/schools/' . $imageName;
        }

            if ($request->has('about_highlights')) {
                $school->about_highlights = json_encode($request->about_highlights);
            }
            
            if ($request->has('about_buttons')) {
                $school->about_buttons = json_encode($request->about_buttons);
            }
            
            if ($request->has('department_buttons')) {
                $school->department_buttons = json_encode($request->department_buttons);
            }

        // Update School
        $school->update($validated);

        return redirect()->back()->with('success', 'School section updated successfully.');
    }

}
