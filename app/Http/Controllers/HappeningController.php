<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Pages;
use App\Models\School;
use App\Models\Happening;
use Illuminate\Http\Request;

class HappeningController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $today = Carbon::today();
        $search = $request->input('search');

        $happenings = Happening::filter(['search' => $search])
            ->orderBy('display_order', 'asc')
            ->paginate(10)
            ->withQueryString()
            ->through(function ($happening) use ($today) {
                return [
                    'id' => $happening->id,
                    'event_type' => $happening->event_type,
                    'upcoming_event' => $happening->event_date_from > $today ? true : false,
                    'title' => $happening->title,
                    'slug' => $happening->slug,
                    'alt_text' => $happening->alt_text,
                    'image' => $happening->image ? asset($happening->image) : asset('assets/img/placeholder.png'),
                    'banner_images' => $happening->banner_images ? asset($happening->banner_images) : asset('assets/img/placeholder.png'),
                    'pdf' => $happening->pdf ? asset($happening->pdf) : null,
                    'pdf_title' => $happening->pdf_title,
                    'video' => $happening->video,
                    'event_date_from' => $happening->event_date_from,
                    'event_date_to' => $happening->event_date_to,
                    'short_description' => $happening->short_description,
                    'description' => $happening->description,
                    'status' => $happening->status,
                    'display_order' => $happening->display_order,
                    'show_on_home' => $happening->show_on_home,
                ];
            });

        return Inertia::render('Happenings/Index', [
            'happenings' => $happenings,
            'searchTerm' => $search ?? '',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Happenings/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_type' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:happenings,slug',
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'alt_text' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'banner_images' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'pdf' => 'nullable|mimes:pdf|max:5120',
            'pdf_title' => 'nullable|string|max:255',
            'video' => 'nullable|string|max:255',
            'event_date_from' => 'required|date',
            'event_date_to' => 'required|date',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'display_order' => 'nullable|integer',
            'show_on_home' => 'nullable|integer|in:0,1',
            'status' => 'nullable|boolean',
        ]);

        // Handle file uploads
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/happenings/'), $imageName);
            $validated['image'] = 'assets/img/happenings/' . $imageName;
        }

        if ($request->hasFile('banner_images')) {
            $banner = $request->file('banner_images');
            $bannerName = time() . '_' . uniqid() . '.' . $banner->getClientOriginalExtension();
            $banner->move(public_path('assets/img/happenings/'), $bannerName);
            $validated['banner_images'] = 'assets/img/happenings/' . $bannerName;
        }

        if ($request->hasFile('pdf')) {
            $pdf = $request->file('pdf');
            $pdfName = time() . '_' . uniqid() . '.' . $pdf->getClientOriginalExtension();
            $pdf->move(public_path('assets/pdf/happenings/'), $pdfName);
            $validated['pdf'] = 'assets/pdf/happenings/' . $pdfName;
        }
        
        if (empty($validated['slug'])) {
            $validated['slug'] = \Str::slug($validated['title']);
        }

        Happening::create($validated);

        return redirect()->route('happening.index')->with('success', 'Happening created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Happening $happening)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Happening $happening)
    {
        return Inertia::render('Happenings/Edit',[
            'happening'=> $happening,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Happening $happening)
    {
        $validated = $request->validate([
            'event_type' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:happenings,slug,' . $happening->id,
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'alt_text' => 'nullable|string|max:255',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'pdf_title' => 'nullable|string|max:255',
            'video' => 'nullable|string|max:255',
            'event_date_from' => 'required|date',
            'event_date_to' => 'required|date',
            'display_order' => 'nullable|integer',
            'status' => 'boolean',
            'show_on_home' => 'nullable|integer|in:0,1',
        ]);

        if (empty($validated['slug']) && !empty($validated['title'])) {
            $validated['slug'] = \Str::slug($validated['title']);
        }

        // ===== Main Image =====
        if ($request->hasFile('image')) {
            $request->validate(['image' => 'image|mimes:jpg,jpeg,png,webp|max:2048']);
            if ($happening->image && file_exists(public_path($happening->image))) {
                unlink(public_path($happening->image));
            }
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/happenings/'), $imageName);
            $validated['image'] = 'assets/img/happenings/' . $imageName;
        } elseif ($request->has('remove_image') && $request->remove_image) {
            if ($happening->image && file_exists(public_path($happening->image))) {
                unlink(public_path($happening->image));
            }
            $validated['image'] = null;
        }

        // ===== Banner Image =====
        if ($request->hasFile('banner_images')) {
            $request->validate(['banner_images' => 'image|mimes:jpg,jpeg,png,webp|max:2048']);
            if ($happening->banner_images && file_exists(public_path($happening->banner_images))) {
                unlink(public_path($happening->banner_images));
            }
            $banner = $request->file('banner_images');
            $bannerName = time() . '_banner_' . uniqid() . '.' . $banner->getClientOriginalExtension();
            $banner->move(public_path('assets/img/happenings/'), $bannerName);
            $validated['banner_images'] = 'assets/img/happenings/' . $bannerName;
        } elseif ($request->has('remove_banner') && $request->remove_banner) {
            if ($happening->banner_images && file_exists(public_path($happening->banner_images))) {
                unlink(public_path($happening->banner_images));
            }
            $validated['banner_images'] = null;
        }

        // ===== PDF =====
        if ($request->hasFile('pdf')) {
            $request->validate(['pdf' => 'mimes:pdf|max:2048']);
            if ($happening->pdf && file_exists(public_path($happening->pdf))) {
                unlink(public_path($happening->pdf));
            }
            $pdf = $request->file('pdf');
            $pdfName = time() . '_pdf_' . uniqid() . '.' . $pdf->getClientOriginalExtension();
            $pdf->move(public_path('assets/pdf/happenings/'), $pdfName);
            $validated['pdf'] = 'assets/pdf/happenings/' . $pdfName;
        } elseif ($request->has('remove_pdf') && $request->remove_pdf) {
            if ($happening->pdf && file_exists(public_path($happening->pdf))) {
                unlink(public_path($happening->pdf));
            }
            $validated['pdf'] = null;
        }

        $happening->update($validated);

        return redirect()->route('happening.index')->with('success', 'Happening updated successfully!');
    }


/**
 * Remove the specified resource from storage.
 */
    public function destroy(Happening $happening)
    {
        if ($happening->image && file_exists(public_path($happening->image))) {
            @unlink(public_path($happening->image));
        }

        if ($happening->banner_images && file_exists(public_path($happening->banner_images))) {
            @unlink(public_path($happening->banner_images));
        }

        if ($happening->pdf && file_exists(public_path($happening->pdf))) {
            @unlink(public_path($happening->pdf));
        }

        $happening->delete();

        return redirect()->route('happening.index')->with('success', 'Happening deleted successfully!');
    }

    public function toggleStatus($id)
    {
        $happening = Happening::findOrFail($id);
        $happening->status = !$happening->status;
        $happening->save();

        return redirect()->route('happening.index')->with('success', 'Happening Status Updated!');
    }

    public function mapping($id)
    {
        $happening = Happening::with(['schools:id,name', 'pages:id,title'])->findOrFail($id);
        $schools = School::select('id', 'name')->get();
        $pages = Pages::select('id', 'title')->get();

        return Inertia::render('Happenings/Mapping', [
            'happening' => $happening,
            'schools' => $schools,
            'pages' => $pages,
        ]);
    }

    /**
     * Attach selected schools and pages to a Happening.
     */
    public function attachMapping(Request $request, $id)
    {
        $happening = Happening::findOrFail($id);

        $validated = $request->validate([
            'school_ids' => 'nullable|array',
            'school_ids.*' => 'exists:schools,id',
            'page_ids' => 'nullable|array',
            'page_ids.*' => 'exists:pages,id',
            'show_on_home' =>'nullable',
        ]);

        $happening->show_on_home = $request->show_on_home;
        $happening->save();
        $happening->schools()->sync($validated['school_ids'] ?? []);
        $happening->pages()->sync($validated['page_ids'] ?? []);

        return redirect()->route('happening.mapping', $happening->id)->with('success', 'Happening mapped successfully!');
    }
}
