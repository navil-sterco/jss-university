<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pages;
use App\Models\Banner;
use App\Models\Course;
use App\Models\School;
use App\Models\Department;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $banners = Banner::with(['schools', 'pages', 'departments', 'courses'])
            ->filter(['search' => $search])
            ->orderBy('display_order', 'asc')
            ->paginate(10)
            ->withQueryString()
            ->through(function ($banner) {
                // Determine what the banner is mapped to
                $mappedTo = $this->getBannerMapping($banner);
                
                return [
                    'id' => $banner->id,
                    'heading' => $banner->heading,
                    'subheading' => $banner->subheading,
                    'link' => $banner->link ? asset($banner->link) : '',
                    'linked_text' => $banner->linked_text,
                    'image' => $banner->image ? asset($banner->image) : '',
                    'mobile_image' => $banner->mobile_image ? asset($banner->mobile_image) : '',
                    'video_desktop' => $banner->video_desktop ? asset($banner->video_desktop) : '',
                    'video_mobile' => $banner->video_mobile ? asset($banner->video_mobile) : '',
                    'video_url' => $banner->video_url,
                    'status' => $banner->status,
                    'show_on_home' => $banner->show_on_home,
                    'display_order' => $banner->display_order,
                    'banner_shown_on' => $mappedTo,
                ];
            });

        return Inertia::render('Banners/Index', [
            'banners' => $banners,
            'searchTerm' => $search ?? '',
        ]);
    }

    private function getBannerMapping($banner)
    {
        // Check schools first
        if ($banner->schools->isNotEmpty()) {
            $school = $banner->schools->first();
            return "school-{$school->name}";
        }
        
        // Check pages
        if ($banner->pages->isNotEmpty()) {
            $page = $banner->pages->first();
            return "page-{$page->title}";
        }
        
        // Check departments
        if ($banner->departments->isNotEmpty()) {
            $department = $banner->departments->first();
            return "department-{$department->name}";
        }
        
        // Check courses
        if ($banner->courses->isNotEmpty()) {
            $course = $banner->courses->first();
            return "course-{$course->name}";
        }
        
        // If nothing is mapped
        return "Not Mapped";
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
            'image' => 'required_without_all:video_desktop,video_mobile,video_url|nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'mobile_image' => 'required_without_all:video_desktop,video_mobile,video_url|nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'video_desktop' => 'nullable|mimes:mp4,webm,ogg|max:51200',
            'video_mobile' => 'nullable|mimes:mp4,webm,ogg|max:51200',
            'video_url' => 'nullable|url|max:500',
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

        if ($request->hasFile('video_desktop')) {
            $videoDesktop = $request->file('video_desktop');
            $videoNameDesktop = time() . '_' . uniqid() . '.' . $videoDesktop->getClientOriginalExtension();
            $videoDesktop->move(public_path('assets/video/banners/'), $videoNameDesktop);
            $validated['video_desktop'] = 'assets/video/banners/' . $videoNameDesktop;
        }

        if ($request->hasFile('video_mobile')) {
            $videoMobile = $request->file('video_mobile');
            $videoNameMobile = time() . '_' . uniqid() . '.' . $videoMobile->getClientOriginalExtension();
            $videoMobile->move(public_path('assets/video/banners/'), $videoNameMobile);
            $validated['video_mobile'] = 'assets/video/banners/' . $videoNameMobile;
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
            'video_url' => 'nullable|url|max:500',
            'display_order' => 'nullable|integer',
            'show_on_home' => 'nullable|integer|in:0,1',
        ]);

        if ($request->input('image') === 'null') {
            if (!empty($banner->image) && file_exists(public_path($banner->image))) {
                @unlink(public_path($banner->image));
            }
            $validated['image'] = null;
        } elseif ($request->hasFile('image')) {
            $request->validate([
                'image' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            if (!empty($banner->image) && file_exists(public_path($banner->image))) {
                @unlink(public_path($banner->image));
            }

            // Upload new image
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/banners/'), $imageName);

            $validated['image'] = 'assets/img/banners/' . $imageName;
        }

        if ($request->input('mobile_image') === 'null') {
            if (!empty($banner->mobile_image) && file_exists(public_path($banner->mobile_image))) {
                @unlink(public_path($banner->mobile_image));
            }
            $validated['mobile_image'] = null;
        } elseif ($request->hasFile('mobile_image')) {
            $request->validate([
                'mobile_image' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            if (!empty($banner->mobile_image) && file_exists(public_path($banner->mobile_image))) {
                @unlink(public_path($banner->mobile_image));
            }

            // Upload new image
            $mobileImage = $request->file('mobile_image');
            $imageNameMobile = time() . '_' . uniqid() . '.' . $mobileImage->getClientOriginalExtension();
            $mobileImage->move(public_path('assets/img/banners/'), $imageNameMobile);

            $validated['mobile_image'] = 'assets/img/banners/' . $imageNameMobile;
        }

        if ($request->input('video_desktop') === 'null') {
            if (!empty($banner->video_desktop) && file_exists(public_path($banner->video_desktop))) {
                @unlink(public_path($banner->video_desktop));
            }
            $validated['video_desktop'] = null;
        } elseif ($request->hasFile('video_desktop')) {
            $request->validate([
                'video_desktop' => 'mimes:mp4,webm,ogg|max:51200',
            ]);

            if (!empty($banner->video_desktop) && file_exists(public_path($banner->video_desktop))) {
                @unlink(public_path($banner->video_desktop));
            }

            $videoDesktop = $request->file('video_desktop');
            $videoNameDesktop = time() . '_' . uniqid() . '.' . $videoDesktop->getClientOriginalExtension();
            $videoDesktop->move(public_path('assets/video/banners/'), $videoNameDesktop);
            $validated['video_desktop'] = 'assets/video/banners/' . $videoNameDesktop;
        }

        if ($request->input('video_mobile') === 'null') {
            if (!empty($banner->video_mobile) && file_exists(public_path($banner->video_mobile))) {
                @unlink(public_path($banner->video_mobile));
            }
            $validated['video_mobile'] = null;
        } elseif ($request->hasFile('video_mobile')) {
            $request->validate([
                'video_mobile' => 'mimes:mp4,webm,ogg|max:51200',
            ]);

            if (!empty($banner->video_mobile) && file_exists(public_path($banner->video_mobile))) {
                @unlink(public_path($banner->video_mobile));
            }

            $videoMobile = $request->file('video_mobile');
            $videoNameMobile = time() . '_' . uniqid() . '.' . $videoMobile->getClientOriginalExtension();
            $videoMobile->move(public_path('assets/video/banners/'), $videoNameMobile);
            $validated['video_mobile'] = 'assets/video/banners/' . $videoNameMobile;
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
        if ($banner->mobile_image && file_exists(public_path($banner->mobile_image))) {
            @unlink(public_path($banner->mobile_image));
        }
        if ($banner->video_desktop && file_exists(public_path($banner->video_desktop))) {
            @unlink(public_path($banner->video_desktop));
        }
        if ($banner->video_mobile && file_exists(public_path($banner->video_mobile))) {
            @unlink(public_path($banner->video_mobile));
        }

        $banner->schools()->detach();
        $banner->pages()->detach();
        $banner->departments()->detach();
        $banner->courses()->detach();

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
        $banner = Banner::with(['schools:id,name', 'pages:id,title', 'departments:id,name', 'courses:id,name'])->findOrFail($id);
        $schools = School::select('id', 'name')->get();
        $pages = Pages::select('id', 'title')->get();
        $departments = Department::with('school:id,name')->get()->map(function ($department) {
            return [
                'id' => $department->id,
                'name' => $department->name,
                'school' => $department->school ? $department->school->name : null,
            ];
        });
        $courses = Course::select('id', 'name')->get();

        return Inertia::render('Banners/Mapping', [
            'banner' => $banner,
            'schools' => $schools,
            'pages' => $pages,
            'departments' => $departments,
            'courses' => $courses,
        ]);
    }

    public function attachMapping(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $validated = $request->validate([
            'selected_id' => 'nullable|integer',
            'selected_type' => 'nullable|string|in:school,page,department,course',
            'show_on_home' => 'boolean',
        ]);

        $banner->show_on_home = $request->show_on_home ?? false;
        $banner->save();

        $banner->schools()->detach();
        $banner->pages()->detach();
        $banner->departments()->detach();
        $banner->courses()->detach();

        if ($validated['selected_id'] && $validated['selected_type']) {
            switch ($validated['selected_type']) {
                case 'school':
                    $banner->schools()->attach($validated['selected_id']);
                    break;
                case 'page':
                    $banner->pages()->attach($validated['selected_id']);
                    break;
                case 'department':
                    $banner->departments()->attach($validated['selected_id']);
                    break;
                case 'course':
                    $banner->courses()->attach($validated['selected_id']);
                    break;
            }
        }

        return redirect()->route('banners.index')->with('success', 'Banner mapped successfully!');
    }
}
