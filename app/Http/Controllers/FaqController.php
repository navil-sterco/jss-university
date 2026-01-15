<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Inertia\Inertia;
use App\Models\Pages;
use App\Models\Course;
use App\Models\School;
use App\Models\Department;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $faqs = Faq::filter(['search' => $search])->orderBy('display_order', 'asc')->paginate(10)->withQueryString()->through(function ($item) {
            return [
                'id' => $item->id,
                'question' => $item->question,
                'answer' => $item->answer,
                'status' => $item->status,
                'display_order' => $item->display_order,
            ];
        });

        return Inertia::render('Faqs/Index', [
            'faqs' => $faqs,
            'searchTerm' => $search ?? '',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Faqs/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'status' => 'nullable|integer|in:0,1',
            'display_order' => 'nullable|integer',
        ]);

        Faq::create($validated);

        return redirect()->route('faq.index')->with('success', 'Faq created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Faq $faq)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Faq $faq)
    {
        return Inertia::render('Faqs/Edit',[
            'faq'=> $faq,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'status' => 'nullable|integer|in:0,1',
            'display_order' => 'nullable|integer',
        ]);

        $faq->update($validated);

        return redirect()->route('faq.index')->with('success', 'Faq updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faq $faq)
    {
        $faq->schools()->detach();
        $faq->pages()->detach();
        $faq->departments()->detach();
        $faq->courses()->detach();

        $faq->delete();

        return redirect()->route('faq.index')->with('success', 'Faq deleted successfully!');
    }

    public function toggleStatus($id)
    {
        $faq = Faq::findOrFail($id);
        $faq->status = !$faq->status;
        $faq->save();

        return redirect()->route('faq.index')->with('success', 'Faq Status Updated!');
    }

    public function mapping($id)
    {
        $faq = Faq::with(['schools:id,name', 'pages:id,title', 'departments:id,name', 'courses:id,name'])->findOrFail($id);
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

        return Inertia::render('Faqs/Mapping', [
            'faq' => $faq,
            'schools' => $schools,
            'pages' => $pages,
            'departments' => $departments,
            'courses' => $courses,
        ]);
    }

    public function attachMapping(Request $request, $id)
    {
        $faq = Faq::findOrFail($id);

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

        $faq->schools()->sync($validated['school_ids'] ?? []);
        $faq->pages()->sync($validated['page_ids'] ?? []);
        $faq->departments()->sync($validated['department_ids'] ?? []);
        $faq->courses()->sync($validated['course_ids'] ?? []);

        return redirect()->route('faq.index', $faq->id)->with('success', 'Faq mapped successfully!');
    }
}
