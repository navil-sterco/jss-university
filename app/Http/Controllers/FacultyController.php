<?php

namespace App\Http\Controllers;

use App\Models\Type;
use Inertia\Inertia;
use App\Models\Faculty;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $faculty = Faculty::with('type')->filter(['search' => $search])->orderBy('display_order', 'asc')->paginate(10)->withQueryString()->through(function ($faculty) {
            return [
                'id' => $faculty->id,
                'name' => $faculty->name,
                'email' => $faculty->email,
                'profile' => $faculty->profile,
                'image' => $faculty->image ? asset($faculty->image) : asset('assets/img/placeholder.png'),
                'linkedin_url' => $faculty->linkedin_url,
                'type' => $faculty->type->name ?? 'N/A',
                'type_id' => $faculty->type_id,
                'education' => $faculty->education,
                'research' => $faculty->research,
                'teaching' => $faculty->teaching,
                'award' => $faculty->award,
                'social_engagement' => $faculty->social_engagement,
                'display_order' => $faculty->display_order,
                'status' => $faculty->status,
                'created_at' => $faculty->created_at->format('M d, Y'),
                'updated_at' => $faculty->updated_at->format('M d, Y'),
            ];
        });

        return Inertia::render('Faculties/Index', [
            'faculty' => $faculty,
            'searchTerm' => $search ?? '',
        ]);
    }

    public function create()
    {
        return Inertia::render('Faculties/Create', [
            'types' => Type::where('element', 'faculty')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type_id' => 'required|exists:types,id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:faculties,email',
            'profile' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'linkedin_url' => 'nullable|url|max:255',
            'education' => 'nullable|array',
            'education.*' => 'nullable|string|max:500',
            'research' => 'nullable|array',
            'research.*' => 'nullable|string|max:500',
            'teaching' => 'nullable|array',
            'teaching.*' => 'nullable|string|max:500',
            'award' => 'nullable|array',
            'award.*' => 'nullable|string|max:500',
            'social_engagement' => 'nullable|array',
            'social_engagement.*' => 'nullable|string|max:500',
            'display_order' => 'nullable|integer',
            'status' => 'nullable|boolean',
        ]);

        $validated['education'] = array_filter($validated['education'] ?? []);
        $validated['research'] = array_filter($validated['research'] ?? []);
        $validated['teaching'] = array_filter($validated['teaching'] ?? []);
        $validated['award'] = array_filter($validated['award'] ?? []);
        $validated['social_engagement'] = array_filter($validated['social_engagement'] ?? []);
        $validated['status'] = $validated['status'] ?? true;

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/faculty/'), $imageName);
            $validated['image'] = 'assets/img/faculty/' . $imageName;
        }

        Faculty::create($validated);

        return redirect()->route('faculty.index')->with('success', 'Faculty/Staff created successfully!');
    }

    public function edit(Faculty $faculty)
    {
        $types = Type::where('element', 'faculty')->get();
        
        return Inertia::render('Faculties/Edit', [
            'faculty' => $faculty,
            'types' => $types,
        ]);
    }

    public function update(Request $request, Faculty $faculty)
    {
        $validated = $request->validate([
            'type_id' => 'required|exists:types,id',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:faculties,email,' . $faculty->id,
            'profile' => 'nullable|string',
            'linkedin_url' => 'nullable|url|max:255',
            'education' => 'nullable|array',
            'education.*' => 'nullable|string|max:500',
            'research' => 'nullable|array',
            'research.*' => 'nullable|string|max:500',
            'teaching' => 'nullable|array',
            'teaching.*' => 'nullable|string|max:500',
            'award' => 'nullable|array',
            'award.*' => 'nullable|string|max:500',
            'social_engagement' => 'nullable|array',
            'social_engagement.*' => 'nullable|string|max:500',
            'display_order' => 'nullable|integer',
            'status' => 'nullable|boolean',
        ]);

        $validated['education'] = array_filter($validated['education'] ?? []);
        $validated['research'] = array_filter($validated['research'] ?? []);
        $validated['teaching'] = array_filter($validated['teaching'] ?? []);
        $validated['award'] = array_filter($validated['award'] ?? []);
        $validated['social_engagement'] = array_filter($validated['social_engagement'] ?? []);
        $validated['status'] = $validated['status'] ?? true;

        if ($request->hasFile('image')) {

            $request->validate([
                'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            if ($faculty->image && file_exists(public_path($faculty->image))) {
                unlink(public_path($faculty->image));
            }

            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/faculty/'), $imageName);
            $validated['image'] = 'assets/img/faculty/' . $imageName;
        }

        $faculty->update($validated);

        return redirect()->route('faculty.index')->with('success', 'Faculty/Staff updated successfully!');
    }

    public function destroy(Faculty $faculty)
    {
        if ($faculty->image && file_exists(public_path($faculty->image))) {
            unlink(public_path($faculty->image));
        }

        $faculty->delete();

        return redirect()->route('faculty.index')->with('success', 'Faculty/Staff deleted successfully!');
    }

    public function toggleStatus($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->status = !$faculty->status;
        $faculty->save();

        return redirect()->route('faculty.index')->with('success', 'Faculty Status Updated!');
    }
}
