<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Gallery;
use App\Models\Happening;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $galleries = Gallery::where('type', 'gallery')
            ->orderBy('display_order')
            ->orderBy('event_date', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'event_date' => $item->event_date,
                    'images' => $item->images ? array_map(fn($img) => asset($img), $item->images) : [asset('assets/img/placeholder.png')],
                    'videos' => $item->videos ? array_map(fn($vid) => asset($vid), $item->videos) : [],
                ];
            });

        $mediaCoverage = Gallery::where('type', 'media_coverage')
            ->orderBy('display_order')
            ->orderBy('event_date', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'event_date' => $item->event_date,
                    'images' => $item->images ? array_map(fn($img) => asset($img), $item->images) : [asset('assets/img/placeholder.png')],
                ];
            });

        $notices = Gallery::where('type', 'notice_announcement')
            ->orderBy('display_order')
            ->orderBy('event_date', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'event_date' => $item->event_date,
                    'pdf' => $item->pdf ? asset($item->pdf) : null,
                ];
            });

        return Inertia::render('Galleries/Index', [
            'galleries' => $galleries,
            'mediaCoverage' => $mediaCoverage,
            'notices' => $notices,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Galleries/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'event_date' => 'nullable|date',
            'type' => 'required|in:gallery,media_coverage,notice_announcement',
            'images.*' => [
                'sometimes',
                'image',
                'max:6144',
                function ($attribute, $value, $fail) use ($request) {
                    if (!in_array($request->type, ['gallery', 'media_coverage'])) {
                        $fail('Images are only allowed for gallery or media coverage.');
                    }
                },
            ],
            'videos.*' => [
                'sometimes',
                'mimetypes:video/mp4,video/avi,video/mpeg',
                'max:6144',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->type !== 'gallery') {
                        $fail('Videos are only allowed for gallery type.');
                    }
                },
            ],
            'pdf' => [
                'nullable',
                'file',
                'mimes:pdf',
                'max:2048',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->type !== 'notice_announcement' && $value) {
                        $fail('PDF is only allowed for Notice & Announcement type.');
                    }
                },
            ],
            'display_order' => 'nullable|integer',
        ]);

        // Handle multiple images
        if ($request->hasFile('images') && in_array($request->type, ['gallery', 'media_coverage'])) {
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $imageName = time() . '_img_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('assets/img/galleries/'), $imageName);
                $imagePaths[] = 'assets/img/galleries/' . $imageName;
            }
            $validated['images'] = $imagePaths;
        }

        // Handle multiple videos
        if ($request->type === 'gallery' && $request->hasFile('videos')) {
            $videoPaths = [];
            foreach ($request->file('videos') as $video) {
                $videoName = time() . '_vid_' . uniqid() . '.' . $video->getClientOriginalExtension();
                $video->move(public_path('assets/videos/galleries/'), $videoName);
                $videoPaths[] = 'assets/videos/galleries/' . $videoName;
            }
            $validated['videos'] = $videoPaths;
        }

        // Handle PDF
        if ($request->type === 'notice_announcement' && $request->hasFile('pdf')) {
            $pdf = $request->file('pdf');
            $pdfName = time() . '_pdf_' . uniqid() . '.' . $pdf->getClientOriginalExtension();
            $pdf->move(public_path('assets/pdf/galleries/'), $pdfName);
            $validated['pdf'] = 'assets/pdf/galleries/' . $pdfName;
        }

        Gallery::create($validated);

        return redirect()->route('galleries.index')->with('success', 'Gallery item created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Gallery $gallery)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Gallery $gallery)
    {  
        return Inertia::render('Galleries/Edit', [
            'gallery' => $gallery,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Gallery $gallery)
    {
        // Validate request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'event_date' => 'nullable|date',
            'type' => 'required|in:gallery,media_coverage,notice_announcement',
            'display_order' => 'nullable|integer',
            'images.*' => 'sometimes|image|mimes:jpg,jpeg,png,webp|max:6144',
            'videos.*' => 'sometimes|mimes:mp4,avi,mov,wmv|max:10240',
            'pdf' => 'nullable|mimes:pdf|max:5120',
            'removed_images' => 'nullable|array',
            'removed_videos' => 'nullable|array',
            'removed_pdf' => 'nullable|boolean',
        ]);

        // --- Handle existing arrays safely ---
        $currentImages = is_string($gallery->images) ? json_decode($gallery->images, true) : ($gallery->images ?? []);
        $currentVideos = is_string($gallery->videos) ? json_decode($gallery->videos, true) : ($gallery->videos ?? []);
        $currentPdf = $gallery->pdf ?? null;

        // Remove images
        if ($request->filled('removed_images')) {
            foreach ($request->removed_images as $imgPath) {
                if (file_exists(public_path($imgPath))) {
                    unlink(public_path($imgPath));
                }
                $currentImages = array_filter($currentImages, fn($img) => $img !== $imgPath);
            }
        }

        // Remove videos
        if ($request->filled('removed_videos')) {
            foreach ($request->removed_videos as $vidPath) {
                if (file_exists(public_path($vidPath))) {
                    unlink(public_path($vidPath));
                }
                $currentVideos = array_filter($currentVideos, fn($vid) => $vid !== $vidPath);
            }
        }

        // Remove PDF
        if ($request->boolean('removed_pdf') && $currentPdf) {
            if (file_exists(public_path($currentPdf))) {
                unlink(public_path($currentPdf));
            }
            $currentPdf = null;
        }

        // --- Handle new uploads ---
        if ($request->hasFile('images') && in_array($request->type, ['gallery', 'media_coverage'])) {
            foreach ($request->file('images') as $image) {
                $imageName = time() . '_img_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('assets/img/galleries/'), $imageName);
                $currentImages[] = 'assets/img/galleries/' . $imageName;
            }
        }

        if ($request->type === 'gallery' && $request->hasFile('videos')) {
            foreach ($request->file('videos') as $video) {
                $videoName = time() . '_vid_' . uniqid() . '.' . $video->getClientOriginalExtension();
                $video->move(public_path('assets/videos/galleries/'), $videoName);
                $currentVideos[] = 'assets/videos/galleries/' . $videoName;
            }
        }

        if ($request->type === 'notice_announcement' && $request->hasFile('pdf')) {
            if ($currentPdf && file_exists(public_path($currentPdf))) {
                unlink(public_path($currentPdf));
            }
            $pdf = $request->file('pdf');
            $pdfName = time() . '_pdf_' . uniqid() . '.' . $pdf->getClientOriginalExtension();
            $pdf->move(public_path('assets/pdf/galleries/'), $pdfName);
            $currentPdf = 'assets/pdf/galleries/' . $pdfName;
        }

        // --- Save updates ---
        $gallery->update([
            'title' => $validated['title'],
            'event_date' => $validated['event_date'] ?? null,
            'type' => $validated['type'],
            'display_order' => $validated['display_order'] ?? 100,
            'images' => $currentImages,
            'videos' => $currentVideos,
            'pdf' => $currentPdf,
        ]);

        return redirect()->route('galleries.index')->with('success', 'Gallery updated successfully!');
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Gallery $gallery)
    {
        // Delete associated files
        if ($gallery->images) {
            foreach ($gallery->images as $image) {
                if (file_exists(public_path($image))) {
                    unlink(public_path($image));
                }
            }
        }

        if ($gallery->videos) {
            foreach ($gallery->videos as $video) {
                if (file_exists(public_path($video))) {
                    unlink(public_path($video));
                }
            }
        }

        if ($gallery->pdf && file_exists(public_path($gallery->pdf))) {
            unlink(public_path($gallery->pdf));
        }

        $gallery->delete();

        return redirect()->route('galleries.index')->with('success', 'Gallery item deleted successfully!');
    }

    public function mapping($id)
    {
        $gallery = Gallery::with(['happenings:id,title'])->findOrFail($id);
        $happenings = Happening::select('id', 'title')->get();

        return Inertia::render('Galleries/Mapping', [
            'gallery' => $gallery,
            'happenings' => $happenings,
        ]);
    }

    /**
     * Attach selected schools and pages to a Happening.
     */
    public function attachMapping(Request $request, $id)
    {
        $gallery = Gallery::findOrFail($id);

        $validated = $request->validate([
            'happening_ids' => 'nullable|array',
            'happening_ids.*' => 'exists:happenings,id',
        ]);

        $gallery->happenings()->sync($validated['happening_ids'] ?? []);

        return redirect()->route('galleries.mapping', $gallery->id)
                        ->with('success', 'Gallery mapped successfully!');
    }
}
