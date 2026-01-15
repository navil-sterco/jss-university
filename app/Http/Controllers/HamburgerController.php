<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pages;
use App\Models\School;
use App\Models\Hamburger;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HamburgerController extends Controller
{
    public function index()
    {
        $menuItems = Hamburger::with(['children' => function($query) {
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

        return Inertia::render('Hamburger/Index', [
            'menuItems' => $menuItems
        ]);
    }

    public function create()
    {
        $schools = School::select('id','name')->get();
        $departments = Department::select('id','name')->get();
        $pages = Pages::select('id','title')->get();
        
        $menuItems = Hamburger::with('children')
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

        return Inertia::render('Hamburger/Create', [
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
            'parent_id' => 'nullable|exists:hamburgers,id',
            'url' => 'nullable|string|max:500',
            
            'section_title' => 'nullable|string|max:255',
            'section_subtitle' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:500',
            'section_heading_first' => 'nullable|string|max:255',
            'section_subheading_first' => 'nullable|string|max:255',
            'section_image_first' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            
            'section_title_second' => 'nullable|string|max:255',
            'section_subtitle_second' => 'nullable|string|max:255',
            'section_heading_second' => 'nullable|string|max:255',
            'section_subheading_second' => 'nullable|string|max:255',
            'section_image_second' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            
            'section_video_url' => 'nullable|string|max:500',
            
            'display_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('section_image_first')) {
            $image = $request->file('section_image_first');
            $imageName = time() . '_first_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/hamburger/'), $imageName);
            $validated['section_image_first'] = 'assets/img/hamburger/' . $imageName;
        }

        if ($request->hasFile('section_image_second')) {
            $image = $request->file('section_image_second');
            $imageName = time() . '_second_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/hamburger/'), $imageName);
            $validated['section_image_second'] = 'assets/img/hamburger/' . $imageName;
        }

        $hamburger = Hamburger::create([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'reference_id' => $validated['reference_id'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'url' => $validated['url'] ?? null,
            
            'section_title' => $validated['section_title'] ?? null,
            'section_subtitle' => $validated['section_subtitle'] ?? null,
            'link' => $validated['link'] ?? null,
            'section_heading_first' => $validated['section_heading_first'] ?? null,
            'section_subheading_first' => $validated['section_subheading_first'] ?? null,
            'section_image_first' => $validated['section_image_first'] ?? null,
            
            'section_title_second' => $validated['section_title_second'] ?? null,
            'section_subtitle_second' => $validated['section_subtitle_second'] ?? null,
            'section_heading_second' => $validated['section_heading_second'] ?? null,
            'section_subheading_second' => $validated['section_subheading_second'] ?? null,
            'section_image_second' => $validated['section_image_second'] ?? null,
            
            'section_video_url' => $validated['section_video_url'] ?? null,
            
            'display_order' => $validated['display_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()
            ->route('hamburger.index')
            ->with('success', 'Menu item created successfully.');
    }

    public function edit(Hamburger $hamburger)
    {
        $schools = School::select('id', 'name')->get();
        $departments = Department::select('id', 'name')->get();
        $pages = Pages::select('id', 'title')->get();

        $menuItems = Hamburger::with('children')
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

        return Inertia::render('Hamburger/Edit', [
            'hamburger' => [
                'id' => $hamburger->id,
                'title' => $hamburger->title,
                'url' => $hamburger->url,
                'type' => $hamburger->type,
                'reference_id' => $hamburger->reference_id,
                'parent_id' => $hamburger->parent_id,
                'section_title' => $hamburger->section_title,
                'section_subtitle' => $hamburger->section_subtitle,
                'link' => $hamburger->link,
                'section_title_second' => $hamburger->section_title_second,
                'section_subtitle_second' => $hamburger->section_subtitle_second,
                'section_image_first' => $hamburger->section_image_first,
                'section_heading_first' => $hamburger->section_heading_first,
                'section_subheading_first' => $hamburger->section_subheading_first,
                'section_image_second' => $hamburger->section_image_second,
                'section_heading_second' => $hamburger->section_heading_second,
                'section_subheading_second' => $hamburger->section_subheading_second,
                'section_video_url' => $hamburger->section_video_url,
                'display_order' => $hamburger->display_order,
                'is_active' => $hamburger->is_active,
            ],
            'schools' => $schools,
            'departments' => $departments,
            'pages' => $pages,
            'menuItems' => $menuItems,
        ]);
    }

    public function update(Request $request, Hamburger $hamburger)
    {
        // Note: Changed parameter type from Header to Hamburger to match your model
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:custom,school,department,page',
            'reference_id' => 'nullable|integer',
            'parent_id' => 'nullable|exists:hamburgers,id',
            'url' => 'nullable|string|max:500',
            
            // First Section
            'section_title' => 'nullable|string|max:255',
            'section_subtitle' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:500',
            'section_heading_first' => 'nullable|string|max:255',
            'section_subheading_first' => 'nullable|string|max:255',
            'section_image_first' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            
            // Second Section
            'section_title_second' => 'nullable|string|max:255',
            'section_subtitle_second' => 'nullable|string|max:255',
            'section_heading_second' => 'nullable|string|max:255',
            'section_subheading_second' => 'nullable|string|max:255',
            'section_image_second' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            
            // Video Section
            'section_video_url' => 'nullable|string|max:500',
            
            'display_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $updateData = [
            'title' => $validated['title'],
            'type' => $validated['type'],
            'reference_id' => $validated['reference_id'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'url' => $validated['url'] ?? null,
            
            // First Section
            'section_title' => $validated['section_title'] ?? null,
            'section_subtitle' => $validated['section_subtitle'] ?? null,
            'link' => $validated['link'] ?? null,
            'section_heading_first' => $validated['section_heading_first'] ?? null,
            'section_subheading_first' => $validated['section_subheading_first'] ?? null,
            
            // Second Section
            'section_title_second' => $validated['section_title_second'] ?? null,
            'section_subtitle_second' => $validated['section_subtitle_second'] ?? null,
            'section_heading_second' => $validated['section_heading_second'] ?? null,
            'section_subheading_second' => $validated['section_subheading_second'] ?? null,
            
            // Video Section
            'section_video_url' => $validated['section_video_url'] ?? null,
            
            'display_order' => $validated['display_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ];

        // Handle first section image upload
        if ($request->hasFile('section_image_first')) {
            // Delete old image if exists
            if ($hamburger->section_image_first && file_exists(public_path($hamburger->section_image_first))) {
                unlink(public_path($hamburger->section_image_first));
            }
            
            $image = $request->file('section_image_first');
            $imageName = time() . '_first_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/hamburger/'), $imageName);
            $updateData['section_image_first'] = 'assets/img/hamburger/' . $imageName;
        }

        // Handle second section image upload
        if ($request->hasFile('section_image_second')) {
            // Delete old image if exists
            if ($hamburger->section_image_second && file_exists(public_path($hamburger->section_image_second))) {
                unlink(public_path($hamburger->section_image_second));
            }
            
            $image = $request->file('section_image_second');
            $imageName = time() . '_second_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/hamburger/'), $imageName);
            $updateData['section_image_second'] = 'assets/img/hamburger/' . $imageName;
        }

        $hamburger->update($updateData);

        return redirect()
            ->route('hamburger.index')
            ->with('success', 'Menu item updated successfully!');
    }

    public function destroy(Hamburger $hamburger)
    {
        if ($hamburger->section_image_first && file_exists(public_path($hamburger->section_image_first))) {
            unlink(public_path($hamburger->section_image_first));
        }

        if ($hamburger->section_image_second && file_exists(public_path($hamburger->section_image_second))) {
            unlink(public_path($hamburger->section_image_second));
        }

        DB::transaction(function () use ($hamburger) {
            $this->deleteWithChildren($hamburger);
        });

        return redirect()
            ->route('hamburger.index')
            ->with('success', 'Menu item deleted successfully!');
    }

    private function deleteWithChildren(Hamburger $hamburger)
    {
        foreach ($hamburger->children as $child) {

            if ($child->section_image_first && file_exists(public_path($child->section_image_first))) {
                unlink(public_path($child->section_image_first));
            }
    
            if ($child->section_image_second && file_exists(public_path($child->section_image_second))) {
                unlink(public_path($child->section_image_second));
            }
            $this->deleteWithChildren($child);

        }

        $hamburger->delete();
    }

    // private function deleteWithChildren(Hamburger $hamburger)
    // {
    //     $hamburger->load('children.children');
        
    //     if ($hamburger->children->isNotEmpty()) {
    //         foreach ($hamburger->children as $child) {
    //             $this->deleteWithChildren($child);
    //         }
    //     }
        
    //     $hamburger->delete();
    // }

    public function updateOrder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:hamburgers,id',
            'items.*.display_order' => 'required|integer',
            'items.*.parent_id' => 'nullable|exists:hamburgers,id'
        ]);

        try {
            DB::transaction(function () use ($request) {
                foreach ($request->items as $itemData) {
                    Hamburger::where('id', $itemData['id'])->update([
                        'display_order' => $itemData['display_order'],
                        'parent_id' => $itemData['parent_id']
                    ]);
                }
            });

            return redirect()->route('hamburger.index')->with('success', 'Menu item updated successfully!');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update menu order: ' . $e->getMessage()
            ], 500);
        }
    }
    public function toggleStatus($id)
    {
        $hamburger = Hamburger::findOrFail($id);
        $hamburger->is_active = !$hamburger->is_active;
        $hamburger->save();

        return redirect()->route('hamburger.index')->with('success', 'Menu Status Updated!');
    }
}
