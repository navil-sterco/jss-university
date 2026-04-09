<?php

namespace App\Http\Controllers;

use App\Models\Type;
use Inertia\Inertia;
use App\Models\Pages;
use App\Models\Course;
use App\Models\School;
use App\Models\Faculty;
use App\Models\Department;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FacultyController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $faculty = Faculty::with('type')->filter(['search' => $search])->orderBy('display_order', 'asc')->paginate(10)->withQueryString()->through(function ($faculty) {
            $researchData = [];
            if ($faculty->research) {
                $parsedResearch = is_array($faculty->research) ? $faculty->research : json_decode($faculty->research, true);
                if (is_array($parsedResearch)) {
                    $researchData = array_map(function($research) {
                        return [
                            'title' => $research['title'] ?? null,
                            'link' => $research['link'] ?? null,
                            'image' => $research['image'] ? asset($research['image']) : null
                        ];
                    }, $parsedResearch);
                }
            }

            $sectionsData = [];
            if ($faculty->sections) {
                $parsedSections = is_array($faculty->sections) ? $faculty->sections : json_decode($faculty->sections, true);
                if (is_array($parsedSections)) {
                    $sectionsData = array_map(function($section) {
                        return [
                            'title' => $section['title'] ?? null,
                            'points' => $section['points'] ?? []
                        ];
                    }, $parsedSections);
                }
            }

            return [
                'id' => $faculty->id,
                'name' => $faculty->name,
                'school' => $faculty->school->name ?? 'N/A',
                'slug' => $faculty->slug,
                'email' => $faculty->email,
                'profile' => $faculty->profile,
                'image' => $faculty->image ? asset($faculty->image) : asset('assets/img/placeholder.png'),
                'linkedin_url' => $faculty->linkedin_url,
                'type' => $faculty->type->name ?? 'N/A',
                'type_id' => $faculty->type_id,
                'education' => $faculty->education,
                'research' => $researchData,
                'sections' => $sectionsData,
                'teaching' => $faculty->teaching,
                'award' => $faculty->award,
                'social_engagement' => $faculty->social_engagement,
                'display_order' => $faculty->display_order,
                'status' => $faculty->status,
                'created_at' => $faculty->created_at->format('M d, Y'),
                'updated_at' => $faculty->updated_at->format('M d, Y'),
            ];
        });
        
        return Inertia::render('Faculties/Index', [
            'faculty' => $faculty,
            'searchTerm' => $search ?? '',
        ]);
    }

    public function create()
    {
        return Inertia::render('Faculties/Create', [
            'types' => Type::where('element', 'faculty')->get(),
            'schools' => School::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type_id' => 'nullable|exists:types,id',
            'school_id' => 'required|exists:schools,id',
            'name' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:faculties,slug',
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'email' => 'nullable|email|unique:faculties,email',
            'profile' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'linkedin_url' => 'nullable|max:255',
            'education' => 'nullable|array',
            'education.*' => 'nullable|string',
            'research' => 'nullable|array',
            'research.*.title' => 'nullable|string|max:255',
            'research.*.link' => 'nullable|url|max:500',
            'research.*.image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'teaching' => 'nullable|array',
            'teaching.*' => 'nullable|string',
            'award' => 'nullable|array',
            'award.*' => 'nullable|string',
            'social_engagement' => 'nullable|array',
            'social_engagement.*' => 'nullable|string',
            'sections' => 'nullable|array',
            'sections.*.title' => 'nullable|string|max:255',
            'sections.*.points' => 'nullable|array',
            'sections.*.points.*' => 'nullable|string',
            'display_order' => 'nullable|integer',
            'status' => 'nullable|boolean',
        ]);

        // Filter empty fields
        $validated['education'] = array_filter($validated['education'] ?? []);
        $validated['teaching'] = array_filter($validated['teaching'] ?? []);
        $validated['award'] = array_filter($validated['award'] ?? []);
        $validated['social_engagement'] = array_filter($validated['social_engagement'] ?? []);
        $validated['status'] = $validated['status'] ?? true;
        
        // Handle slug generation
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);

            if (Faculty::where('slug', $validated['slug'])->exists()) {
                return back()
                    ->withErrors(['slug' => 'The generated slug already exists. Please enter a unique slug.'])
                    ->withInput();
            }
        }

        // Handle main profile image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/faculty/'), $imageName);
            $validated['image'] = 'assets/img/faculty/' . $imageName;
        }

        // Handle research images
        if ($request->has('research') && is_array($validated['research'])) {
            foreach ($validated['research'] as $index => &$research) {
                // Handle research image upload
                if ($request->hasFile("research.{$index}.image")) {
                    $researchImage = $request->file("research.{$index}.image");
                    $researchImageName = time() . '_research_' . $index . '_' . uniqid() . '.' . $researchImage->getClientOriginalExtension();
                    $researchImage->move(public_path('assets/img/faculty/research/'), $researchImageName);
                    $research['image'] = 'assets/img/faculty/research/' . $researchImageName;
                } else {
                    $research['image'] = null;
                }
            }
        }

        // Convert research array to JSON for storage
        if (isset($validated['research'])) {
            $validated['research'] = json_encode($validated['research']);
        }

        // Convert other arrays to JSON
        $validated['education'] = !empty($validated['education']) ? json_encode($validated['education']) : null;
        $validated['teaching'] = !empty($validated['teaching']) ? json_encode($validated['teaching']) : null;
        $validated['award'] = !empty($validated['award']) ? json_encode($validated['award']) : null;
        $validated['social_engagement'] = !empty($validated['social_engagement']) ? json_encode($validated['social_engagement']) : null;

        if (!empty($validated['sections'])) {
            $validated['sections'] = $this->processSections($validated['sections']);
        }

        Faculty::create($validated);

        return redirect()->route('faculty.index')->with('success', 'Faculty/Staff created successfully!');
    }

    public function edit(Faculty $faculty)
    {
        $types = Type::where('element', 'faculty')->get();
        $schools = School::select('id', 'name')->get();
        
        return Inertia::render('Faculties/Edit', [
            'faculty' => $faculty,
            'types' => $types,
            'schools' => $schools,
        ]);
    }

    public function update(Request $request, Faculty $faculty)
    {
        $validated = $request->validate([
            'type_id' => 'nullable|exists:types,id',
            'school_id' => 'required|exists:schools,id',
            'name' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:faculties,slug,' . $faculty->id,
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'email' => 'nullable|email|unique:faculties,email,' . $faculty->id,
            'profile' => 'nullable|string',
            'linkedin_url' => 'nullable|max:255',
            'education' => 'nullable|array',
            'education.*' => 'nullable|string',
            'research' => 'nullable|array',
            'research.*.title' => 'nullable|string|max:255',
            'research.*.link' => 'nullable|url|max:500',
            'teaching' => 'nullable|array',
            'teaching.*' => 'nullable|string',
            'award' => 'nullable|array',
            'award.*' => 'nullable|string',
            'social_engagement' => 'nullable|array',
            'social_engagement.*' => 'nullable|string',
            'sections' => 'nullable|array',
            'sections.*.title' => 'nullable|string|max:255',
            'sections.*.points' => 'nullable|array',
            'sections.*.points.*' => 'nullable|string',
            'display_order' => 'nullable|integer',
            'status' => 'nullable|boolean',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // Validate research images only when they are actually uploaded files
        if ($request->has('research')) {
            foreach ($request->input('research') as $index => $research) {
                if ($request->hasFile("research.{$index}.image")) {
                    $request->validate([
                        "research.{$index}.image" => 'image|mimes:jpg,jpeg,png,webp|max:2048',
                    ]);
                }
            }
        }

        try {
            // Handle slug generation
            if (empty($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['name']);

                $exists = Faculty::where('slug', $validated['slug'])
                    ->where('id', '!=', $faculty->id)
                    ->exists();

                if ($exists) {
                    return back()
                        ->withErrors(['slug' => 'The generated slug already exists. Please enter a unique slug.'])
                        ->withInput();
                }
            }

            // Filter empty fields
            $validated['education'] = array_filter($validated['education'] ?? []);
            $validated['teaching'] = array_filter($validated['teaching'] ?? []);
            $validated['award'] = array_filter($validated['award'] ?? []);
            $validated['social_engagement'] = array_filter($validated['social_engagement'] ?? []);
            $validated['status'] = $validated['status'] ?? true;

            // Handle main profile image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($faculty->image && file_exists(public_path($faculty->image))) {
                    unlink(public_path($faculty->image));
                }

                $image = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('assets/img/faculty/'), $imageName);
                $validated['image'] = 'assets/img/faculty/' . $imageName;
            } else {
                // Keep existing image
                $validated['image'] = $faculty->image;
            }

            // Handle research data
            $researchData = [];
            if ($request->has('research') && is_array($validated['research'])) {
                // Get existing research data to preserve images
                $existingResearch = $faculty->research ? 
                    (is_string($faculty->research) ? json_decode($faculty->research, true) : $faculty->research) 
                    : [];

                foreach ($validated['research'] as $index => $research) {
                    $researchItem = [
                        'title' => $research['title'] ?? '',
                        'link' => $research['link'] ?? '',
                        'image' => $existingResearch[$index]['image'] ?? null // Preserve existing image
                    ];

                    // Handle research image upload - only if a file was actually uploaded
                    if ($request->hasFile("research.{$index}.image") && $request->file("research.{$index}.image")->isValid()) {
                        // Delete old research image if exists
                        if (isset($existingResearch[$index]['image']) && 
                            $existingResearch[$index]['image'] && 
                            file_exists(public_path($existingResearch[$index]['image']))) {
                            unlink(public_path($existingResearch[$index]['image']));
                        }

                        $researchImage = $request->file("research.{$index}.image");
                        $researchImageName = time() . '_research_' . $index . '_' . uniqid() . '.' . $researchImage->getClientOriginalExtension();
                        $researchImage->move(public_path('assets/img/faculty/research/'), $researchImageName);
                        $researchItem['image'] = 'assets/img/faculty/research/' . $researchImageName;
                    }

                    // Only add research item if it has a title
                    if (!empty($researchItem['title'])) {
                        $researchData[] = $researchItem;
                    }
                }
            }

            // Convert arrays to JSON for storage
            $validated['research'] = !empty($researchData) ? json_encode($researchData) : null;
            $validated['education'] = !empty($validated['education']) ? json_encode($validated['education']) : null;
            $validated['teaching'] = !empty($validated['teaching']) ? json_encode($validated['teaching']) : null;
            $validated['award'] = !empty($validated['award']) ? json_encode($validated['award']) : null;
            $validated['social_engagement'] = !empty($validated['social_engagement']) ? json_encode($validated['social_engagement']) : null;
            
            if (!empty($validated['sections'])) {
                $validated['sections'] = $this->processSections($validated['sections']);
            }

            $faculty->update($validated);

            return redirect()->route('faculty.index')->with('success', 'Faculty/Staff updated successfully!');

        } catch (\Exception $e) {
            return back()
                ->with('error', 'Failed to update faculty/staff: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function destroy(Faculty $faculty)
    {
        $faculty->schools()->detach();
        $faculty->pages()->detach();
        $faculty->departments()->detach();
        $faculty->courses()->detach();

        $faculty->delete();

        return redirect()->route('faculty.index')->with('success', 'Faculty/Staff deleted successfully!');
    }

    public function duplicate($id)
    {
        $faculty = Faculty::with(['schools', 'pages', 'departments', 'courses'])->findOrFail($id);

        DB::beginTransaction();
        try {
            // Replicate basic attributes
            $new = $faculty->replicate();
            $new->name = 'Copy of ' . $faculty->name;

            // Generate unique slug
            $baseSlug = Str::slug($new->name);
            $slug = $baseSlug;
            $i = 1;
            while (Faculty::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-copy' . $i++;
            }
            $new->slug = $slug;

            // Preserve email but ensure uniqueness (append +copyN before @ if needed)
            $newEmail = $faculty->email;
            if ($newEmail) {
                $base = $newEmail;
                $i = 1;
                while (Faculty::where('email', $newEmail)->exists()) {
                    // insert +copyN before @ if email contains @, otherwise append -copyN
                    if (strpos($base, '@') !== false) {
                        [$local, $domain] = explode('@', $base, 2);
                        $newEmail = $local . '+copy' . $i++ . '@' . $domain;
                    } else {
                        $newEmail = $base . '-copy' . $i++;
                    }
                }
            }
            $new->email = $newEmail;

            // Keep same image path (do not duplicate actual file)
            $new->image = $faculty->image;

            // Preserve research JSON as-is (do not copy research images)
            $new->research = $faculty->research;

            $new->save();

            // Duplicate relationships
            $new->schools()->sync($faculty->schools->pluck('id')->toArray());
            $new->pages()->sync($faculty->pages->pluck('id')->toArray());
            $new->departments()->sync($faculty->departments->pluck('id')->toArray());
            $new->courses()->sync($faculty->courses->pluck('id')->toArray());

            DB::commit();

            return redirect()->route('faculty.index')->with('success', 'Faculty duplicated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to duplicate faculty/staff: ' . $e->getMessage());
        }
    }

    public function toggleStatus($id)
    {
        $faculty = Faculty::findOrFail($id);
        $faculty->status = !$faculty->status;
        $faculty->save();

        return redirect()->route('faculty.index')->with('success', 'Faculty Status Updated!');
    }

    public function mapping($id)
    {
        $faculties = Faculty::with(['schools:id,name', 'pages:id,title', 'departments:id,name', 'courses:id,name'])->findOrFail($id);
        $schools = School::select('id', 'name')->get();
        $pages = Pages::select('id', 'title')->get();
        $departments = Department::with('school:id,name')->get()->map(function ($department) {
            return [
                'id' => $department->id,
                'name' => $department->name,
                'school' => $department->school ? $department->school->name : null,
            ];
        });
        $courses = Course::select('id', 'name')->get();

        return Inertia::render('Faculties/Mapping', [
            'faculties' => $faculties,
            'schools' => $schools,
            'pages' => $pages,
            'departments' => $departments,
            'courses' => $courses,
        ]);
    }

    public function attachMapping(Request $request, $id)
    {
        $faculties = Faculty::findOrFail($id);

        $validated = $request->validate([
            'school_ids' => 'nullable|array',
            'school_ids.*' => 'exists:schools,id',
            'page_ids' => 'nullable|array',
            'page_ids.*' => 'exists:pages,id',
            'department_ids' => 'nullable|array',
            'department_ids.*' => 'exists:departments,id',
            'course_ids' => 'nullable|array',
            'course_ids.*' => 'exists:courses,id',
        ]);

        $faculties->schools()->sync($validated['school_ids'] ?? []);
        $faculties->pages()->sync($validated['page_ids'] ?? []);
        $faculties->departments()->sync($validated['department_ids'] ?? []);
        $faculties->courses()->sync($validated['course_ids'] ?? []);

        return redirect()->route('faculty.index', $faculties->id)->with('success', 'Faculty mapped successfully!');
    }

    private function processSections($sections)
    {
        $processedSections = [];

        foreach ($sections as $section) {
            if (empty(trim($section['title']))) {
                continue;
            }

            $points = array_filter($section['points'] ?? [], function ($point) {
                return !empty(trim($point));
            });

            if (!empty(trim($section['title'])) || !empty($points)) {
                $processedSections[] = [
                    'title' => trim($section['title']),
                    'points' => array_values($points)
                ];
            }
        }

        return $processedSections;
    }
}
