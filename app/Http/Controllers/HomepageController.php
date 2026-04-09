<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Homepage;
use Illuminate\Http\Request;

class HomepageController extends Controller
{
    public function createSections()
    {
        $homepage = Homepage::first();

        if (!$homepage) {
            $homepage = Homepage::create([
                'name' => 'Main Homepage',
                'menu_name' => 'Home'
            ]);
        }

        return Inertia::render('Homepage/CreateOrUpdateSections', [
            'homepage' => $homepage,
        ]);
    }

    public function storeOrUpdate(Request $request)
    {
        $homepage = Homepage::first();

        if (!$homepage) {
            return redirect()->back()->with('error', 'Homepage not found.');
        }

        // Base validation rules
        $rules = [
            // About Section
            'about_title' => 'nullable|string|max:255',
            'about_subtitle' => 'nullable|string|max:255',
            'about_description' => 'nullable|string',
            'about_url' => 'nullable|url|max:255',
            'about_chancellor_title' => 'nullable|string|max:255',
            'about_chancellor_name' => 'nullable|string|max:255',
            'about_chancellor_video_url' => 'nullable|url|max:255',
            
            // Facilities Section
            'facilities_heading' => 'nullable|string|max:255',
            'facilities_subheading' => 'nullable|string|max:255',

            // Department Section
            'department_title' => 'nullable|string|max:255',
            'department_subtitle' => 'nullable|string|max:255',
            'programs_title' => 'nullable|string|max:255',
            'department_programs_count' => 'nullable|string|max:255',
            'department_programs_text' => 'nullable|string|max:255',
            'department_button_1_text' => 'nullable|string|max:255',
            'department_button_1_url' => 'nullable|url|max:255',
            'department_academic_year' => 'nullable|string|max:255',
            'department_academic_year_desc' => 'nullable|string|max:255',

            // Placement Section
            'placement_title' => 'nullable|string|max:255',
            'placement_subtitle' => 'nullable|string|max:255',
            'hall_of_fame_heading' => 'nullable|string|max:255',
            'hall_of_fame_url' => 'nullable|url|max:255',

            // Testimonial Section
            'testimonial_title' => 'nullable|string|max:255',
            'testimonial_subtitle' => 'nullable|string|max:255',

            // Happening Section
            'happening_title' => 'nullable|string|max:255',
            'happening_subtitle' => 'nullable|string|max:255',
        ];

        // Add validation for array fields
        $arrayRules = [
            'highlights' => 'nullable|array',
            'highlights.*.rank' => 'nullable|string|max:255',
            'highlights.*.text' => 'nullable|string|max:255',
            
            'buttons' => 'nullable|array',
            'buttons.*.text' => 'nullable|string|max:255',
            'buttons.*.url' => 'nullable|url|max:255',
            
            'logo_content' => 'nullable|array',
            'logo_content.*.description' => 'nullable|string|max:255',

            'facilities' => 'nullable|array',
            'facilities.*.title' => 'nullable|string|max:255',
            'facilities.*.description' => 'nullable|string',
            'facilities.*.main_link' => 'nullable|max:255',
            'facilities.*.links' => 'nullable|array',
            'facilities.*.links.*.text' => 'nullable|string|max:255',
            'facilities.*.links.*.url' => 'nullable|max:255',
        ];

        $rules = array_merge($rules, $arrayRules);

        // Conditionally validate main images only if uploaded
        if ($request->hasFile('about_chancellor_img')) {
            $rules['about_chancellor_img'] = 'image|mimes:jpg,jpeg,png,webp|max:2000';
        }

        if ($request->hasFile('about_video')) {
            $rules['about_video'] = 'mimes:mp4,webm,ogg|max:51200';
        }

        if ($request->hasFile('hall_of_fame_image')) {
            $rules['hall_of_fame_image'] = 'image|mimes:jpg,jpeg,png,webp|max:2000';
        }

        // Add validation for highlight image files
        $highlightFiles = $request->allFiles();
        foreach ($highlightFiles as $key => $file) {
            if (preg_match('/^highlights\[\d+\]\[source\]$/', $key)) {
                $rules[$key] = 'image|mimes:jpg,jpeg,png,webp|max:2000';
            }
        }

        $validated = $request->validate($rules);

        // Handle main file uploads
        $fileFields = [
            'about_chancellor_img' => ['path' => 'assets/img/homepage/about/'],
            'hall_of_fame_image' => ['path' => 'assets/img/homepage/placement/'],
            'about_video' => ['path' => 'assets/video/homepage/about/'],
        ];

        foreach ($fileFields as $field => $config) {
            if ($request->input($field) === 'null') {
                if (!empty($homepage->$field) && file_exists(public_path($homepage->$field))) {
                    @unlink(public_path($homepage->$field));
                }
                $validated[$field] = null;
            } elseif ($request->hasFile($field)) {
                // Delete old file if it exists
                if (!empty($homepage->$field) && file_exists(public_path($homepage->$field))) {
                    @unlink(public_path($homepage->$field));
                }

                // Upload new file
                $file = $request->file($field);
                $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path($config['path']), $fileName);
                $validated[$field] = $config['path'] . $fileName;
            }
        }

