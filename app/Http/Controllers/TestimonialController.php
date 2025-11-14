<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pages;
use App\Models\Course;
use App\Models\School;
use App\Models\Department;
use App\Models\Testimonial;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $testimonials = Testimonial::filter(['search' => $search])->orderBy('display_order', 'asc')->paginate(10)->withQueryString()->through(function ($item) {
            return [
                'id' => $item->id,
                'type' => $item->type,
                'title' => $item->title,
                'slug' => $item->slug,
                'alt_text' => $item->alt_text,
                'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                'video_url' => $item->video_url,
                'short_description' => $item->short_description,
                'name' => $item->name,
                'batch' => $item->batch,
                'course' => $item->course,
                'description' => $item->description,
                'designation' => $item->designation,
                'location' => $item->location,
                'company' => $item->company,
                'status' => $item->status,
                'show_on_home' => $item->show_on_home,
                'display_order' => $item->display_order,
            ];
        });

        return Inertia::render('Testimonials/Index', [
            'testimonials' => $testimonials,
            'searchTerm' => $search ?? '',
        ]);
    }

    public function create()
    {
        return Inertia::render('Testimonials/Create'); 
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:placement,alumuni,student',
            'title' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:testimonials,slug',
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'alt_text' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'video_url' => 'nullable|string|max:555',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'name' => 'nullable|string|max:255',
            'batch' => 'nullable|string|max:255',
            'course' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'status' => 'nullable|integer|in:0,1',
            'show_on_home' => 'nullable|integer|in:0,1',
            'display_order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);

            if (Testimonial::where('slug', $validated['slug'])->exists()) {
                return back()
                    ->withErrors(['slug' => 'The generated slug already exists. Please enter a unique slug.'])
                    ->withInput();
            }
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/testimonials/'), $imageName);

            $validated['image'] = 'assets/img/testimonials/' . $imageName;
        }

        Testimonial::create($validated);

        return redirect()->route('testimonial.index')->with('success', 'Testimonial created successfully!');
    }

    public function edit(Testimonial $testimonial)
    {
        return Inertia::render('Testimonials/Edit',[
            'testimonial'=> $testimonial,
        ]);
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $validated = $request->validate([
            'type' => 'required|in:placement,alumuni,student',
            'title' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:testimonials,slug,' . $testimonial->id,
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'alt_text' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'name' => 'nullable|string|max:255',
            'batch' => 'nullable|string|max:255',
            'course' => 'nullable|string|max:255',
            'designation' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'video_url' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer',
            'status' => 'boolean',
            'show_on_home' => 'boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);

            $exists = Testimonial::where('slug', $validated['slug'])
                ->where('id', '!=', $testimonial->id)
                ->exists();

            if ($exists) {
                return back()
                    ->withErrors(['slug' => 'The generated slug already exists. Please enter a unique slug.'])
                    ->withInput();
            }
        }


        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            if (!empty($testimonial->image) && file_exists(public_path($testimonial->image))) {
                unlink(public_path($testimonial->image));
            }

            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/testimonials/'), $imageName);
            $validated['image'] = 'assets/img/testimonials/' . $imageName;
        }

        $testimonial->update($validated);

        return redirect()->route('testimonial.index')->with('success', 'Testimonial updated successfully!');

    }

    public function destroy(Testimonial $testimonial)
    {
        if ($testimonial->image && file_exists(public_path($testimonial->image))) {
            @unlink(public_path($testimonial->image));
        }
        
        $testimonial->schools()->detach();
        $testimonial->pages()->detach();
        $testimonial->departments()->detach();
        $testimonial->courses()->detach();
        
        $testimonial->delete();

        return redirect()->route('testimonial.index')->with('success', 'Testimonial deleted successfully!');
    }

    public function toggleStatus($id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->status = !$testimonial->status;
        $testimonial->save();

        return redirect()->route('testimonial.index')->with('success', 'Testimonial Status Updated!');
    }

    public function mapping($id)
    {
        $testimonial = Testimonial::with(['schools:id,name', 'pages:id,title', 'departments:id,name', 'courses:id,name'])->findOrFail($id);
        $schools = School::select('id', 'name')->get();
        $pages = Pages::select('id', 'title')->get();
        $departments = Department::with('school:id,name')->get()->map(function ($department) {
            return [
                'id' => $department->id,
                'name' => $department->name,
                'school' => $department->school ? $department->school->name : null,
            ];
        });
        $courses = Course::select('id', 'name')->get();

        return Inertia::render('Testimonials/Mapping', [
            'testimonial' => $testimonial,
            'schools' => $schools,
            'pages' => $pages,
            'departments' => $departments,
            'courses' => $courses,
        ]);
    }

    public function attachMapping(Request $request, $id)
    {
        $testimonial = Testimonial::findOrFail($id);

        $validated = $request->validate([
            'school_ids' => 'nullable|array',
            'school_ids.*' => 'exists:schools,id',
            'page_ids' => 'nullable|array',
            'page_ids.*' => 'exists:pages,id',
            'department_ids' => 'nullable|array',
            'department_ids.*' => 'exists:departments,id',
            'course_ids' => 'nullable|array',
            'course_ids.*' => 'exists:courses,id',
        ]);

        $testimonial->show_on_home = $request->show_on_home;
        $testimonial->save();
        $testimonial->schools()->sync($validated['school_ids'] ?? []);
        $testimonial->pages()->sync($validated['page_ids'] ?? []);
        $testimonial->departments()->sync($validated['department_ids'] ?? []);
        $testimonial->courses()->sync($validated['course_ids'] ?? []);

        return redirect()->route('testimonial.index', $testimonial->id)->with('success', 'Testimonial mapped successfully!');
    }
}
