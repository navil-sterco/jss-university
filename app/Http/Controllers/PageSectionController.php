<?php

namespace App\Http\Controllers;

use Log;
use Exception;
use Inertia\Inertia;
use App\Models\Pages;
use App\Models\PageSection;
use App\Models\SectionTemplate;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

class PageSectionController extends Controller
{
    public function index($page_id)
    {
        $page = Pages::findOrFail($page_id);

        $sectionTemplates = $this->getSectionTemplates();

        $sections = PageSection::where('page_id', $page_id)
            ->orderBy('position')
            ->get()
            ->groupBy('group_key')
            ->map(function ($group) {
                $items = $group->map(function ($item) {
                    try {
                        if (is_array($item->content)) {
                            $content = $item->content;
                        } elseif (is_string($item->content)) {
                            $content = json_decode((string) $item->content, true) ?? [];
                        } else {
                            $content = [];
                        }

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
            'sectionTemplates' => $sectionTemplates,
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
        
        // Process new sections
        foreach ($sections as $sIndex => $section) {
            $sectionType = $section['section_name'] ?? null;
            $items = $section['items'] ?? [];
            $groupKey = $section['section_uuid'] ?? Str::uuid()->toString();
            $sectionPosition = $section['position'] ?? ($sIndex + 1);

            if (!$sectionType || empty($items)) continue;

            $allSectionGroups[$groupKey] = $sectionPosition;

            foreach ($items as $iIndex => $item) {
                
                $content = $this->buildContentFromJson($item, $sectionType);
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

        // Process existing sections
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
                        if (is_array($existingItem->content)) {
                            $existingContent = $existingItem->content;
                        } elseif (is_string($existingItem->content)) {
                            $existingContent = json_decode((string) $existingItem->content, true) ?? [];
                        } else {
                            $existingContent = [];
                        }
                        
                        $existingContent['position'] = $itemPosition;
                        
                        // Extract old URLs before we update
                        $oldUrls = $this->extractAllUrls($existingContent);
                        
                        $updatedContent = $this->buildContentFromJson($item, $sectionType);
                        
                        // Extract new URLs after we update
                        $newUrls = $this->extractAllUrls($updatedContent);
                        
                        // Delete any files that were removed
                        $urlsToDelete = array_diff($oldUrls, $newUrls);
                        foreach ($urlsToDelete as $url) {
                            $this->deleteImageFromDisk($url);
                        }
                        
                        $existingItem->update([
                            'position' => $sectionPosition,
                            'content' => $updatedContent
                        ]);
                    }
                } else {
                    $content = $this->buildContentFromJson($item, $sectionType);
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

        // Update section positions
        foreach ($allSectionGroups as $groupKey => $newPosition) {
            PageSection::where('group_key', $groupKey)
                ->update(['position' => $newPosition]);
        }

        return redirect()
            ->route('sections.index', $request->page_id)
            ->with('success', 'Sections saved successfully!');
    }

    private function extractAllUrls(array $data): array
    {
        $urls = [];
        array_walk_recursive($data, function ($value) use (&$urls) {
            if (is_string($value) && filter_var($value, FILTER_VALIDATE_URL)) {
                $urls[] = $value;
            }
        });
        return array_unique($urls);
    }

    private function buildContentFromJson($data, string $type)
    {
        if (is_array($data) && isset($data['base64']) && isset($data['filename'])) {
            return $this->saveBase64File($data['base64'], $type, $data['filename']);
        }

        if (!is_array($data)) {
            return $data;
        }

        $result = [];

        foreach ($data as $key => $value) {
            if (is_array($value)) {
                if (isset($value['base64']) && isset($value['filename'])) {
                    $result[$key] = $this->saveBase64File($value['base64'], $type, $value['filename']);
                } else {
                    $result[$key] = $this->buildContentFromJson($value, $type);
                }
            } else {
                $result[$key] = $value;
            }
        }

        return $result;
    }

    private function saveBase64File($base64Data, $type, $filename)
    {
        if (empty($base64Data) || !str_contains($base64Data, 'base64,')) {
            return null;
        }
        
        try {
            // Extract the base64 data
            $data = explode(',', $base64Data);
            $imageData = base64_decode($data[1]);
            
            if ($imageData === false) {
                return null;
            }
            
            $folder = "assets/img/{$type}/";
            $path = public_path($folder);
            
            if (!File::exists($path)) {
                File::makeDirectory($path, 0755, true);
            }
            
            // Get file extension
            $extension = pathinfo($filename, PATHINFO_EXTENSION);
            if (empty($extension)) {
                // Try to determine from mime type in base64
                $finfo = finfo_open();
                $mimeType = finfo_buffer($finfo, $imageData, FILEINFO_MIME_TYPE);
                finfo_close($finfo);
                
                $extension = explode('/', $mimeType)[1] ?? 'png';
                // Handle common mime types
                $extensionMap = [
                    'image/jpeg' => 'jpg',
                    'image/png' => 'png',
                    'image/gif' => 'gif',
                    'image/webp' => 'webp',
                    'application/pdf' => 'pdf',
                ];
                
                $extension = $extensionMap[$mimeType] ?? $extension;
            }
            
            // Create unique filename
            $safeName = Str::slug(pathinfo($filename, PATHINFO_FILENAME));
            $imageName = time() . '_' . uniqid() . '_' . $safeName . '.' . $extension;
            $filePath = $path . $imageName;
            
            // Save the file
            file_put_contents($filePath, $imageData);
            
            $fileUrl = url($folder . $imageName);
            
            return $fileUrl;
        } catch (\Exception $e) {
            return null;
        }
    }

    private function getSectionTemplates(): array
    {
        if (Schema::hasTable('section_templates') && SectionTemplate::count() > 0) {
            return SectionTemplate::where('is_active', true)
                ->orderBy('key')
                ->get()
                ->mapWithKeys(function ($t) {
                    return [
                        $t->key => [
                            'label' => $t->label,
                            'allow_multiple_items' => (bool) $t->allow_multiple_items,
                            'fields' => $t->fields ?? [],
                        ]
                    ];
                })
                ->toArray();
        }

        $path = resource_path('js/data/sectionTemplates.json');
        if (File::exists($path)) {
            $json = json_decode(File::get($path), true);
            if (is_array($json)) {
                foreach ($json as $k => $def) {
                    if (!isset($json[$k]['allow_multiple_items'])) {
                        $json[$k]['allow_multiple_items'] = $k === 'heading' ? false : true;
                    }
                }
                return $json;
            }
        }

        return [];
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
                // Delete files from repeater fields
                foreach ($content as $key => $value) {
                    if (is_array($value)) {
                        foreach ($value as $row) {
                            if (is_array($row)) {
                                foreach ($row as $subValue) {
                                    if (is_string($subValue) && filter_var($subValue, FILTER_VALIDATE_URL)) {
                                        $this->deleteImageFromDisk($subValue);
                                    }
                                }
                            }
                        }
                    }
                }

                // Delete regular file fields
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
            : (is_string($section->content) ? (json_decode((string) $section->content, true) ?? []) : []);

        if (is_array($content)) {
            // Delete files from repeater fields
            foreach ($content as $key => $value) {
                if (is_array($value)) {
                    foreach ($value as $row) {
                        if (is_array($row)) {
                            foreach ($row as $subValue) {
                                if (is_string($subValue) && filter_var($subValue, FILTER_VALIDATE_URL)) {
                                    $this->deleteImageFromDisk($subValue);
                                }
                            }
                        }
                    }
                }
            }

            // Delete regular file fields
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