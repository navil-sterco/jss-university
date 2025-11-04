<?php

namespace App\Http\Controllers;

use Str;
use Inertia\Inertia;
use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
        $search = $request->input('search');

        $programs = Program::filter(['search' => $search])->orderBy('display_order', 'asc')->paginate(10)->withQueryString()->through(function ($program) {
            return [
                'id' => $program->id,
                'name' => $program->name,
                'menu_name' => $program->menu_name,
                'image' => $program->image ? asset($program->image) : asset('assets/img/placeholder.png'),
                'name_short' => $program->name_short,
                'slug' => $program->slug,
                'display_order' => $program->display_order,
                'status' => $program->status,
                'title' => $program->title,
                'description' => $program->description,
            ];
        });

        return Inertia::render('Programs/Index', [
            'programs' => $programs,
            'searchTerm' => $search ?? '',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Programs/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'menu_name' => 'nullable|string|max:255',
            'name_short' => 'nullable|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:programs,slug',
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'title' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'description' => 'nullable|string',
            'status' => 'nullable|integer|in:0,1',
            'display_order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);

            if (Program::where('slug', $validated['slug'])->exists()) {
                return back()
                    ->withErrors(['slug' => 'The generated slug already exists. Please enter a unique slug.'])
                    ->withInput();
            }
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/program/'), $imageName);

            $validated['image'] = 'assets/img/program/' . $imageName;
        }

        Program::create($validated);

        return redirect()->route('program.index')->with('success', 'Program created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Program $program)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Program $program)
    {
        return Inertia::render('Programs/Edit',[
            'program'=> $program,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'menu_name' => 'nullable|string|max:255',
            'name_short' => 'nullable|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:programs,slug,' . $program->id,
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|integer|in:0,1',
            'display_order' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);

            $exists = Program::where('slug', $validated['slug'])
                ->where('id', '!=', $program->id)
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

            if (!empty($program->image) && file_exists(public_path($program->image))) {
                unlink(public_path($program->image));
            }

            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/program/'), $imageName);
            $validated['image'] = 'assets/img/program/' . $imageName;
        }

        $program->update($validated);

        return redirect()->route('program.index')->with('success', 'Program updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Program $program)
    {
        if ($program->image && file_exists(public_path($program->image))) {
            @unlink(public_path($program->image));
        }
        
        $program->delete();

        return redirect()->route('program.index')->with('success', 'Program deleted successfully!');
    }

    public function toggleStatus($id)
    {
        $program = Program::findOrFail($id);
        $program->status = !$program->status;
        $program->save();

        return redirect()->route('program.index')->with('success', 'Program Status Updated!');
    }
}
