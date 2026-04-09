<?php

namespace App\Http\Controllers\Api;

use App\Models\SeoSetting;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SeoSettingController extends Controller
{
    public function seo($slug)
    {
        $seo = SeoSetting::where('slug', $slug)->first();

        if (!$seo) {
            return response()->json([
                'status' => false,
                'message' => 'SEO data not found for slug: ' . $slug,
            ], 404);
        }

        $data = [
            'title' => $seo->meta_title,
            'description' => $seo->meta_description,
            'keywords' => $seo->keywords ?? [],
            'openGraph' => [
                'title' => $seo->og_title ?? '',
                'description' => $seo->og_description ?? '',
                'type' => $seo->og_type ?? '',
                'url' => $seo->og_url ?? '',
                'images' => $seo->og_image ? asset($seo->og_image) : asset('assets/img/seo/placeholder-og.png')
            ],
            'alternates' => [
                'canonical' => $seo->canonical_url,
            ],
        ];

        return response()->json([
            'status' => true,
            'data' => $data
        ]);
    }

    /**
     * Perform global site search using SEO data
     */
    public function globalSearch(Request $request)
    {
        $query = $request->input('q');

        if (empty($query)) {
            return response()->json([
                'status' => false,
                'message' => 'Search query is required',
                'data' => []
            ]);
        }

        $results = SeoSetting::where('meta_title', 'like', "%{$query}%")
            ->orWhere('meta_description', 'like', "%{$query}%")
            ->orWhere('slug', 'like', "%{$query}%")
            ->orWhereJsonContains('search_terms', $query)
            ->orWhereJsonContains('keywords', $query)
            ->select('meta_title as title', 'meta_description as description', 'slug as url')
            ->limit(100)
            ->get();

        return response()->json([
            'status' => true,
            'data' => $results
        ]);
    }
}
