<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pages;
use App\Models\Banner;
use App\Models\School;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $banners = Banner::filter(['search' => $search])->orderBy('display_order', 'asc')->paginate(10)->withQueryString()->through(function ($banner) {
            return [
                'id' => $banner->id,
                'heading' => $banner->heading,
                'subheading' => $banner->subheading,
                'link' => asset($banner->link),
                'linked_text' => $banner->linked_text,
                'image' => $banner->image ? asset($banner->image) : asset('assets/img/placeholder.png'),
                'mobile_image' => $banner->mobile_image ? asset($banner->mobile_image) : asset('assets/img/placeholder.png'),
                'status' => $banner->status,
                'show_on_home' => $banner->show_on_home,
                'display_order' => $banner->display_order,
            ];
        });

        return Inertia::render('Banners/Index', [
            'banners' => $banners,
            'searchTerm' => $search ?? '',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Banners/Create'); 
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'heading' => 'required|string|max:255',
            'subheading' => 'nullable|string|max:255',
            'linked_text' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'mobile_image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'display_order' => 'nullable|integer',
            'show_on_home' => 'nullable|integer|in:0,1',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/banners/'), $imageName);

            $validated['image'] = 'assets/img/banners/' . $imageName;
        }
        
        if ($request->hasFile('mobile_image')) {
            $imageMobile = $request->file('mobile_image');
            $imageNameMobile = time() . '_' . uniqid() . '.' . $imageMobile->getClientOriginalExtension();
            $imageMobile->move(public_path('assets/img/banners/'), $imageNameMobile);

            $validated['mobile_image'] = 'assets/img/banners/' . $imageNameMobile;
        }

        Banner::create($validated);

        return redirect()->route('banners.index')->with('success', 'Banner created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Banner $banner)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Banner $banner)
    {
        return Inertia::render('Banners/Edit',[
            'banner'=> $banner,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'heading' => 'required|string|max:255',
            'subheading' => 'nullable|string|max:255',
            'linked_text' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'display_order' => 'nullable|integer',
            'show_on_home' => 'nullable|integer|in:0,1',
        ]);

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            if (!empty($banner->image) && file_exists(public_path($banner->image))) {
                unlink(public_path($banner->image));
            }

            // Upload new image
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/banners/'), $imageName);

            $validated['image'] = 'assets/img/banners/' . $imageName;
        }

        if ($request->hasFile('mobile_image')) {
            $request->validate([
                'mobile_image' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            if (!empty($banner->mobile_image) && file_exists(public_path($banner->mobile_image))) {
                unlink(public_path($banner->mobile_image));
            }

            // Upload new image
            $mobileImage = $request->file('mobile_image');
            $imageNameMobile = time() . '_' . uniqid() . '.' . $mobileImage->getClientOriginalExtension();
            $mobileImage->move(public_path('assets/img/banners/'), $imageNameMobile);

            $validated['mobile_image'] = 'assets/img/banners/' . $imageNameMobile;
        }

        $banner->update($validated);

        return redirect()->route('banners.index')->with('success', 'Banner updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Banner $banner)
    {
        if ($banner->image && file_exists(public_path($banner->image))) {
            @unlink(public_path($banner->image));
        }

        $banner->schools()->detach();
        $banner->pages()->detach();

        $banner->delete();

        return redirect()->route('banners.index')->with('success', 'Banner Deleted successfully!');
    }

    public function toggleStatus($id)
    {
        $banner = Banner::findOrFail($id);
        $banner->status = !$banner->status;
        $banner->save();

        return redirect()->route('banners.index')->with('success', 'Banner Status Updated');
    }

    public function mapping($id)
    {
        $banner = Banner::with(['schools:id,name', 'pages:id,title'])->findOrFail($id);
        $schools = School::select('id', 'name')->get();
        $pages = Pages::select('id', 'title')->get();

        return Inertia::render('Banners/Mapping', [
            'banner' => $banner,
            'schools' => $schools,
            'pages' => $pages,
        ]);
    }

    public function attachMapping(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $validated = $request->validate([
            'school_ids' => 'nullable|array',
            'school_ids.*' => 'exists:schools,id',
            'page_ids' => 'nullable|array',
            'page_ids.*' => 'exists:pages,id',
            'show_on_home' =>'nullable',
        ]);

        $banner->show_on_home = $request->show_on_home;
        $banner->save();
        $banner->schools()->sync($validated['school_ids'] ?? []);
        $banner->pages()->sync($validated['page_ids'] ?? []);

        return redirect()->route('banner.mapping', $banner->id)->with('success', 'Banner mapped successfully!');
    }
}
