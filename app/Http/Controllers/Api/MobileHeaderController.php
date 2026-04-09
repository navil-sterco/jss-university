<?php

namespace App\Http\Controllers\Api;

use App\Models\Pages;
use App\Models\School;
use App\Models\Department;
use App\Models\MobileHeader;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MobileHeaderController extends Controller
{
    public function header()
    {
        try {
            $menuItems = MobileHeader::with([
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
        $school = $this->getSchool($item);

        return [
            'id' => $item->id,
            'title' => $item->title,
            'url' => $url ?? "#",
            'type' => $item->type,
            'children' => $item->children->map(function ($child) {
                return $this->formatMenuItem($child);
            }),
            'school' => $school ?? null,
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
    private function getSchool($item)
    {
        switch ($item->title) {
            case 'Schools':
                $school = School::select('name','slug')->get();
                return $school;
                
            default:
                return null;
        }
    }
}
