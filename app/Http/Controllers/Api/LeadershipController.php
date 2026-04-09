<?php

namespace App\Http\Controllers\Api;

use App\Models\Leadership;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class LeadershipController extends Controller
{
    public function listing()
    {
        try {
            $leadership = Leadership::with(['type', 'category'])
                ->where('status', 1)->where('page_type', 'leadership')
                ->orderBy('display_order', 'asc')
                ->get();
            $featured = $leadership->first();

            $formatItem = function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'slug' => $item->slug,
                    'designation' => $item->type->name ?? 'N/A',
                    'image' => $item->image
                        ? asset($item->image)
                        : asset('assets/img/placeholder.png'),
                ];
            };

            $featuredData = $featured ? $formatItem($featured) : null;
            $remaining = $leadership->skip(1);
            $management = $remaining->filter(function ($item) {
                return optional($item->category)->name === 'management';
            })->values()->map($formatItem);

            $others = $remaining->filter(function ($item) {
                return optional($item->category)->name !== 'management';
            })
                ->groupBy(function ($item) {
                    return $item->category->name ?? 'Uncategorized';
                })
                ->map(function ($items) use ($formatItem) {
                    return $items->map($formatItem)->values();
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'featured' => $featuredData,
                    'management' => $management,
                    'others' => $others,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch leadership',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function detail($slug)
    {
        $leadership = Leadership::where('status', 1)->where('slug', $slug)->first();

        if (!$leadership) {
            return response()->json([
                'status' => false,
                'message' => 'Data not found',
            ], 404);
        }
        $id = $leadership->id;

        try {
            $sections = [
                'banners' => [
                    'name' => $leadership->name,
                    'designation' => $leadership->type->name ?? null,
                    'short_description' => $leadership->short_description,
                    'banner_image' => $leadership->banner_image ? asset($leadership->banner_image) : asset('assets/img/placeholder.png'),
                ],

                'about' => [
                    'description' => $leadership->description,
                    'image' => $leadership->image ? asset($leadership->image) : asset('assets/img/placeholder.png'),
                ],

                'biography' => $leadership->biography,

                'message_from_chancellor' => [
                    'message' => $leadership->message,
                    'name' => $leadership->name,
                    'designation' => $leadership->type->name ?? null,
                    'video' => $leadership->video ? asset($leadership->video) : '',
                    'message_image' => $leadership->message_image ? asset($leadership->message_image) : asset('assets/img/placeholder.png'),
                ],
            ];

            return response()->json([
                'status' => true,
                'leadership_id' => $leadership->id,
                'leadership_name' => $leadership->name,
                'leadership_slug' => $leadership->slug,
                'sections' => $sections,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function academic_council()
    {
        try {
            $academic_council = Leadership::with(['type', 'category'])
                ->where('status', 1)->where('page_type', 'academic')
                ->orderBy('display_order', 'asc')
                ->get();

            

            return response()->json([
                'success' => true,
                'academic_council' => $academic_council,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch leadership',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function alumuni()
    {
        try {
            $alumuni = Leadership::with(['type', 'category'])
                ->where('status', 1)->where('page_type', 'alumuni')
                ->orderBy('display_order', 'asc')
                ->get();

            

            return response()->json([
                'success' => true,
                'alumuni' => $alumuni,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch leadership',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
