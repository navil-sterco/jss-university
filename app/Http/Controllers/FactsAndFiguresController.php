<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pages;
use App\Models\School;
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
            'show_on_home' => 'nullable|integer|in:0,1',
            'display_order' => 'nullable|integer',
        ]);

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

        $factsAndFigures->update($validated);

        return redirect()->route('facts-and-figures.index')->with('success', 'Facts And Figures updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FactsAndFigures $factsAndFigures)
    {
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
        $factsAndFigures = FactsAndFigures::with(['schools:id,name', 'pages:id,title'])->findOrFail($id);
        $schools = School::select('id', 'name')->get();
        $pages = Pages::select('id', 'title')->get();

        return Inertia::render('FactsAndFigures/Mapping', [
            'factsandfigures' => $factsAndFigures,
            'schools' => $schools,
            'pages' => $pages,
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
            'show_on_home' =>'nullable',
        ]);

        $factsAndFigures->show_on_home = $request->show_on_home;
        $factsAndFigures->save();
        $factsAndFigures->schools()->sync($validated['school_ids'] ?? []);
        $factsAndFigures->pages()->sync($validated['page_ids'] ?? []);

        return redirect()->route('facts-and-figures.mapping', $factsAndFigures->id)->with('success', 'Facts And Figures mapped successfully!');
    }
}
