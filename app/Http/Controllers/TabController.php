<?php

namespace App\Http\Controllers;

use App\Models\Tab;
use Inertia\Inertia;
use Illuminate\Http\Request;

class TabController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $tabs = Tab::filter(['search' => $search])->orderBy('id', 'desc')->paginate(10)->withQueryString()->through(function ($item) {
            return [
                'id' => $item->id,
                'title' => $item->title,
                'subtitle' => $item->subtitle,
            ];
        });

        return Inertia::render('Tabs/Index', [
            'tabs' => $tabs,
            'searchTerm' => $search ?? '',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Tabs/Create'); 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
        ]);

        Tab::create($validated);

        return redirect()->route('tab.index')->with('success', 'Tab created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tab $tab)
    {
        return Inertia::render('Tabs/Edit',[
            'tab'=> $tab,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tab $tab)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
        ]);

        $tab->update($validated);

        return redirect()->route('tab.index')->with('success', 'Tab updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tab $tab)
    {
        $tab->delete();
        return redirect()->route('tab.index')->with('success', 'Tab Deleted successfully!');
    }
}
