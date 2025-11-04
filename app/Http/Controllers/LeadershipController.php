<?php

namespace App\Http\Controllers;

use App\Models\Type;
use Inertia\Inertia;
use App\Models\Leadership;
use Illuminate\Http\Request;

class LeadershipController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $leadership = Leadership::with('type')->filter(['search' => $search])->orderBy('display_order', 'asc')->paginate(10)->withQueryString()->through(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                'banner_image' => $item->banner_image ? asset($item->banner_image) : asset('assets/img/placeholder.png'),
                'video' => $item->video,
                'type' => $item->type->name ?? 'N/A',
                'type_id' => $item->type_id,
                'short_description' => $item->short_description,
                'description' => $item->description,
                'biography' => $item->biography,
                'message' => $item->message,
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
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type_id' => 'required|exists:types,id',
            'name' => 'required|string|max:255',
            'short_description' => 'required|string',
            'description' => 'nullable|array',
            'description.*' => 'nullable|string',
            'biography' => 'nullable|string',
            'banner_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'video' => 'nullable|file|mimes:mp4,avi,mov,webm|max:2048',
            'message' => 'nullable|array',
            'message.*' => 'nullable|string',
            'status' => 'nullable|boolean',
            'display_order' => 'nullable|integer|min:0',
        ]);

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

        Leadership::create($validated);

        return redirect()->route('leadership.index')->with('success', 'Leadership member created successfully!');
    }

    public function edit(Leadership $leadership)
    {
        $types = Type::where('element', 'leadership')->get();
        
        return Inertia::render('Leaderships/Edit', [
            'leadership' => $leadership,
            'types' => $types,
        ]);
    }

    public function update(Request $request, Leadership $leadership)
    {
        $validated = $request->validate([
            'type_id' => 'required|exists:types,id',
            'name' => 'required|string|max:255',
            'short_description' => 'required|string',
            'description' => 'nullable|array',
            'description.*' => 'nullable|string',
            'biography' => 'nullable|string',
            'banner_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'video' => 'nullable|file|mimes:mp4,avi,mov|max:10240',
            'message' => 'nullable|array',
            'message.*' => 'nullable|string',
            'status' => 'nullable|boolean',
            'display_order' => 'nullable|integer|min:0',
        ]);

        $validated['description'] = array_filter($validated['description'] ?? []);
        $validated['message'] = array_filter($validated['message'] ?? []);

        if ($request->hasFile('banner_image')) {
            if ($leadership->banner_image && file_exists(public_path($leadership->banner_image))) {
                unlink(public_path($leadership->banner_image));
            }
            
            $bannerImage = $request->file('banner_image');
            $bannerImageName = time() . '_banner_' . uniqid() . '.' . $bannerImage->getClientOriginalExtension();
            $bannerImage->move(public_path('assets/img/leadership/'), $bannerImageName);
            $validated['banner_image'] = 'assets/img/leadership/' . $bannerImageName;
        }

        if ($request->hasFile('image')) {
            if ($leadership->image && file_exists(public_path($leadership->image))) {
                unlink(public_path($leadership->image));
            }
            
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/leadership/'), $imageName);
            $validated['image'] = 'assets/img/leadership/' . $imageName;
        }

        if ($request->hasFile('video')) {
            if ($leadership->video && file_exists(public_path($leadership->video))) {
                unlink(public_path($leadership->video));
            }
            
            $video = $request->file('video');
            $videoName = time() . '_video_' . uniqid() . '.' . $video->getClientOriginalExtension();
            $video->move(public_path('assets/videos/leadership/'), $videoName);
            $validated['video'] = 'assets/videos/leadership/' . $videoName;
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
}
