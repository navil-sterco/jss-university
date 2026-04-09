<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Pages;
use App\Models\Program;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Str;

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
            'alternate_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
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
        if ($request->hasFile('alternate_image')) {
            $image = $request->file('alternate_image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/program/'), $imageName);

            $validated['alternate_image'] = 'assets/img/program/' . $imageName;
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
        if ($request->hasFile('alternate_image')) {
            $request->validate([
                'alternate_image' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            if (!empty($program->alternate_image) && file_exists(public_path($program->alternate_image))) {
                unlink(public_path($program->alternate_image));
            }

            $image = $request->file('alternate_image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/program/'), $imageName);
            $validated['alternate_image'] = 'assets/img/program/' . $imageName;
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

    public function mapping($id)
    {
        $programs = Program::with(['schools:id,name', 'pages:id,title', 'departments:id,name'])->findOrFail($id);
        $schools = School::select('id', 'name')->get();
        $pages = Pages::select('id', 'title')->get();
        $departments = Department::with('school:id,name')->get()->map(function ($department) {
            return [
                'id' => $department->id,
                'name' => $department->name,
                'school' => $department->school ? $department->school->name : null,
            ];
        });

        return Inertia::render('Programs/Mapping', [
            'programs' => $programs,
            'schools' => $schools,
            'pages' => $pages,
            'departments' => $departments,
        ]);
    }

    public function attachMapping(Request $request, $id)
    {
        $courses = Program::findOrFail($id);

        $validated = $request->validate([
            'school_ids' => 'nullable|array',
            'school_ids.*' => 'exists:schools,id',
            'page_ids' => 'nullable|array',
            'page_ids.*' => 'exists:pages,id',
            'department_ids' => 'nullable|array',
            'department_ids.*' => 'exists:departments,id',
        ]);

        $courses->schools()->sync($validated['school_ids'] ?? []);
        $courses->pages()->sync($validated['page_ids'] ?? []);
        $courses->departments()->sync($validated['department_ids'] ?? []);

        return redirect()->route('program.index', $courses->id)->with('success', 'Program mapped successfully!');
    }
}
