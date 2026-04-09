<?php

namespace App\Http\Controllers;

use App\Models\Type;
use App\Models\LeadershipCategory;
use Inertia\Inertia;
use App\Models\Pages;
use App\Models\Course;
use App\Models\School;
use App\Models\Department;
use App\Models\Leadership;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class LeadershipController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $leadership = Leadership::with(['type', 'category'])->filter(['search' => $search])->orderBy('display_order', 'asc')->paginate(10)->withQueryString()->through(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'slug' => $item->slug,
                'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                'banner_image' => $item->banner_image ? asset($item->banner_image) : asset('assets/img/placeholder.png'),
                'video' => $item->video,
                'message_image' => $item->message_image ? asset($item->message_image) : asset('assets/img/placeholder.png'),
                'type' => $item->type->name ?? 'N/A',
                'type_id' => $item->type_id,
                'category' => $item->category->name ?? 'N/A',
                'category_id' => $item->category_id,
                'short_description' => $item->short_description,
                'description' => $item->description,
                'biography' => $item->biography,
                'message' => $item->message,
                'page_type' => $item->page_type,
                'display_order' => $item->display_order,
                'status' => $item->status,
                'created_at' => $item->created_at->format('M d, Y'),
                'updated_at' => $item->updated_at->format('M d, Y'),
            ];
        });

        return Inertia::render('Leaderships/Index', [
            'leadership' => $leadership,
            'searchTerm' => $search ?? '',
        ]);
    }

    public function create()
    {
        return Inertia::render('Leaderships/Create', [
            'types' => Type::where('element', 'leadership')->get(),
            'categories' => LeadershipCategory::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type_id' => 'required|exists:types,id',
            'page_type' => 'required',
            'category_id' => 'nullable|exists:leadership_categories,id',
            'name' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:leaderships,slug',
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'short_description' => 'nullable|string',
            'description' => 'nullable|array',
            'description.*' => 'nullable|string',
            'biography' => 'nullable|string',
            'banner_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'video' => 'nullable|file|mimes:mp4,avi,mov,webm|max:2048',
            'message' => 'nullable|array',
            'message.*' => 'nullable|string',
            'message_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'status' => 'nullable|boolean',
            'display_order' => 'nullable|integer|min:0',
        ]);


        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);

            if (Leadership::where('slug', $validated['slug'])->exists()) {
                return back()
                    ->withErrors(['slug' => 'The generated slug already exists. Please enter a unique slug.'])
                    ->withInput();
            }
        }

        $validated['description'] = array_filter($validated['description'] ?? []);
        $validated['message'] = array_filter($validated['message'] ?? []);

        if ($request->hasFile('banner_image')) {
            $bannerImage = $request->file('banner_image');
            $bannerImageName = time() . '_banner_' . uniqid() . '.' . $bannerImage->getClientOriginalExtension();
            $bannerImage->move(public_path('assets/img/leadership/'), $bannerImageName);
            $validated['banner_image'] = 'assets/img/leadership/' . $bannerImageName;
        }

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/leadership/'), $imageName);
            $validated['image'] = 'assets/img/leadership/' . $imageName;
        }

        if ($request->hasFile('video')) {
            $video = $request->file('video');
            $videoName = time() . '_video_' . uniqid() . '.' . $video->getClientOriginalExtension();
            $video->move(public_path('assets/videos/leadership/'), $videoName);
            $validated['video'] = 'assets/videos/leadership/' . $videoName;
        }

        if ($request->hasFile('message_image')) {
            $messageImage = $request->file('message_image');
            $messageImageName = time() . '_message_' . uniqid() . '.' . $messageImage->getClientOriginalExtension();
            $messageImage->move(public_path('assets/img/leadership/'), $messageImageName);
            $validated['message_image'] = 'assets/img/leadership/' . $messageImageName;
        }

        Leadership::create($validated);

        return redirect()->route('leadership.index')->with('success', 'Leadership member created successfully!');
    }

    public function edit(Leadership $leadership)
    {
        $types = Type::where('element', 'leadership')->get();
        $categories = LeadershipCategory::all();
        
        return Inertia::render('Leaderships/Edit', [
            'leadership' => $leadership,
            'types' => $types,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Leadership $leadership)
    {
        $validated = $request->validate([
            'type_id' => 'required|exists:types,id',
            'page_type' => 'required',
            'category_id' => 'nullable|exists:leadership_categories,id',
            'name' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:leaderships,slug,' . $leadership->id,
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'short_description' => 'nullable|string',
            'description' => 'nullable|array',
            'description.*' => 'nullable|string',
            'biography' => 'nullable|string',
            'message' => 'nullable|array',
            'message.*' => 'nullable|string',
            'status' => 'nullable|boolean',
            'display_order' => 'nullable|integer|min:0',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);

            $exists = Leadership::where('slug', $validated['slug'])
                ->where('id', '!=', $leadership->id)
                ->exists();

            if ($exists) {
                return back()
                    ->withErrors(['slug' => 'The generated slug already exists. Please enter a unique slug.'])
                    ->withInput();
            }
        }

        $validated['description'] = array_filter($validated['description'] ?? []);
        $validated['message'] = array_filter($validated['message'] ?? []);

        if ($request->hasFile('banner_image')) {
            $request->validate([
                'banner_image' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);

            if ($leadership->banner_image && file_exists(public_path($leadership->banner_image))) {
                unlink(public_path($leadership->banner_image));
            }
            
            $bannerImage = $request->file('banner_image');
            $bannerImageName = time() . '_banner_' . uniqid() . '.' . $bannerImage->getClientOriginalExtension();
            $bannerImage->move(public_path('assets/img/leadership/'), $bannerImageName);
            $validated['banner_image'] = 'assets/img/leadership/' . $bannerImageName;
        }

        if ($request->hasFile('image')) {
             $request->validate([
                'image' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);
            
            if ($leadership->image && file_exists(public_path($leadership->image))) {
                unlink(public_path($leadership->image));
            }
            
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/leadership/'), $imageName);
            $validated['image'] = 'assets/img/leadership/' . $imageName;
        }

        if ($request->hasFile('video')) {
             $request->validate([
                'video' => 'file|mimes:mp4,avi,mov|max:10240',
            ]);
            
            if ($leadership->video && file_exists(public_path($leadership->video))) {
                unlink(public_path($leadership->video));
            }
            
            $video = $request->file('video');
            $videoName = time() . '_video_' . uniqid() . '.' . $video->getClientOriginalExtension();
            $video->move(public_path('assets/videos/leadership/'), $videoName);
            $validated['video'] = 'assets/videos/leadership/' . $videoName;
        }

        if ($request->hasFile('message_image')) {
             $request->validate([
                'message_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            ]);
            
            if ($leadership->message_image && file_exists(public_path($leadership->message_image))) {
                unlink(public_path($leadership->message_image));
            }
            
            $image = $request->file('message_image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/leadership/'), $imageName);
            $validated['message_image'] = 'assets/img/leadership/' . $imageName;
        }

        $leadership->update($validated);

        return redirect()->route('leadership.index')->with('success', 'Leadership member updated successfully!');
    }

    public function destroy(Leadership $leadership)
    {
        if ($leadership->banner_image && file_exists(public_path($leadership->banner_image))) {
            unlink(public_path($leadership->banner_image));
        }
        
        if ($leadership->image && file_exists(public_path($leadership->image))) {
            unlink(public_path($leadership->image));
        }
        
        if ($leadership->video && file_exists(public_path($leadership->video))) {
            unlink(public_path($leadership->video));
        }
        
        if ($leadership->message_image && file_exists(public_path($leadership->message_image))) {
            unlink(public_path($leadership->message_image));
        }

        $leadership->schools()->detach();
        $leadership->pages()->detach();
        $leadership->departments()->detach();
        $leadership->courses()->detach();

        $leadership->delete();

        return redirect()->route('leadership.index')->with('success', 'Leadership member deleted successfully!');
    }

    public function toggleStatus($id)
    {
        $leadership = Leadership::findOrFail($id);
        $leadership->status = !$leadership->status;
        $leadership->save();

        return redirect()->route('leadership.index')->with('success', 'Leadership Status Updated!');
    }

    public function mapping($id)
    {
        $leaderships = Leadership::with(['schools:id,name', 'pages:id,title', 'departments:id,name', 'courses:id,name'])->findOrFail($id);
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

        return Inertia::render('Leaderships/Mapping', [
            'leaderships' => $leaderships,
            'schools' => $schools,
            'pages' => $pages,
            'departments' => $departments,
            'courses' => $courses,
        ]);
    }

    public function attachMapping(Request $request, $id)
    {
        $leaderships = Leadership::findOrFail($id);

        $validated = $request->validate([
            'school_ids' => 'nullable|array',
            'school_ids.*' => 'exists:schools,id',
            'page_ids' => 'nullable|array',
            'page_ids.*' => 'exists:pages,id',
            'department_ids' => 'nullable|array',
            'department_ids.*' => 'exists:departments,id',
            'course_ids' => 'nullable|array',
            'course_ids.*' => 'exists:courses,id',
        ]);

        $leaderships->schools()->sync($validated['school_ids'] ?? []);
        $leaderships->pages()->sync($validated['page_ids'] ?? []);
        $leaderships->departments()->sync($validated['department_ids'] ?? []);
        $leaderships->courses()->sync($validated['course_ids'] ?? []);

        return redirect()->route('leadership.index', $leaderships->id)->with('success', 'Leadership mapped successfully!');
    }
}
