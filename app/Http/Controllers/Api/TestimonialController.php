<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Testimonial;

class TestimonialController extends Controller
{
    public function list()
    {
        $testimonials = Testimonial::orderBy('display_order', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'type' => $item->type,
                    'title' => $item->title,
                    'slug' => $item->slug,
                    'alt_text' => $item->alt_text,
                    'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                    'video_url' => $item->video_url,
                    'short_description' => $item->short_description,
                    'name' => $item->name,
                    'batch' => $item->batch,
                    'course' => $item->course,
                    'description' => $item->description,
                    'designation' => $item->designation,
                    'location' => $item->location,
                    'company' => $item->company,
                    'status' => $item->status,
                    'show_on_home' => $item->show_on_home,
                    'display_order' => $item->display_order,
                ];
            });

        return response()->json([
            'status' => true,
            'data' => $testimonials,
        ], 200);
    }

    public function details($slug)
    {
        $item = Testimonial::where('slug', $slug)
            ->orderBy('display_order', 'asc')
            ->first();

        if (!$item) {
            return response()->json([
                'status' => false,
                'message' => 'Testimonial not found'
            ], 404);
        }

        $testimonial = [
            'id' => $item->id,
            'type' => $item->type,
            'title' => $item->title,
            'slug' => $item->slug,
            'alt_text' => $item->alt_text,
            'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
            'video_url' => $item->video_url,
            'short_description' => $item->short_description,
            'name' => $item->name,
            'batch' => $item->batch,
            'course' => $item->course,
            'description' => $item->description,
            'designation' => $item->designation,
            'location' => $item->location,
            'company' => $item->company,
            'status' => $item->status,
            'show_on_home' => $item->show_on_home,
            'display_order' => $item->display_order,
        ];

        return response()->json([
            'status' => true,
            'data' => $testimonial,
        ], 200);
    }
}
