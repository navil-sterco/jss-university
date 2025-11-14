<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pages;
use App\Models\Course;
use App\Models\School;
use App\Models\Recruiter;
use App\Models\Department;
use Illuminate\Http\Request;

class RecruiterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $recruiters = Recruiter::filter(['search' => $search])->orderBy('display_order', 'asc')->paginate(10)->withQueryString()->through(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                'description' => $item->description,
                'status' => $item->status,
                'show_on_home' => $item->show_on_home,
                'display_order' => $item->display_order,
            ];
        });

        return Inertia::render('Recruiters/Index', [
            'recruiters' => $recruiters,
            'searchTerm' => $search ?? '',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Recruiters/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'description' => 'nullable|string',
            'status' => 'nullable|integer|in:0,1',
            'show_on_home' => 'nullable|integer|in:0,1',
            'display_order' => 'nullable|integer',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/recruiter/'), $imageName);

            $validated['image'] = 'assets/img/recruiter/' . $imageName;
        }

        Recruiter::create($validated);

        return redirect()->route('recruiters.index')->with('success', 'Recruiter created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Recruiter $recruiter)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Recruiter $recruiter)
    {
        return Inertia::render('Recruiters/Edit',[
            'recruiter'=> $recruiter,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Recruiter $recruiter)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'display_order' => 'nullable|integer',
            'status' => 'boolean',
            'show_on_home' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            if (!empty($recruiter->image) && file_exists(public_path($recruiter->image))) {
                unlink(public_path($recruiter->image));
            }

            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/recruiter/'), $imageName);
            $validated['image'] = 'assets/img/recruiter/' . $imageName;
        }

        $recruiter->update($validated);

        return redirect()->route('recruiters.index')->with('success', 'Recruiter updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Recruiter $recruiter)
    {
        if ($recruiter->image && file_exists(public_path($recruiter->image))) {
            @unlink(public_path($recruiter->image));
        }

        $recruiter->schools()->detach();
        $recruiter->pages()->detach();
        $recruiter->departments()->detach();
        $recruiter->courses()->detach();
        
        $recruiter->delete();

        return redirect()->route('recruiters.index')->with('success', 'Recruiter deleted successfully!');
    }

    public function toggleStatus($id)
    {
        $recruiter = Recruiter::findOrFail($id);
        $recruiter->status = !$recruiter->status;
        $recruiter->save();

        return redirect()->route('recruiters.index')->with('success', 'Recruiter Status Updated!');
    }

    public function mapping($id)
    {
        $recruiters = Recruiter::with(['schools:id,name', 'pages:id,title', 'departments:id,name', 'courses:id,name'])->findOrFail($id);
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

        return Inertia::render('Recruiters/Mapping', [
            'recruiters' => $recruiters,
            'schools' => $schools,
            'pages' => $pages,
            'departments' => $departments,
            'courses' => $courses,
        ]);
    }

    public function attachMapping(Request $request, $id)
    {
        $recruiters = Recruiter::findOrFail($id);

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

        $recruiters->show_on_home = $request->show_on_home;
        $recruiters->save();
        $recruiters->schools()->sync($validated['school_ids'] ?? []);
        $recruiters->pages()->sync($validated['page_ids'] ?? []);
        $recruiters->departments()->sync($validated['department_ids'] ?? []);
        $recruiters->courses()->sync($validated['course_ids'] ?? []);

        return redirect()->route('recruiters.index', $recruiters->id)->with('success', 'Recruiter mapped successfully!');
    }
}
