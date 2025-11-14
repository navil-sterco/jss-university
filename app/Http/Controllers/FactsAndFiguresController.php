<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pages;
use App\Models\Course;
use App\Models\School;
use App\Models\Department;
use Illuminate\Http\Request;
use App\Models\FactsAndFigures;

class FactsAndFiguresController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $factsAndFigures = FactsAndFigures::filter(['search' => $search])->orderBy('display_order', 'asc')->paginate(10)->withQueryString()->through(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'description' => $item->description,
                'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                'figure' => $item->figure,
                'status' => $item->status,
                'show_on_home' => $item->show_on_home,
                'display_order' => $item->display_order,
            ];
        });

        return Inertia::render('FactsAndFigures/Index', [
            'factsAndFigures' => $factsAndFigures,
            'searchTerm' => $search ?? '',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('FactsAndFigures/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'figure' => 'nullable|string|max:100',
            'status' => 'nullable|integer|in:0,1',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'show_on_home' => 'nullable|integer|in:0,1',
            'display_order' => 'nullable|integer',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/facts/'), $imageName);

            $validated['image'] = 'assets/img/facts/' . $imageName;
        }

        FactsAndFigures::create($validated);

        return redirect()->route('facts-and-figures.index')->with('success', 'Facts And Figures created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(FactsAndFigures $factsAndFigures)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $factsAndFigures = FactsAndFigures::findOrFail($id);
        return Inertia::render('FactsAndFigures/Edit',[
            'factsAndFigures'=> $factsAndFigures,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $factsAndFigures = FactsAndFigures::findOrFail($id);
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'figure' => 'nullable|string|max:100',
            'status' => 'nullable|integer|in:0,1',
            'show_on_home' => 'nullable|integer|in:0,1',
            'display_order' => 'nullable|integer',
        ]);

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            if (!empty($factsAndFigures->image) && file_exists(public_path($factsAndFigures->image))) {
                unlink(public_path($factsAndFigures->image));
            }

            // Upload new image
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/facts/'), $imageName);

            $validated['image'] = 'assets/img/facts/' . $imageName;
        }

        $factsAndFigures->update($validated);

        return redirect()->route('facts-and-figures.index')->with('success', 'Facts And Figures updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FactsAndFigures $factsAndFigures)
    {
        if ($factsAndFigures->image && file_exists(public_path($factsAndFigures->image))) {
            @unlink(public_path($factsAndFigures->image));
        }

        $factsAndFigures->schools()->detach();
        $factsAndFigures->pages()->detach();
        $factsAndFigures->departments()->detach();
        $factsAndFigures->courses()->detach();

        $factsAndFigures->delete();

        return redirect()->route('facts-and-figures.index')->with('success', 'Facts And Figures deleted successfully!');
    }

    public function toggleStatus($id)
    {
        $factsAndFigures = FactsAndFigures::findOrFail($id);
        $factsAndFigures->status = !$factsAndFigures->status;
        $factsAndFigures->save();

        return redirect()->route('facts-and-figures.index')->with('Facts And Figures', 'School Status Updated!');
    }

    public function mapping($id)
    {
        $factsAndFigures = FactsAndFigures::with(['schools:id,name', 'pages:id,title', 'departments:id,name', 'courses:id,name'])->findOrFail($id);
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

        return Inertia::render('FactsAndFigures/Mapping', [
            'factsandfigures' => $factsAndFigures,
            'schools' => $schools,
            'pages' => $pages,
            'departments' => $departments,
            'courses' => $courses,
        ]);
    }

    public function attachMapping(Request $request, $id)
    {
        $factsAndFigures = FactsAndFigures::findOrFail($id);

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

        $factsAndFigures->show_on_home = $request->show_on_home;
        $factsAndFigures->save();
        $factsAndFigures->schools()->sync($validated['school_ids'] ?? []);
        $factsAndFigures->pages()->sync($validated['page_ids'] ?? []);
        $factsAndFigures->departments()->sync($validated['department_ids'] ?? []);
        $factsAndFigures->courses()->sync($validated['course_ids'] ?? []);

        return redirect()->route('facts-and-figures.index', $factsAndFigures->id)->with('success', 'Facts And Figures mapped successfully!');
    }
}
