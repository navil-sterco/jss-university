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
    public function show($page_id)
    {
        $page = Pages::findOrFail($page_id);
        $sections = PageSection::where('page_id', $page_id)
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

        return response()->json([
            'id' => $page->id,
            'page_name' => $page->title,
            'sections' => $sections,
        ]);
    }

}
