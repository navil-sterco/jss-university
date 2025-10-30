<?php

namespace App\Http\Controllers;

use Log;
use Exception;
use Inertia\Inertia;
use App\Models\Pages;
use App\Models\PageSection;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;

class PageSectionController extends Controller
{
    public function index($page_id)
    {
        $page = Pages::findOrFail($page_id);

        $sections = PageSection::where('page_id', $page_id)
            ->orderBy('position')
            ->get()
            ->groupBy('group_key')
            ->map(function ($group) {
                $items = $group->map(function ($item) {
                    try {
                        $content = is_array($item->content)
                            ? $item->content
                            : json_decode($item->content, true) ?? [];

                        $content['id'] = $item->id;
                        
                        if (!isset($content['position']) || !is_numeric($content['position'])) {
                            $content['position'] = 999;
                        }
                        
                        return $content;
                    } catch (\Exception $e) {
                        return [
                            'id' => $item->id,
                            'position' => 999,
                            'error' => 'Invalid content format'
                        ];
                    }
                });
                
                $sortedItems = $items->sortBy('position')->values()->toArray();

                return [
                    'group_key' => $group->first()->group_key,
                    'type' => $group->first()->section_type,
                    'items' => $sortedItems,
                ];
            })
            ->values();

        return Inertia::render('Pages/Section', [
            'page' => $page,
            'existingSections' => $sections,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'page_id' => 'required|exists:pages,id',
        ]);

        $sections = $request->input('sections', []);
        $existing = $request->input('existing', []);

        $allSectionGroups = [];
        
        foreach ($sections as $sIndex => $section) {
            $sectionType = $section['section_name'] ?? null;
            $items = $section['items'] ?? [];
            $groupKey = $section['section_uuid'] ?? Str::uuid()->toString();
            $sectionPosition = $section['position'] ?? ($sIndex + 1);

            if (!$sectionType || empty($items)) continue;

            $allSectionGroups[$groupKey] = $sectionPosition;

            foreach ($items as $iIndex => $item) {
                $content = $this->buildContent($request, $item, $sectionType, $sIndex, $iIndex);
                $itemPosition = $item['position'] ?? ($iIndex + 1);

                $content['position'] = $itemPosition;

                PageSection::create([
                    'page_id' => $request->page_id,
                    'group_key' => $groupKey,
                    'section_type' => $sectionType,
                    'content' => $content,
                    'position' => $sectionPosition,
                ]);
            }
        }

        foreach ($existing as $sIndex => $section) {
            $sectionType = $section['section_name'] ?? null;
            $groupKey = $section['group_key'] ?? null;
            $items = $section['items'] ?? [];
            $sectionPosition = $section['position'] ?? ($sIndex + 1);

            if (!$sectionType || !$groupKey) continue;

            $allSectionGroups[$groupKey] = $sectionPosition;

            foreach ($items as $iIndex => $item) {
                $itemPosition = $item['position'] ?? ($iIndex + 1);
                
                if (isset($item['id'])) {
                    $existingItem = PageSection::where('id', $item['id'])->first();
                    if ($existingItem) {
                        $existingContent = is_array($existingItem->content) 
                            ? $existingItem->content 
                            : json_decode($existingItem->content, true);
                        
                        $existingContent['position'] = $itemPosition;
                        
                        $updatedContent = $this->buildContent($request, $item, $sectionType, $sIndex, $iIndex, true, $existingContent);
                        
                        $existingItem->update([
                            'position' => $sectionPosition,
                            'content' => $updatedContent
                        ]);
                    }
                } else {
                    $content = $this->buildContent($request, $item, $sectionType, $sIndex, $iIndex, true);
                    $itemPosition = $item['position'] ?? ($iIndex + 1);

                    $content['position'] = $itemPosition;

                    PageSection::create([
                        'page_id' => $request->page_id,
                        'group_key' => $groupKey,
                        'section_type' => $sectionType,
                        'content' => $content,
                        'position' => $sectionPosition,
                    ]);
                }
            }
        }

        foreach ($allSectionGroups as $groupKey => $newPosition) {
            PageSection::where('group_key', $groupKey)
                ->update(['position' => $newPosition]);
        }

        return redirect()
            ->route('sections.index', $request->page_id)
            ->with('success', 'Sections saved successfully!');
    }

