<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pages;
use App\Models\Footer;
use App\Models\School;
use App\Models\Department;
use Illuminate\Http\Request;

class FooterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $footerConfig = Footer::getConfiguration();
        $schools = School::select('id','name')->get();
        $departments = Department::select('id','name')->get();
        $pages = Pages::select('id','title')->get();

        return Inertia::render('Footer/Index', [
            'schools' => $schools,
            'departments' => $departments,
            'pages' => $pages,
            'footerConfig' => $footerConfig,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Footer $footer)
    {
        $validated = $request->validate([
            'navigation_items' => 'nullable|array',
            'navigation_items.*.id' => 'required',
            'navigation_items.*.type' => 'required|in:school,department,page',
            'navigation_items.*.item_id' => 'required|integer',
            'navigation_items.*.display_order' => 'required|integer',
            'navigation_items.*.name' => 'required|string',
            
            'quick_links' => 'nullable|array',
            'quick_links.*.id' => 'required',
            'quick_links.*.text' => 'required|string',
            'quick_links.*.link' => 'required|url',
            'quick_links.*.display_order' => 'required|integer',
        ]);

        $footerConfig = Footer::first();

        if ($footerConfig) {
            $footerConfig->update($validated);
        } else {
            Footer::create($validated);
        }

        return redirect()->route('footer.index')->with('success', 'Footer configuration mapped successfully!');
    }

    public function destroy()
    {
        $footerConfig = Footer::first();

        if ($footerConfig) {
            $footerConfig->delete();
            return redirect()->back()->with('success', 'Footer configuration deleted successfully.');
        }

        return redirect()->back()->with('error', 'No footer configuration found to delete.');
    }
}
