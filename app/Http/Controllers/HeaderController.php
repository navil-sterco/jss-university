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
        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:custom,school,department,page',
            'reference_id' => 'nullable|integer',
            'parent_id' => 'nullable|exists:headers,id',
            'url' => 'nullable|string|max:500',
            'display_order' => 'required|integer',
            'is_active' => 'boolean'
        ]);

        Header::create([
            'title' => $request->title,
            'type' => $request->type,
            'reference_id' => $request->reference_id,
            'parent_id' => $request->parent_id,
            'url' => $request->url,
            'display_order' => $request->display_order,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('headers.index')->with('success', 'Menu item created successfully!');
    }

    public function edit(Header $header)
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

        return Inertia::render('Header/Edit', [
            'header' => [
                'id' => $header->id,
                'title' => $header->title,
                'url' => $header->url,
                'type' => $header->type,
                'reference_id' => $header->reference_id,
                'parent_id' => $header->parent_id,
                'display_order' => $header->display_order,
                'is_active' => $header->is_active,
            ],
            'schools' => $schools,
            'departments' => $departments,
            'pages' => $pages,
            'menuItems' => $menuItems
        ]);
    }

    public function update(Request $request, Header $header)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:custom,school,department,page',
            'reference_id' => 'nullable|integer',
            'parent_id' => 'nullable|exists:headers,id',
            'url' => 'nullable|string|max:500',
            'display_order' => 'required|integer',
            'is_active' => 'boolean'
        ]);

        $header->update([
            'title' => $request->title,
            'type' => $request->type,
            'reference_id' => $request->reference_id,
            'parent_id' => $request->parent_id,
            'url' => $request->url,
            'display_order' => $request->display_order,
            'is_active' => $request->is_active ?? true,
        ]);

        return redirect()->route('headers.index')->with('success', 'Menu item updated successfully!');
    }

    public function destroy(Header $header)
    {
        DB::transaction(function () use ($header) {
            $this->deleteWithChildren($header);
        });

        return redirect()->route('headers.index')->with('success', 'Menu item deleted successfully!');
    }

    private function deleteWithChildren(Header $header)
    {
        $header->load('children.children');
        
        if ($header->children->isNotEmpty()) {
            foreach ($header->children as $child) {
                $this->deleteWithChildren($child);
            }
        }
        
        $header->delete();
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
