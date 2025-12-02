<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pages;
use App\Models\School;
use App\Models\Department;
use App\Models\MobileHeader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MobileHeaderController extends Controller
{
    public function index()
    {
        $menuItems = MobileHeader::with(['children' => function($query) {
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

        return Inertia::render('MobileHeader/Index', [
            'menuItems' => $menuItems
        ]);
    }

    public function create()
    {
        $schools = School::select('id','name')->get();
        $departments = Department::select('id','name')->get();
        $pages = Pages::select('id','title')->get();
        
        $menuItems = MobileHeader::with('children')
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

        return Inertia::render('MobileHeader/Create', [
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
            'parent_id' => 'nullable|exists:mobile_headers,id',
            'url' => 'nullable|string|max:500',
            'display_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $mobileHeader = MobileHeader::create([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'reference_id' => $validated['reference_id'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'url' => $validated['url'] ?? null,
            'display_order' => $validated['display_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
            'boxes' => isset($validated['boxes']) ? json_encode($validated['boxes']) : null,
        ]);

        return redirect()
            ->route('mobile-headers.index')
            ->with('success', 'Menu item created successfully.');
    }


    public function edit(MobileHeader $mobileHeader)
    {
        $schools = School::select('id', 'name')->get();
        $departments = Department::select('id', 'name')->get();
        $pages = Pages::select('id', 'title')->get();

        $menuItems = MobileHeader::with('children')
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

        return Inertia::render('MobileHeader/Edit', [
            'header' => [
                'id' => $mobileHeader->id,
                'title' => $mobileHeader->title,
                'url' => $mobileHeader->url,
                'type' => $mobileHeader->type,
                'reference_id' => $mobileHeader->reference_id,
                'parent_id' => $mobileHeader->parent_id,
                'display_order' => $mobileHeader->display_order,
                'is_active' => $mobileHeader->is_active,
            ],
            'schools' => $schools,
            'departments' => $departments,
            'pages' => $pages,
            'menuItems' => $menuItems,
        ]);
    }

    public function update(Request $request, MobileHeader $mobileHeader)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:custom,school,department,page',
            'reference_id' => 'nullable|integer',
            'parent_id' => 'nullable|exists:mobile_headers,id',
            'url' => 'nullable|string|max:500',
            'display_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $boxesData = [];

        $mobileHeader->update([
            'title' => $validated['title'],
            'type' => $validated['type'],
            'reference_id' => $validated['reference_id'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'url' => $validated['url'] ?? null,
            'display_order' => $validated['display_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()
            ->route('mobile-headers.index')
            ->with('success', 'Menu item updated successfully!');
    }

    public function destroy(MobileHeader $mobileHeader)
    {
        DB::transaction(function () use ($mobileHeader) {
            $this->deleteWithChildren($mobileHeader);
        });

        return redirect()
            ->route('mobile-headers.index')
            ->with('success', 'Menu item deleted successfully!');
    }

    private function deleteWithChildren(MobileHeader $mobileHeader)
    {
        foreach ($mobileHeader->children as $child) {
            $this->deleteWithChildren($child);
        }

        $mobileHeader->delete();
    }

    public function updateOrder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:mobile_headers,id',
            'items.*.display_order' => 'required|integer',
            'items.*.parent_id' => 'nullable|exists:mobile_headers,id'
        ]);

        try {
            DB::transaction(function () use ($request) {
                foreach ($request->items as $itemData) {
                    MobileHeader::where('id', $itemData['id'])->update([
                        'display_order' => $itemData['display_order'],
                        'parent_id' => $itemData['parent_id']
                    ]);
                }
            });

            return redirect()->route('mobile-headers.index')->with('success', 'Menu item updated successfully!');

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update menu order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function toggleStatus($id)
    {
        $mobileHeader = MobileHeader::findOrFail($id);
        $mobileHeader->is_active = !$mobileHeader->is_active;
        $mobileHeader->save();

        return redirect()->route('mobile-headers.index')->with('success', 'Header Status Updated!');
    }
}
