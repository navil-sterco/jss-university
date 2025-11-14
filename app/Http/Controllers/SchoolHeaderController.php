<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pages;
use App\Models\School;
use App\Models\Department;
use App\Models\SchoolHeader;
use Illuminate\Http\Request;

class SchoolHeaderController extends Controller
{
    public function index()
    {
        $menuItems = SchoolHeader::with(['children' => function($query) {
                $query->orderBy('display_order')->with(['children' => function($q) {
                    $q->orderBy('display_order');
                }]);
            }])
            ->rootItems()
            ->orderBy('display_order')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'url' => $item->url,
                    'type' => $item->type,
                    'reference_id' => $item->reference_id,
                    'parent_id' => $item->parent_id,
                    'display_order' => $item->display_order,
                    'is_active' => $item->is_active,
                    'children' => $item->children->map(function ($child) {
                        return [
                            'id' => $child->id,
                            'title' => $child->title,
                            'url' => $child->url,
                            'type' => $child->type,
                            'reference_id' => $child->reference_id,
                            'parent_id' => $child->parent_id,
                            'display_order' => $child->display_order,
                            'is_active' => $child->is_active,
                            'children' => $child->children->map(function ($grandchild) {
                                return [
                                    'id' => $grandchild->id,
                                    'title' => $grandchild->title,
                                    'url' => $grandchild->url,
                                    'type' => $grandchild->type,
                                    'reference_id' => $grandchild->reference_id,
                                    'parent_id' => $grandchild->parent_id,
                                    'display_order' => $grandchild->display_order,
                                    'is_active' => $grandchild->is_active,
                                ];
                            })
                        ];
                    })
                ];
            });

        return Inertia::render('SchoolHeader/Index', [
            'menuItems' => $menuItems
        ]);
    }

    public function create()
    {
        $schools = School::select('id','name')->get();
        $departments = Department::select('id','name')->get();
        $pages = Pages::select('id','title')->get();
        
        $menuItems = SchoolHeader::with('children')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'url' => $item->url,
                    'type' => $item->type,
                    'reference_id' => $item->reference_id,
                    'display_order' => $item->display_order,
                    'is_active' => $item->is_active,
                    'children' => $item->children->map(function ($child) {
                        return [
                            'id' => $child->id,
                            'title' => $child->title,
                            'url' => $child->url,
                            'type' => $child->type,
                            'reference_id' => $child->reference_id,
                            'display_order' => $child->display_order,
                            'is_active' => $child->is_active,
                        ];
                    })
                ];
            });

        return Inertia::render('SchoolHeader/Create', [
            'schools' => $schools,
            'departments' => $departments,
            'pages' => $pages,
            'menuItems' => $menuItems
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:custom,school,department,page',
            'reference_id' => 'nullable|integer',
            'parent_id' => 'nullable|exists:school_headers,id',
            'url' => 'nullable|string|max:500',
            'section_title' => 'nullable|string|max:255',
            'section_subtitle' => 'nullable|string|max:255',
            'section_description' => 'nullable|string',
            'section_button_text' => 'nullable|string|max:100',
            'section_button_url' => 'nullable|string|max:500',
            'boxes' => 'nullable|array|max:3',
            'boxes.*.title' => 'required|string|max:255',
            'boxes.*.url' => 'nullable|string|max:500',
            'boxes.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'display_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if ($request->has('boxes')) {
            foreach ($validated['boxes'] as $index => &$box) {
                if ($request->hasFile("boxes.$index.image")) {
                    $image = $request->file("boxes.$index.image");

                    $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    $image->move(public_path('assets/img/boxes/'), $imageName);
                    $box['image'] = 'assets/img/boxes/' . $imageName;
                } else {
                    $box['image'] = null;
                }
            }
            unset($box);
        }

        $schoolHeader = SchoolHeader::create([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'reference_id' => $validated['reference_id'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'url' => $validated['url'] ?? null,
            'section_title' => $validated['section_title'] ?? null,
            'section_subtitle' => $validated['section_subtitle'] ?? null,
            'section_description' => $validated['section_description'] ?? null,
            'section_button_text' => $validated['section_button_text'] ?? null,
            'section_button_url' => $validated['section_button_url'] ?? null,
            'display_order' => $validated['display_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
            'boxes' => isset($validated['boxes']) ? json_encode($validated['boxes']) : null,
        ]);

        return redirect()
            ->route('school-header.index')
            ->with('success', 'Menu item created successfully.');
    }


    public function edit(SchoolHeader $schoolHeader)
    {
        $schools = School::select('id', 'name')->get();
        $departments = Department::select('id', 'name')->get();
        $pages = Pages::select('id', 'title')->get();

        $menuItems = SchoolHeader::with('children')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'url' => $item->url,
                    'type' => $item->type,
                    'reference_id' => $item->reference_id,
                    'display_order' => $item->display_order,
                    'is_active' => $item->is_active,
                    'children' => $item->children->map(function ($child) {
                        return [
                            'id' => $child->id,
                            'title' => $child->title,
                            'url' => $child->url,
                            'type' => $child->type,
                            'reference_id' => $child->reference_id,
                            'display_order' => $child->display_order,
                            'is_active' => $child->is_active,
                        ];
                    }),
                ];
            });

        return Inertia::render('SchoolHeader/Edit', [
            'header' => [
                'id' => $schoolHeader->id,
                'title' => $schoolHeader->title,
                'url' => $schoolHeader->url,
                'type' => $schoolHeader->type,
                'reference_id' => $schoolHeader->reference_id,
                'parent_id' => $schoolHeader->parent_id,
                'section_title' => $schoolHeader->section_title,
                'section_subtitle' => $schoolHeader->section_subtitle,
                'section_description' => $schoolHeader->section_description,
                'section_button_text' => $schoolHeader->section_button_text,
                'section_button_url' => $schoolHeader->section_button_url,
                'display_order' => $schoolHeader->display_order,
                'is_active' => $schoolHeader->is_active,
                'boxes' => $schoolHeader->boxes ? $schoolHeader->boxes : [],
            ],
            'schools' => $schools,
            'departments' => $departments,
            'pages' => $pages,
            'menuItems' => $menuItems,
        ]);
    }

    public function update(Request $request, SchoolHeader $schoolHeader)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:custom,school,department,page',
            'reference_id' => 'nullable|integer',
            'parent_id' => 'nullable|exists:school_headers,id',
            'url' => 'nullable|string|max:500',
            'section_title' => 'nullable|string|max:255',
            'section_subtitle' => 'nullable|string|max:255',
            'section_description' => 'nullable|string',
            'section_button_text' => 'nullable|string|max:100',
            'section_button_url' => 'nullable|string|max:500',
            'boxes' => 'nullable|array|max:3',
            'boxes.*.title' => 'nullable|string|max:255',
            'boxes.*.url' => 'nullable|string|max:500',
            'display_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $boxesData = [];

        if ($request->has('boxes')) {
            $oldBoxes = $schoolHeader->boxes ? json_decode($schoolHeader->boxes, true) : [];

            foreach ($request->boxes as $index => $box) {
                $boxData = [
                    'title' => $box['title'] ?? '',
                    'url' => $box['url'] ?? '',
                ];

                if ($request->hasFile("boxes.{$index}.image")) {
                    $request->validate([
                        "boxes.{$index}.image" => 'image|mimes:jpg,jpeg,png,webp|max:2048',
                    ]);

                    $oldImage = $oldBoxes[$index]['image'] ?? null;
                    if (!empty($oldImage) && file_exists(public_path($oldImage))) {
                        unlink(public_path($oldImage));
                    }

                    $image = $request->file("boxes.{$index}.image");
                    $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    $image->move(public_path('assets/img/boxes/'), $imageName);

                    $boxData['image'] = 'assets/img/boxes/' . $imageName;
                } else {
                    $boxData['image'] = $oldBoxes[$index]['image'] ?? null;
                }

                $boxesData[] = $boxData;
            }
        }

        $schoolHeader->update([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'reference_id' => $validated['reference_id'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'url' => $validated['url'] ?? null,
            'section_title' => $validated['section_title'] ?? null,
            'section_subtitle' => $validated['section_subtitle'] ?? null,
            'section_description' => $validated['section_description'] ?? null,
            'section_button_text' => $validated['section_button_text'] ?? null,
            'section_button_url' => $validated['section_button_url'] ?? null,
            'display_order' => $validated['display_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
            'boxes' => !empty($boxesData) ? json_encode($boxesData) : null,
        ]);

        return redirect()
            ->route('school-header.index')
            ->with('success', 'Menu item updated successfully!');
    }

    public function destroy(SchoolHeader $schoolHeader)
    {
        DB::transaction(function () use ($schoolHeader) {
            $this->deleteWithChildren($schoolHeader);
        });

        return redirect()
            ->route('school-header.index')
            ->with('success', 'Menu item deleted successfully!');
    }

    private function deleteWithChildren(SchoolHeader $schoolHeader)
    {
        foreach ($schoolHeader->children as $child) {
            $this->deleteWithChildren($child);
        }

        if (!empty($schoolHeader->boxes)) {
            // Check if boxes is already an array or needs decoding
            $boxes = is_array($schoolHeader->boxes) ? $schoolHeader->boxes : json_decode($schoolHeader->boxes, true);

            if (is_array($boxes)) {
                foreach ($boxes as $box) {
                    if (!empty($box['image'])) {
                        $imagePath = public_path($box['image']);
                        if (file_exists($imagePath)) {
                            @unlink($imagePath);
                        }
                    }
                }
            }
        }

        $schoolHeader->delete();
    }

    public function updateOrder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:headers,id',
            'items.*.display_order' => 'required|integer',
            'items.*.parent_id' => 'nullable|exists:headers,id'
        ]);

        try {
            DB::transaction(function () use ($request) {
                foreach ($request->items as $itemData) {
                    SchoolHeader::where('id', $itemData['id'])->update([
                        'display_order' => $itemData['display_order'],
                        'parent_id' => $itemData['parent_id']
                    ]);
                }
            });

            return redirect()->route('school-header.index')->with('success', 'Menu item updated successfully!');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update menu order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function toggleStatus($id)
    {
        $schoolHeader = SchoolHeader::findOrFail($id);
        $schoolHeader->is_active = !$schoolHeader->is_active;
        $schoolHeader->save();

        return redirect()->route('school-header.index')->with('success', 'Header Status Updated!');
    }
}
