<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pages;
use App\Models\Banner;
use App\Models\PageSection;
use App\Models\Testimonial;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

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
        return Inertia::render('Pages/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:pages,slug',
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'sub_title' => 'nullable|string|max:255',
            'target_blank' => 'required|boolean',
            'publish_date' => 'required|date',
        ]);

        if (empty($validated['slug'])) {
            $slug = Str::slug($validated['title']);

            $originalSlug = $slug;
            $count = 1;
            while (Pages::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }

            $validated['slug'] = $slug;
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
        return Inertia::render('Pages/Edit',[
            'page'=> $page,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pages $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:happenings,slug,' . $page->id,
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'sub_title' => 'nullable|string|max:255',
            'target_blank' => 'required|boolean',
            'publish_date' => 'required|date',
        ]);

        if (empty($validated['slug'])) {
            $slug = Str::slug($validated['title']);
            $originalSlug = $slug;
            $count = 1;
            while (\App\Models\Pages::where('slug', $slug)->where('id', '!=', $page->id)->exists()) {
                $slug = $originalSlug . '-' . $count++;
            }

            $validated['slug'] = $slug;
        }

        $page->update($validated);

        return redirect()->route('pages.index')->with('success', 'Page updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pages $page)
    {
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
        $newPage = $page->replicate();
        $newPage->title = $page->title . ' (Copy)';
        $newPage->slug = $page->slug . '-copy';

        while (Pages::where('slug', $newPage->slug)->exists()) {
            $newPage->slug .= '-' . rand(100, 999);
        }

        $newPage->save();

        return redirect()->route('pages.index')->with('success', 'Page duplicated successfully.');
    }
}
