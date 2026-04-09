<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Department;
use App\Models\Pages;
use App\Models\PageSection;
use App\Models\School;
use App\Models\Tab;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PagesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        $pages = Pages::filter(['search' => $search])->orderBy('id', 'desc')->paginate(10)->withQueryString()->through(function ($page) {
            return [
                'id' => $page->id,
                'title' => $page->title,
                'type' => $page->type,
                'image' => $page->image ? asset($page->image) : asset('assets/img/placeholder.png'),
                'slug' => $page->slug,
                'target_blank' => $page->target_blank,
                'status' => $page->status,
                'display_order' => $page->display_order,
                'created_date' => $page->created_at->format('Y-m-d'),
            ];
        });

        return Inertia::render('Pages/Index', [
            'pages' => $pages,
            'searchTerm' => $search ?? '',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::select('id', 'name')->get();
        $schools = School::select('id', 'name', 'slug')->get();
        return Inertia::render('Pages/Create', [
            'departments' => $departments,
            'schools' => $schools,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'slug' => [
                'nullable',
                'string',
                'max:255',
                'unique:pages,slug',
                'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
            ],
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'sub_title' => 'nullable|string|max:255',
            'target_blank' => 'required|boolean',
            'publish_date' => 'required|date',
            'display_order' => 'required',
            'school_id' => 'nullable|exists:schools,id',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        // If school is selected, prepend school slug (school wins over department)
        if (!empty($validated['school_id'])) {
            $school = School::findOrFail($validated['school_id']);
            $slug = $validated['slug'];

            // Remove any existing school slug prefix from any school
            foreach (School::all() as $s) {
                $schoolPrefix = $s->slug . '/';
                if (str_starts_with($slug, $schoolPrefix)) {
                    $slug = substr($slug, strlen($schoolPrefix));
                    break;
                }
            }

            $validated['slug'] = $school->slug . '/' . $slug;
            $validated['department_id'] = null; // Clear department if school is selected
        } elseif (!empty($validated['department_id']) && $validated['type'] === 'Content-Page') {
            // clear school if department chosen
            $validated['school_id'] = null;

            $dept = Department::findOrFail($validated['department_id']);
            $slug = $validated['slug'];
            foreach (Department::all() as $d) {
                $deptPrefix = $d->slug . '/';
                if (str_starts_with($slug, $deptPrefix)) {
                    $slug = substr($slug, strlen($deptPrefix));
                    break;
                }
            }
            $validated['slug'] = $dept->slug . '/' . $slug;
        }

        if (Pages::where('slug', $validated['slug'])->exists()) {
            return back()
                ->withErrors(['slug' => 'The slug already exists. Please enter a unique slug.'])
                ->withInput();
        }

        // Handle file uploads
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/pages/'), $imageName);
            $validated['image'] = 'assets/img/pages/' . $imageName;
        }

        Pages::create($validated);

        return redirect()->route('pages.index')->with('success', 'Page created successfully!');

    }

    /**
     * Display the specified resource.
     */
    public function show(Pages $pages)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pages $page)
    {
        $departments = Department::select('id', 'name')->get();
        $schools = School::select('id', 'name', 'slug')->get();
        return Inertia::render('Pages/Edit', [
            'page' => $page,
            'departments' => $departments,
            'schools' => $schools,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pages $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255', // Remove unique and regex from here
            'sub_title' => 'nullable|string|max:255',
            'target_blank' => 'required|boolean',
            'publish_date' => 'required|date',
            'display_order' => 'required',
            'school_id' => 'nullable|exists:schools,id',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        // Process slug based on school/department selection
        if (empty($validated['slug'])) {
            // Generate slug from title
            $validated['slug'] = Str::slug($validated['title']);

            // If school is selected, prepend school slug
            if (!empty($validated['school_id'])) {
                $school = School::findOrFail($validated['school_id']);
                $validated['slug'] = $school->slug . '/' . $validated['slug'];
                $validated['department_id'] = null; // Clear department if school is selected
            }
        } else {
            // If user manually entered slug and school is selected, prepend school slug
            if (!empty($validated['school_id'])) {
                $school = School::findOrFail($validated['school_id']);
                $slug = $validated['slug'];

                // Remove any existing school slug prefix from any school
                foreach (School::all() as $s) {
                    $schoolPrefix = $s->slug . '/';
                    if (str_starts_with($slug, $schoolPrefix)) {
                        $slug = substr($slug, strlen($schoolPrefix));
                        break;
                    }
                }

                $validated['slug'] = $school->slug . '/' . $slug;
                $validated['department_id'] = null; // Clear department if school is selected
            } elseif (!empty($validated['department_id']) && $validated['type'] === 'Content-Page') {
                // Clear school if dept chosen manually
                $validated['school_id'] = null;

                $dept = Department::findOrFail($validated['department_id']);
                $slug = $validated['slug'];

                // Remove any existing department slug prefix
                foreach (Department::all() as $d) {
                    $deptPrefix = $d->slug . '/'; // Fixed concatenation (was using +)
                    if (str_starts_with($slug, $deptPrefix)) {
                        $slug = substr($slug, strlen($deptPrefix));
                        break;
                    }
                }
                $validated['slug'] = $dept->slug . '/' . $slug;
            }
        }

        // Validate the final slug format and uniqueness
        $slugValidator = Validator::make(
            ['slug' => $validated['slug']],
            [
                'slug' => [
                    'required', // Make required since we always have a slug at this point
                    'string',
                    'max:255',
                    'unique:pages,slug,' . $page->id,
                    'regex:/^\/?[a-z0-9]+(?:[-\/][a-z0-9]+)*$/i',
                ]
            ]
        );

        if ($slugValidator->fails()) {
            return back()
                ->withErrors($slugValidator)
                ->withInput();
        }

        if ($request->hasFile('image')) {
            $request->validate(['image' => 'image|mimes:jpg,jpeg,png,webp|max:2048']);
            if ($page->image && file_exists(public_path($page->image))) {
                unlink(public_path($page->image));
            }
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('assets/img/pages/'), $imageName);
            $validated['image'] = 'assets/img/pages/' . $imageName;
        } elseif ($request->has('remove_image') && $request->remove_image) {
            if ($page->image && file_exists(public_path($page->image))) {
                unlink(public_path($page->image));
            }
            $validated['image'] = null;
        }

        $page->update($validated);

        return redirect()->route('pages.index')->with('success', 'Page updated successfully!');
    }
    public function destroy(Pages $page)
    {
        if ($page->image && file_exists(public_path($page->image))) {
            @unlink(public_path($page->image));
        }

        $page->sections()->delete();
        $page->delete();

        return redirect()->route('pages.index')->with('warning', 'Page deleted successfully!');
    }


    public function toggleStatus($id)
    {
        $page = Pages::findOrFail($id);
        $page->status = !$page->status;
        $page->save();

        return redirect()->back()->with('success', 'Status updated.');
    }

    public function duplicate(Pages $page)
    {
        try {
            DB::beginTransaction();

            $newPage = $page->replicate();
            $newPage->title = $page->title . ' (Copy)';
            $newPage->slug = $page->slug . '-copy';

            while (Pages::where('slug', $newPage->slug)->exists()) {
                $newPage->slug .= '-' . rand(100, 999);
            }

            // Duplicate page main image
            if ($newPage->image && file_exists(public_path($newPage->image))) {
                $ext = pathinfo(public_path($newPage->image), PATHINFO_EXTENSION);
                $safeName = Str::slug(pathinfo(public_path($newPage->image), PATHINFO_FILENAME));
                $newImageName = time() . '_' . uniqid() . '_' . $safeName . '.' . $ext;
                $newImagePath = 'assets/img/pages/' . $newImageName;
                if(copy(public_path($newPage->image), public_path($newImagePath))) {
                    $newPage->image = $newImagePath;
                }
            }

            $newPage->save();
            if ($page->sections) {
                $groupKeyMap = [];
                foreach ($page->sections as $section) {
                    $newSection = $section->replicate();
                    $newSection->page_id = $newPage->id;

                    if ($section->group_key) {
                        if (!isset($groupKeyMap[$section->group_key])) {
                            $groupKeyMap[$section->group_key] = Str::uuid()->toString();
                        }
                        $newSection->group_key = $groupKeyMap[$section->group_key];
                    }

                    // Duplicate content files
                    $newContent = $section->content;
                    if (is_string($newContent)) {
                        $newContent = json_decode($newContent, true);
                    }
                    if (is_array($newContent)) {
                        $newContent = $this->duplicateSectionFiles($newContent);
                        $newSection->content = $newContent;
                    }

                    $newSection->save();
                }
            }

            DB::commit();

            return redirect()->route('pages.index')->with('success', 'Page duplicated successfully with all sections.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Page duplication failed: ' . $e->getMessage());
            return redirect()->route('pages.index')->with('error', 'Failed to duplicate page sections Please try again.');
        }
    }

    public function mapping($id)
    {
        $page = Pages::with(['tabs:id,title', 'schools:id,name', 'departments:id,name'])->findOrFail($id);
        $tabs = Tab::select('id', 'title')->get();
        $schools = School::select('id', 'name')->get();
        $departments = Department::select('id', 'name')->get();

        return Inertia::render('Pages/Mapping', [
            'page' => $page,
            'schools' => $schools,
            'departments' => $departments,
            'tabs' => $tabs,
        ]);
    }

    public function attachMapping(Request $request, $id)
    {
        $page = Pages::findOrFail($id);

        $validated = $request->validate([
            'tab_id' => 'nullable|exists:tabs,id',
            'school_ids' => 'nullable|array',
            'school_ids.*' => 'exists:schools,id',
            'department_ids' => 'nullable|array',
            'department_ids.*' => 'exists:departments,id',
        ]);

        $tabIds = $validated['tab_id'] ? [$validated['tab_id']] : [];
        $page->schools()->sync($validated['school_ids'] ?? []);
        $page->departments()->sync($validated['department_ids'] ?? []);

        $page->tabs()->sync($tabIds);

        return redirect()->route('pages.index')->with('success', 'Tab mapping updated successfully!');
    }

    private function duplicateSectionFiles($content)
    {
        if (is_array($content)) {
            foreach ($content as $key => $value) {
                if (is_array($value)) {
                    $content[$key] = $this->duplicateSectionFiles($value);
                } elseif (is_string($value)) {
                    // It can be an absolute URL or relative path
                    $isUrl = filter_var($value, FILTER_VALIDATE_URL);
                    $isPath = str_starts_with($value, 'assets/img/');
                    
                    if ($isUrl || $isPath) {
                        $publicPath = public_path();
                        $relativePath = $isUrl ? str_replace(url('/'), '', $value) : $value;
                        $relativePath = trim($relativePath, '/');
                        $fullPath = $publicPath . '/' . $relativePath;
                        
                        // Verify this is actually a file under our assets/img folder
                        if (str_starts_with($relativePath, 'assets/img/') && file_exists($fullPath) && is_file($fullPath)) {
                            $extension = pathinfo($fullPath, PATHINFO_EXTENSION);
                            if (empty($extension)) {
                                $extension = 'png';
                            }
                            
                            $safeName = Str::slug(pathinfo($fullPath, PATHINFO_FILENAME));
                            $newFileName = time() . '_' . uniqid() . '_' . $safeName . '.' . $extension;
                            
                            $dirName = dirname($relativePath);
                            $newRelPath = $dirName . '/' . $newFileName;
                            $newFullPath = $publicPath . '/' . $newRelPath;
                            
                            if (!is_dir(dirname($newFullPath))) {
                                mkdir(dirname($newFullPath), 0755, true);
                            }
                            
                            if (copy($fullPath, $newFullPath)) {
                                // Keep the same format as the original
                                $content[$key] = $isUrl ? url('/' . $newRelPath) : $newRelPath;
                            }
                        }
                    }
                }
            }
        }
        return $content;
    }
}
