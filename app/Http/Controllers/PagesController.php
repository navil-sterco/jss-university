<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pages;
use App\Models\Banner;
use App\Models\Department;
use App\Models\PageSection;
use App\Models\Testimonial;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class PagesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $pages = Pages::filter(['search' => $search])->orderBy('id', 'desc')->paginate(10)->withQueryString()->through(function ($page) {
            return [
                'id' => $page->id,
                'title' => $page->title,
                'type' => $page->type,
                'image' => $page->image ? asset($page->image) : asset('assets/img/placeholder.png'),
                'slug' => $page->slug,
                'target_blank' => $page->target_blank,
                'status' => $page->status,
                'display_order' => $page->display_order,
                'created_date' => $page->created_at->format('Y-m-d'),
            ];
        });

        return Inertia::render('Pages/Index', [
            'pages' => $pages,
            'searchTerm' => $search ?? '',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::select('id','name')->get();
        return Inertia::render('Pages/Create',[
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:pages,slug',
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'sub_title' => 'nullable|string|max:255',
            'target_blank' => 'required|boolean',
            'publish_date' => 'required|date',
            'department_id' => [
                'nullable',
                Rule::requiredIf(function () use ($request) {
                    return in_array($request->type, ['Laboratory', 'Facility']);
                }),
                'exists:departments,id'
            ],
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);

            if (Pages::where('slug', $validated['slug'])->exists()) {
                return back()
                    ->withErrors(['slug' => 'The generated slug already exists. Please enter a unique slug.'])
                    ->withInput();
            }
        }

        // Handle file uploads
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/pages/'), $imageName);
            $validated['image'] = 'assets/img/pages/' . $imageName;
        }

        Pages::create($validated);

        return redirect()->route('pages.index')->with('success', 'Page created successfully!');

    }

    /**
     * Display the specified resource.
     */
    public function show(Pages $pages)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pages $page)
    {
        $departments = Department::select('id','name')->get();
        return Inertia::render('Pages/Edit',[
            'page'=> $page,
            'departments' => $departments,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pages $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:pages,slug,' . $page->id,
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'sub_title' => 'nullable|string|max:255',
            'target_blank' => 'required|boolean',
            'publish_date' => 'required|date',
            'department_id' => [
                'nullable',
                Rule::requiredIf(function () use ($request) {
                    return in_array($request->type, ['Laboratory', 'Facility']);
                }),
                'exists:departments,id'
            ],
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);

            $exists = Pages::where('slug', $validated['slug'])
                ->where('id', '!=', $page->id)
                ->exists();

            if ($exists) {
                return back()
                    ->withErrors(['slug' => 'The generated slug already exists. Please enter a unique slug.'])
                    ->withInput();
            }
        }

        if ($request->hasFile('image')) {
            $request->validate(['image' => 'image|mimes:jpg,jpeg,png,webp|max:2048']);
            if ($page->image && file_exists(public_path($page->image))) {
                unlink(public_path($page->image));
            }
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/pages/'), $imageName);
            $validated['image'] = 'assets/img/pages/' . $imageName;
        } elseif ($request->has('remove_image') && $request->remove_image) {
            if ($page->image && file_exists(public_path($page->image))) {
                unlink(public_path($page->image));
            }
            $validated['image'] = null;
        }


        $page->update($validated);

        return redirect()->route('pages.index')->with('success', 'Page updated successfully!');
    }

    public function destroy(Pages $page)
    {
        if ($page->image && file_exists(public_path($page->image))) {
            @unlink(public_path($page->image));
        }

        $page->sections()->delete();
        $page->delete();

        return redirect()->route('pages.index')->with('warning', 'Page deleted successfully!');
    }


    public function toggleStatus($id)
    {
        $page = Pages::findOrFail($id);
        $page->status = !$page->status;
        $page->save();

        return redirect()->back()->with('success', 'Status updated.');
    }

    public function duplicate(Pages $page)
    {
        try {
            DB::beginTransaction();

            $newPage = $page->replicate();
            $newPage->title = $page->title . ' (Copy)';
            $newPage->slug = $page->slug . '-copy';

            while (Pages::where('slug', $newPage->slug)->exists()) {
                $newPage->slug .= '-' . rand(100, 999);
            }
            
            

            $newPage->save();
            if ($page->sections) {
                foreach ($page->sections as $section) {
                    $newSection = $section->replicate();
                    $newSection->page_id = $newPage->id;
                
                    $newSection->save();
                }
            }

            DB::commit();

            return redirect()->route('pages.index')->with('success', 'Page duplicated successfully with all sections.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Page duplication failed: ' . $e->getMessage());
            return redirect()->route('pages.index')->with('error', 'Failed to duplicate page sections Please try again.');
        }
    }
}
