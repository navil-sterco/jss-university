<?php

namespace App\Http\Controllers\Api;

use App\Models\Pages;
use App\Models\Hamburger;
use App\Models\School;
use App\Models\Department;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class HamburgerController extends Controller
{
    public function hamburger()
    {
        try {
            $menuItems = Hamburger::with([
                'children' => function ($query) {
                    $query->orderBy('display_order')->with([
                        'children' => function ($q) {
                            $q->orderBy('display_order');
                        }
                    ]);
                }
            ])
            ->whereNull('parent_id')
            ->orderBy('display_order')
            ->get()
            ->map(function ($item) {
                return $this->formatMenuItem($item, true); // true for root items
            });

            return response()->json([
                'success' => true,
                'data' => $menuItems,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch header menu',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function formatMenuItem($item, $isRoot = false)
    {
        $url = $this->resolveUrl($item);

        $formattedItem = [
            'id' => $item->id,
            'title' => $item->title,
            'url' => $url ?? "#",
            'type' => $item->type,
            'children' => $item->children->map(function ($child) {
                return $this->formatMenuItem($child, false); // false for child items
            }),
        ];

        // Only include section data for root level items
        if ($isRoot) {
            $formattedItem['right'] = $this->formatSectionData($item);
        }

        return $formattedItem;
    }

    private function formatSectionData($item)
    {
        // Check if we have any section data
        if (
            empty($item->section_title) &&
            empty($item->section_subtitle) &&
            empty($item->link) &&
            empty($item->section_heading_first) &&
            empty($item->section_subheading_first) &&
            empty($item->section_image_first) &&
            empty($item->section_title_second) &&
            empty($item->section_subtitle_second) &&
            empty($item->section_heading_second) &&
            empty($item->section_subheading_second) &&
            empty($item->section_image_second) &&
            empty($item->section_video_url)
        ) {
            return null;
        }

        return [
            'first_section' => [
                'title' => $item->section_title ?? '',
                'subtitle' => $item->section_subtitle ?? '',
                'link' => $item->link ?? '',
                'heading' => $item->section_heading_first ?? '',
                'subheading' => $item->section_subheading_first ?? '',
                'image' => $item->section_image_first ? asset($item->section_image_first) : null,
            ],
            'second_section' => [
                'title' => $item->section_title_second ?? '',
                'subtitle' => $item->section_subtitle_second ?? '',
                'heading' => $item->section_heading_second ?? '',
                'subheading' => $item->section_subheading_second ?? '',
                'image' => $item->section_image_second ? asset($item->section_image_second) : null,
            ],
            'video_section' => [
                'video_url' => $item->section_video_url ?? '',
            ]
        ];
    }

    private function resolveUrl($item)
    {
        switch ($item->type) {
            case 'school':
                $school = School::select('slug')->where('id', $item->reference_id)->first();
                return $school ? '/schools/' . $school->slug : '#';
                
            case 'department':
                $department = Department::select('slug')->where('id', $item->reference_id)->first();
                return $department ? '/departments/' . $department->slug : '#';
                
            case 'page':
                $page = Pages::select('slug')->where('id', $item->reference_id)->first();
                return $page ? '/pages/' . $page->slug : '#';
                
            case 'custom':
                return $item->url ?? '#';
                
            default:
                return $item->url ?? '#';
        }
    }
}