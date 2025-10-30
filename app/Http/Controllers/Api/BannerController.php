<?php

namespace App\Http\Controllers\Api;

use App\Models\Banner;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class BannerController extends Controller
{
    public function index()
    {
        try {
            $banners = Banner::orderBy('display_order', 'asc')
                ->get()
                ->map(function ($banner) {
                    return [
                        'id' => $banner->id,
                        'title' => $banner->heading,
                        'desc' => $banner->subheading,
                        'linked_text' => $banner->linked_text,
                        'url' => $banner->link,
                        'img' => asset($banner->image),
                        'display_order' => $banner->display_order,
                    ];
                });

            if ($banners->isEmpty()) {
                $banners = collect([self::placeholderBanner()]);
            }

            return response()->json([
                'status' => true,
                'banners' => $banners,
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong. Showing placeholder banner.',
                'banners' => [self::placeholderBanner()],
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 200);
        }
    }

    private static function placeholderBanner(): array
    {
        return [
            'id' => 0,
            'title' => 'Coming Soon',
            'desc' => 'Stay tuned for exciting updates!',
            'linked_text' => 'Learn More',
            'url' => '#',
            'img' => asset('assets/img/placeholder/banner-placeholder.png'),
            'display_order' => 1,
        ];
    }
}
