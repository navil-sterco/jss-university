<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pages;
use App\Models\Header;
use App\Models\School;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HeaderController extends Controller
{
    public function index()
    {
        $menuItems = Header::with(['children' => function($query) {
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

        return Inertia::render('Header/Index', [
            'menuItems' => $menuItems
        ]);
    }

    public function create()
    {
        $schools = School::select('id','name')->get();
        $departments = Department::select('id','name')->get();
        $pages = Pages::select('id','title')->get();
        
        $menuItems = Header::with('children')
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

        return Inertia::render('Header/Create', [
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
            'parent_id' => 'nullable|exists:headers,id',
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

        $header = Header::create([
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
            ->route('headers.index')
            ->with('success', 'Menu item created successfully.');
    }


    public function edit(Header $header)
    {
        $schools = School::select('id', 'name')->get();
        $departments = Department::select('id', 'name')->get();
        $pages = Pages::select('id', 'title')->get();

        $menuItems = Header::with('children')
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

        return Inertia::render('Header/Edit', [
            'header' => [
                'id' => $header->id,
                'title' => $header->title,
                'url' => $header->url,
                'type' => $header->type,
                'reference_id' => $header->reference_id,
                'parent_id' => $header->parent_id,
                'section_title' => $header->section_title,
                'section_subtitle' => $header->section_subtitle,
                'section_description' => $header->section_description,
                'section_button_text' => $header->section_button_text,
                'section_button_url' => $header->section_button_url,
                'display_order' => $header->display_order,
                'is_active' => $header->is_active,
                'boxes' => $header->boxes ? $header->boxes : [],
            ],
            'schools' => $schools,
            'departments' => $departments,
            'pages' => $pages,
            'menuItems' => $menuItems,
        ]);
    }

    public function update(Request $request, Header $header)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:custom,school,department,page',
            'reference_id' => 'nullable|integer',
            'parent_id' => 'nullable|exists:headers,id',
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
            $oldBoxes = $header->boxes ? json_decode($header->boxes, true) : [];

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

        $header->update([
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
            ->route('headers.index')
            ->with('success', 'Menu item updated successfully!');
    }

    public function destroy(Header $header)
    {
        DB::transaction(function () use ($header) {
            $this->deleteWithChildren($header);
        });

        return redirect()
            ->route('headers.index')
            ->with('success', 'Menu item deleted successfully!');
    }

    private function deleteWithChildren(Header $header)
    {
        foreach ($header->children as $child) {
            $this->deleteWithChildren($child);
        }

        if (!empty($header->boxes)) {
            // Check if boxes is already an array or needs decoding
            $boxes = is_array($header->boxes) ? $header->boxes : json_decode($header->boxes, true);

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

        $header->delete();
    }

    // private function deleteWithChildren(Header $header)
    // {
    //     $header->load('children.children');
        
    //     if ($header->children->isNotEmpty()) {
    //         foreach ($header->children as $child) {
    //             $this->deleteWithChildren($child);
    //         }
    //     }
        
    //     $header->delete();
    // }

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
                    Header::where('id', $itemData['id'])->update([
                        'display_order' => $itemData['display_order'],
                        'parent_id' => $itemData['parent_id']
                    ]);
                }
            });

            return redirect()->route('headers.index')->with('success', 'Menu item updated successfully!');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update menu order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function toggleStatus($id)
    {
        $header = Header::findOrFail($id);
        $header->is_active = !$header->is_active;
        $header->save();

        return redirect()->route('headers.index')->with('success', 'Header Status Updated!');
    }
}