    private function buildContent(Request $request, array $item, string $type, int $sIndex, int $iIndex, bool $isExisting = false, array $existingContent = [])
    {
        $content = $existingContent ?: [];

        foreach ($item as $field => $value) {
            if (!is_array($value) && !$value instanceof \Illuminate\Http\UploadedFile) {
                $content[$field] = $value;
            }
        }

        $fileFields = ['file', 'file_mobile', 'video', 'icon', 'photo'];

        $basePath = $isExisting
            ? "existing.{$sIndex}.items.{$iIndex}"
            : "sections.{$sIndex}.items.{$iIndex}";

        foreach ($fileFields as $field) {
            $file = $request->file("{$basePath}.{$field}");

            if ($file instanceof \Illuminate\Http\UploadedFile) {
                if (!empty($content[$field]) && !empty($existingContent)) {
                    $this->deleteImageFromDisk($content[$field]);
                }
                
                $content[$field] = $this->moveImage($file, $type);
            } elseif (is_array($file)) {
                $oldFiles = $content[$field] ?? [];
                if (is_array($oldFiles) && !empty($existingContent)) {
                    foreach ($oldFiles as $oldFile) {
                        $this->deleteImageFromDisk($oldFile);
                    }
                }
                
                $content[$field] = array_map(fn($f) => $this->moveImage($f, $type), $file);
            } elseif (empty($content[$field]) && isset($existingContent[$field])) {
                $content[$field] = $existingContent[$field];
            }
        }

        return $content;
    }



    private function moveImage(UploadedFile $file, string $type)
    {
        $folder = "assets/img/{$type}/";
        $path = public_path($folder);

        if (!File::exists($path)) {
            File::makeDirectory($path, 0755, true);
        }

        $imageName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $file->move($path, $imageName);
        return url($folder . $imageName);
    }

    public function deleteSection($group_key)
    {
        $sections = PageSection::where('group_key', $group_key)->get();

        if ($sections->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Section not found!',
            ], 404);
        }

        foreach ($sections as $section) {
            $content = $section->content;

            if (is_string($content)) {
                $content = json_decode($content, true);
            }

            if (is_array($content)) {
                $fileFields = ['file', 'file_mobile','video','icon','photo'];

                foreach ($fileFields as $field) {
                    if (!empty($content[$field])) {
                        $images = is_array($content[$field]) ? $content[$field] : [$content[$field]];
                        

                        foreach ($images as $imageUrl) {
                            $this->deleteImageFromDisk($imageUrl);
                        }
                    }
                }
            }

            $section->delete();
        }

        return back()->with('success', 'Section Deleted successfully!');
    }

    private function deleteImageFromDisk(string $imageUrl): void
    {
        try {
            $publicPath = public_path();
            $relativePath = str_replace(url('/'), '', $imageUrl);
            $fullPath = $publicPath . $relativePath;

            if (file_exists($fullPath) && str_starts_with($fullPath, $publicPath)) {
                @unlink($fullPath);
            }
        } catch (\Exception $e) {
            Log::warning('Failed to delete image: ' . $imageUrl . ' — ' . $e->getMessage());
        }
    }

    public function deleteItem($id)
    {
        $section = PageSection::find($id);

        if (!$section) {
            return response()->json([
                'success' => false,
                'message' => 'Item not found!',
            ], 404);
        }

        $content = is_array($section->content)
            ? $section->content
            : json_decode($section->content, true);

        if (is_array($content)) {
            $fileFields = ['file', 'file_mobile', 'video', 'icon', 'photo'];

            foreach ($fileFields as $field) {
                if (!empty($content[$field])) {
                    $images = is_array($content[$field]) ? $content[$field] : [$content[$field]];

                    foreach ($images as $imageUrl) {
                        $this->deleteImageFromDisk($imageUrl);
                    }
                }
            }
        }
        $section->delete();

        return back()->with('success', 'Item Deleted successfully!');
    }
}