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
            $leadership = Leadership::with('type')
            ->where('status',true)
            ->orderBy('display_order', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'slug' => $item->slug,
                    'designation' => $item->type->name ?? 'N/A',
                    'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $leadership,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch happenings',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function detail($slug)
    {
        $leadership = Leadership::where('slug',$slug)->first();

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
                    'video' => $leadership->video ? asset($leadership->video) : asset('assets/img/placeholder.png'),
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
}
