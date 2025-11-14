<?php

namespace App\Http\Controllers\Api;

use App\Models\Pages;
use App\Models\School;
use App\Models\Department;
use App\Models\SchoolHeader;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SchoolHeaderController extends Controller
{
    public function header()
    {
        try {
            $menuItems = SchoolHeader::with([
                'children' => function ($query) {
                    $query->orderBy('display_order')->with([
                        'children' => function ($q) {
                            $q->orderBy('display_order');
                        }
                    ]);
                }
            ])
            ->rootItems()
            ->orderBy('display_order')
            ->get()
            ->map(function ($item) {
                return $this->formatMenuItem($item);
            });

            $menuItems->transform(function ($item) {
                $this->addRightSectionToRoot($item);
                return $item;
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

    private function formatMenuItem($item)
    {
        $url = $this->resolveUrl($item);

        return [
            'id' => $item->id,
            'title' => $item->title,
            'url' => $url ?? "#",
            'type' => $item->type,
            'children' => $item->children->map(function ($child) {
                return $this->formatMenuItem($child);
            }),
            'section_title' => $item->section_title,
            'section_subtitle' => $item->section_subtitle,
            'section_description' => $item->section_description,
            'section_button_text' => $item->section_button_text,
            'section_button_url' => $item->section_button_url,
            'boxes' => $item->boxes,
        ];
    }

    private function addRightSectionToRoot(&$menuItem)
    {
        if (
            !empty($menuItem['section_title'])
        ) {
            $menuItem['right'] = [
                'subtitle' => $menuItem['section_subtitle'] ?: '',
                'title' => $menuItem['section_title'] ?: '',
                'desc' => $menuItem['section_description'] ?: '',
                'ctas' => [],
                'banners' => [],
            ];

            if (!empty($menuItem['section_button_text']) && !empty($menuItem['section_button_url'])) {
                $menuItem['right']['ctas'][] = [
                    'text' => $menuItem['section_button_text'],
                    'url' => $menuItem['section_button_url'],
                    'type' => 'primary',
                ];
            }

            $boxes = is_array($menuItem['boxes'])
                ? $menuItem['boxes']
                : json_decode($menuItem['boxes'], true);

            if (is_array($boxes)) {
                foreach ($boxes as $box) {
                    if (!empty($box['title'])) {
                        $menuItem['right']['banners'][] = [
                            'title' => $box['title'],
                            'url' => $box['url'] ?? '#',
                            'img' => asset($box['image']) ?? '/images/header/nav-hover-banner.webp',
                        ];
                    }
                }
            }
        }

        unset(
            $menuItem['section_title'],
            $menuItem['section_subtitle'],
            $menuItem['section_description'],
            $menuItem['section_button_text'],
            $menuItem['section_button_url'],
            $menuItem['boxes']
        );

        if (!empty($menuItem['children'])) {
            foreach ($menuItem['children'] as &$child) {
                $this->removeRightAndSectionFromChildren($child);
            }
        }
    }

    private function removeRightAndSectionFromChildren(&$menuItem)
    {
        unset(
            $menuItem['right'],
            $menuItem['section_title'],
            $menuItem['section_subtitle'],
            $menuItem['section_description'],
            $menuItem['section_button_text'],
            $menuItem['section_button_url'],
            $menuItem['boxes']
        );

        if (!empty($menuItem['children'])) {
            foreach ($menuItem['children'] as &$child) {
                $this->removeRightAndSectionFromChildren($child);
            }
        }
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