        // Process arrays with file handling
        $validated['highlights'] = $this->processHighlights($request, $homepage);
        $validated['buttons'] = $request->input('buttons', []);
        $validated['logo_content'] = $this->processLogoContent($request, $homepage);
        $validated['facilities'] = $this->processFacilities($request, $homepage);

        // Update homepage
        $homepage->update($validated);

        return redirect()->back()->with('success', 'Homepage sections updated successfully.');
    }

    /**
     * Process logo content with image uploads
     */
    private function processLogoContent(Request $request, $homepage)
    {
        $logoContent = [];
        $existingLogoContent = $homepage->logo_content ?? [];

        // Get logo content from request (already an array from Inertia)
        $logoContentData = $request->input('logo_content', []);
        
        foreach ($logoContentData as $index => $logoItem) {
            $processedItem = [
                'description' => $logoItem['description'] ?? '',
            ];

            // Handle logo image upload
            $fileKey = "logo_content.{$index}.image";
            if ($request->hasFile($fileKey)) {
                $file = $request->file($fileKey);
                
                // Delete old file if exists in existing data
                if (isset($existingLogoContent[$index]['image']) && 
                    !empty($existingLogoContent[$index]['image']) && 
                    file_exists(public_path($existingLogoContent[$index]['image']))) {
                    unlink(public_path($existingLogoContent[$index]['image']));
                }

                // Upload new file
                $fileName = time() . '_logo_' . $index . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('assets/img/homepage/logo/'), $fileName);
                $processedItem['image'] = 'assets/img/homepage/logo/' . $fileName;
            } else {
                // Keep existing image if no new file uploaded
                $processedItem['image'] = $existingLogoContent[$index]['image'] ?? null;
            }

            if (!empty($processedItem['description']) || !empty($processedItem['image'])) {
                $logoContent[] = $processedItem;
            }
        }

        return $logoContent;
    }

    /**
 * Process highlights with image uploads
 */
    private function processHighlights(Request $request, $homepage)
    {
        $highlights = [];
        $existingHighlights = $homepage->highlights ?? [];

        // Get highlights data from request
        $highlightsData = $request->input('highlights', []);
        
        foreach ($highlightsData as $index => $highlightData) {
            $highlight = [
                'rank' => $highlightData['rank'] ?? '',
                'text' => $highlightData['text'] ?? '',
                'source' => $existingHighlights[$index]['source'] ?? null,
            ];

            // Handle highlight source image upload
            $fileKey = "highlights.{$index}.source";
            if ($request->hasFile($fileKey)) {
                $file = $request->file($fileKey);
                
                // Delete old file if exists in existing data
                if (isset($existingHighlights[$index]['source']) && 
                    !empty($existingHighlights[$index]['source']) && 
                    file_exists(public_path($existingHighlights[$index]['source']))) {
                    unlink(public_path($existingHighlights[$index]['source']));
                }

                // Upload new file
                $fileName = time() . '_highlight_' . $index . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('assets/img/homepage/highlights/'), $fileName);
                $highlight['source'] = 'assets/img/homepage/highlights/' . $fileName;
            }

            // Only add highlight if it has some content
            if (!empty($highlight['rank']) || !empty($highlight['text']) || !empty($highlight['source'])) {
                $highlights[] = $highlight;
            }
        }

        return $highlights;
    }

    /**
     * Process facilities with image uploads and nested links
     */
    private function processFacilities(Request $request, $homepage)
    {
        $facilities = [];
        $existingFacilities = $homepage->facilities ?? [];

        // Process facilities from form data (array format from Inertia)
        $facilitiesData = $request->input('facilities', []);
        
        foreach ($facilitiesData as $index => $facilityData) {
            $facility = [
                'title' => $facilityData['title'] ?? '',
                'description' => $facilityData['description'] ?? '',
                'main_link' => $facilityData['main_link'] ?? '',
                'links' => $facilityData['links'] ?? [],
            ];

            // Handle facility image upload
            $fileKey = "facilities.{$index}.image";
            if ($request->hasFile($fileKey)) {
                $file = $request->file($fileKey);
                
                // Delete old file if exists in existing data
                if (isset($existingFacilities[$index]['image']) && 
                    !empty($existingFacilities[$index]['image']) && 
                    file_exists(public_path($existingFacilities[$index]['image']))) {
                    unlink(public_path($existingFacilities[$index]['image']));
                }

                // Upload new file
                $fileName = time() . '_facility_' . $index . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('assets/img/homepage/facilities/'), $fileName);
                $facility['image'] = 'assets/img/homepage/facilities/' . $fileName;
            } else {
                // Keep existing image if no new file uploaded
                $facility['image'] = $existingFacilities[$index]['image'] ?? null;
            }

            // Clean up empty links
            if (is_array($facility['links'])) {
                $facility['links'] = array_filter($facility['links'], function($link) {
                    return !empty($link['text']) || !empty($link['url']);
                });
                $facility['links'] = array_values($facility['links']);
            } else {
                $facility['links'] = [];
            }

            // Only add facility if it has some content
            if (!empty($facility['title']) || !empty($facility['description']) || !empty($facility['main_link']) || !empty($facility['image']) || !empty($facility['links'])) {
                $facilities[] = $facility;
            }
        }

        return $facilities;
    }

    /**
     * Delete homepage with all associated files
     */
    public function destroy(Homepage $homepage)
    {
        try {
            // Define all file fields that need to be unlinked
            $fileFields = [
                'about_chancellor_img',
                'hall_of_fame_image',
                'about_video'
            ];

            // Delete main files
            foreach ($fileFields as $field) {
                if (!empty($homepage->$field) && file_exists(public_path($homepage->$field))) {
                    unlink(public_path($homepage->$field));
                }
            }

            // Delete logo content images
            if (!empty($homepage->logo_content)) {
                foreach ($homepage->logo_content as $logoItem) {
                    if (!empty($logoItem['image']) && file_exists(public_path($logoItem['image']))) {
                        unlink(public_path($logoItem['image']));
                    }
                }
            }

            // Delete facility images
            if (!empty($homepage->facilities)) {
                foreach ($homepage->facilities as $facility) {
                    if (!empty($facility['image']) && file_exists(public_path($facility['image']))) {
                        unlink(public_path($facility['image']));
                    }
                }
            }

            // Delete the homepage record
            $homepage->delete();

            return redirect()->route('home')->with('success', 'Homepage deleted successfully!');
            
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error deleting homepage: ' . $e->getMessage());
        }
    }
}
