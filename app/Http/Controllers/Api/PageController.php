<?php

namespace App\Http\Controllers\Api;

use App\Models\Pages;
use App\Models\Banner;
use App\Models\PageSection;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PageController extends Controller
{
    public function show($slug)
    {
        $page = Pages::where('slug', $slug)->first();

        if (!$page) {
            return response()->json(['error' => 'Page not found'], 404);
        }

        $sections = PageSection::where('page_id', $page->id)
            ->orderBy('position')
            ->get()
            ->groupBy('group_key')
            ->map(function ($group) {
                return [
                    'type' => $group->first()->section_type,
                    'items' => $group->pluck('content')->toArray(),
                ];
            })
            ->values();

        $mainTab = $page->tabs->first();

        $relatedPages = [];

        if ($mainTab) {
            $relatedPages = Pages::join('tab_pages', 'pages.id', '=', 'tab_pages.page_id')
                ->where('tab_pages.tab_id', $mainTab->id)
                ->select('pages.title as text', 'pages.slug')
                ->get()
                ->map(function ($item) {
                    return [
                        'text' => $item->text,
                        'url' => "/" . $item->slug,
                    ];
                });
        }

        return response()->json([
            "tabs" => [
                "title"     => $mainTab->title ?? null,
                "subTitle"  => $mainTab->subtitle ?? null,
                "tabs"      => $relatedPages
            ],

            "page_title" => $page->title,
            "slug"       => $page->slug,
            "sections"   => $sections
        ]);
    }
}
