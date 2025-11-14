<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Degree;
use App\Models\Program;
use Illuminate\Http\Request;

class DegreeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $degree = Degree::with('programs')->filter(['search' => $search])->orderBy('id', 'desc')->paginate(10)->withQueryString()->through(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'program_name' => $item->programs[0]->name,
                'short_name' => $item->short_name,
            ];
        });

        return Inertia::render('Degree/Index', [
            'degree' => $degree,
            'searchTerm' => $search ?? '',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Degree/Create'); 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'nullable|string|max:255',
        ]);

        Degree::create($validated);

        return redirect()->route('degree.index')->with('success', 'Degree created successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Degree $degree)
    {
        return Inertia::render('Degree/Edit',[
            'degree'=> $degree,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Degree $degree)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_name' => 'nullable|string|max:255',
        ]);

        $degree->update($validated);

        return redirect()->route('degree.index')->with('success', 'Degree updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Degree $degree)
    {
        $degree->programs()->detach();
        $degree->delete();

        return redirect()->route('degree.index')->with('success', 'Degree Deleted successfully!');
    }

    public function mapping($id)
    {
        $degree = Degree::with(['programs:id,name'])->findOrFail($id);
        $programs = Program::select('id', 'name')->get();

        return Inertia::render('Degree/Mapping', [
            'degree' => $degree,
            'programs' => $programs,
        ]);
    }

    public function attachMapping(Request $request, $id)
    {
        $degree = Degree::findOrFail($id);

        $validated = $request->validate([
            'program_id' => 'nullable|integer|exists:programs,id',
        ]);

        $degree->programs()->sync($validated['program_id'] ? [$validated['program_id']] : []);

        return redirect()->route('degree.index', $degree->id)->with('success', 'Degree mapped successfully!');
    }
}
