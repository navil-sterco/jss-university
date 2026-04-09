<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Department;
use App\Models\Faculty;
use App\Models\Happening;
use App\Models\Leadership;
use App\Models\Pages;
use App\Models\PageSection;
use App\Models\Program;
use App\Models\School;
use App\Models\Type;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    public function index($slug)
    {
        $today = Carbon::today();
        $school = School::where('slug', $slug)->first();

        if (!$school) {
            return response()->json([
                'status' => false,
                'message' => 'School not found',
            ], 404);
        }
        $id = $school->id;

        $sections = [
            'banners' => $school->banners
                ->where('status', 1)
                ->take(5)
                ->map(fn($item) => [
                    'id' => $item->id,
                    'title' => $item->heading,
                    'desc' => $item->subheading,
                    'linked_text' => $item->linked_text,
                    'url' => $item->link,
                    'desktop_banner' => $item->image ? asset($item->image) : null,
                    'mobile_banner' => $item->mobile_image ? asset($item->mobile_image) : null,
                    'desktop_video' => $item->video_desktop ? asset($item->video_desktop) : null,
                    'mobile_video' => $item->video_mobile ? asset($item->video_mobile) : null,
                    'video_url' => $item->video_url,
                    'display_order' => $item->display_order,
                ])
                ->values()
                ->toArray(),

            'tabs' => $this->buildTabs($school),

            'course_data' => [
                'title' => $school->department_title,
                'description' => $school->department_desc,
                'programs' => $school->programs
                    ->where('status', 1)
                    ->sortBy('display_order')
                    ->take(5)
                    ->map(function ($item) use ($school) {
                        return [
                            'id' => $item->id, 
                            'name' => $item->name, 
                            'image' => asset(match(true) {
    $school->slug === 'college-of-pharmacy' => $item->alternate_image ?? $item->image,
    default                                  => $item->image ?? 'assets/img/placeholder.png',
}),
                            'name_short' => $item->name_short, 
                            'slug' => $item->slug, 
                            'school_id' => $school->id,
                        ];
                    })
                    ->values(),
                'programs_count' => $school->department_programs_count,
                'programs_text' => $school->department_programs_text,
                'academic_year' => $school->academic_years,
                'academic_year_desc' => $school->department_buttons,
            ],

            'departments' => Department::where('school_id', $id)->where('status', 1)->orderBy('display_order', 'asc')->take(5)->get()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                    'slug' => $item->slug,
                    'short_name' => $item->short_name,
                ];
            }),

            'facilities' => optional($school->pages)
                ? $school->pages
                    ->where('type', 'Facility')
                    ->where('status', 1)
                    ->sortBy('display_order')
                    ->values()
                    ->map(fn($item) => [
                        'id' => $item->id,
                        'title' => $item->title,
                        'img' => $item->image ? asset($item->image) : null,
                        'url' => $item->slug,
                    ])
                : [],


            'about_school' => [
                'title' => $school->about_school_title,
                'subtitle' => $school->about_school_subtitle,
                'description' => $school->about_school_description,
                'logo_content' => $school->about_school_logo_content,
                'stats_number' => $school->about_school_stats_number,
                'stats_content' => $school->about_school_stats_content,
                'chancellor_img' => $school->about_school_chancellor_img ? asset($school->about_school_chancellor_img) : asset('assets/img/placeholder.png'),
                'chancellor_logo' => $school->about_school_chancellor_logo ? asset($school->about_school_chancellor_logo) : asset('assets/img/placeholder.png'),
                'highlights' => $school->about_highlights,
                'items' => collect(json_decode($school->about_chancellor_items, true))
                    ->map(function ($item) {
                        return [
                            'content' => $item['content'] ?? null,
                            'logo' => !empty($item['logo']) ? asset($item['logo']) : null,
                        ];
                    })
                    ->values(),
            ],

            'faculty' => Faculty::with('type')
                ->leftJoin('types', 'faculties.type_id', '=', 'types.id')
                ->where('faculties.status', 1)
                ->where(function ($query) use ($school) {
                    $query->whereHas('departments', function ($q) use ($school) {
                        $q->where('departments.school_id', $school->id);
                    })->orWhereHas('schools', function ($q) use ($school) {
                        $q->where('schools.id', $school->id);
                    });
                })
                ->orderBy('types.display_order', 'asc')
                ->orderBy('faculties.display_order', 'asc')
                ->select('faculties.*')
                ->take(10)
                ->get()
                ->map(fn($item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'designation' => $item->type->name ?? null,
                    'img' => $item->image ? asset($item->image) : null,
                    'url' => $item->slug,
                ]),

            'placements' => [
                'title' => $school->placement_title,
                'subtitle' => $school->placement_subtitle,
                'facts_and_figures' => $school->factsAndFigures->where('status', true)->sortBy('display_order')->values()->take(5)->map(fn($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'figure' => $item->figure,
                ]),
                'hall_of_fame' => [
                    'image' => $school->hall_of_fame_image ? asset($school->hall_of_fame_image) : asset('assets/img/placeholder.png'),
                    'heading' => $school->hall_of_fame_heading,
                    'url' => $school->hall_of_fame_url,
                ],
                'testimonials' => $school->testimonials->where('status', true)->where('type', 'placement')->sortBy('display_order')->values()->take(15)->map(fn($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'name' => $item->name,
                    'course' => $item->course,
                    'batch' => $item->batch,
                    'slug' => $item->slug,
                    'alt_text' => $item->alt_text,
                    'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                    'video_url' => $item->video_url,
                    'short_description' => $item->short_description,
                    'designation' => $item->designation,
                    'location' => $item->location,
                    'company' => $item->company,
                ]),
                'recruiters' => $school->recruiters->where('status', true)->sortBy('display_order')->values()->take(20)->map(fn($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                    'description' => $item->description,
                ]),
            ],

            'testimonials' => [
                'title' => $school->testimonial_title,
                'subtitle' => $school->testimonial_subtitle,
                'testimonials' => $school->testimonials->where('status', true)->whereNotIn('type', 'placement')->sortBy('display_order')->values()->take(5)->map(fn($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'name' => $item->name,
                    'course' => $item->course,
                    'batch' => $item->batch,
                    'slug' => $item->slug,
                    'alt_text' => $item->title,
                    'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                    'video_url' => $item->video_url,
                    'short_description' => $item->short_description,
                    'designation' => $item->designation,
                    'location' => $item->location,
                    'company' => $item->company,
                ]),
            ],

            'happenings' => [
                'title' => $school->happening_title,
                'subtitle' => $school->happening_subtitle,
                'happenings' => $school->happenings->where('status', 1)->sortBy('display_order')->values()->take(9)->map(function ($item) use ($today) {
                    return [
                        'id' => $item->id,
                        'event_type' => $item->event_type,
                        'upcoming_event' => $item->event_date_from > $today,
                        'title' => $item->title,
                        'slug' => $item->slug,
                        'alt_text' => $item->title,
                        'image' => $item->image
                            ? asset($item->image)
                            : asset('assets/img/placeholder.png'),
                        'banner_images' => $item->banner_images
                            ? asset($item->banner_images)
                            : asset('assets/img/placeholder.png'),
                        'event_date_from' => $item->event_date_from,
                        'event_date_to' => $item->event_date_to,
                        'short_description' => $item->short_description,
                    ];
                }),
            ],
        ];

        return response()->json([
            'status' => true,
            'school_id' => $school->id,
            'school_name' => $school->name,
            'school_short_name' => $school->name_short,
            'school_slug' => $school->slug,
            'sections' => $sections,
        ]);
    }

    private function buildTabs($school)
    {
        // Define fixed order slots for modules
        $moduleSlots = [
            'programs' => 2,   // slot 2
            'departments' => 3,   // slot 1
            'faculty' => 4,   // slot 5
            'labs' => 5,   // slot 5
            'alumni' => 8,   // slot 7
            'happenings' => 9,   // slot 6
        ];

        $tabs = collect();

        // Add CMS pages with their display_order
        $cmsPages = $school->pages
            ->where('status', 1)
            ->whereNotNull('school_id')
            ->map(fn($item) => [
                'title' => $item->sub_title ?: $item->title,
                'slug' => $item->slug,
                'display_order' => $item->display_order, // column in DB
            ]);

        foreach ($cmsPages as $page) {
            $tabs->push($page);
        }

        // Add module tabs if they have data
        if ($school->courses->count() > 0) {
            $tabs->push([
                'title' => 'Programs',
                'slug' => $school->slug . '/programs',
                'display_order' => $moduleSlots['programs'],
            ]);
        }

        if ($school->departments->where('status', 1)->count() > 0) {
            $tabs->push([
                'title' => 'Departments',
                'slug' => $school->slug . '/departments',
                'display_order' => $moduleSlots['departments'],
            ]);
        }

        $hasFaculty = Faculty::where('status', 1)
            ->where(function ($query) use ($school) {
                $query->whereHas('departments', function ($q) use ($school) {
                    $q->where('departments.school_id', $school->id);
                })->orWhereHas('schools', function ($q) use ($school) {
                    $q->where('schools.id', $school->id);
                });
            })->exists();

        $hasAlumni = Leadership::where('status', 1)->where('page_type', 'alumuni')
            ->where(function ($query) use ($school) {
                $query->whereHas('departments', function ($q) use ($school) {
                    $q->where('departments.school_id', $school->id);
                })
                    ->orWhereHas('schools', function ($q) use ($school) {
                        $q->where('schools.id', $school->id);
                    });
            })->exists();

        if ($hasFaculty) {
            $tabs->push([
                'title' => 'Faculty',
                'slug' => $school->slug . '/faculties',
                'display_order' => $moduleSlots['faculty'],
            ]);
        }
        if ($hasAlumni) {
            $tabs->push([
                'title' => 'Alumni',
                'slug' => $school->slug . '/alumni',
                'display_order' => $moduleSlots['alumni'],
            ]);
        }

        if ($school->happenings->count() > 0) {
            $tabs->push([
                'title' => 'Happenings',
                'slug' => $school->slug . '/happenings',
                'display_order' => $moduleSlots['happenings'],
            ]);
        }

        if ($school->pages->where('type', 'Laboratory')->where('status', 1)->count() >= 1) {
            $tabs->push(['title' => 'Labs', 'slug' => $school->slug . '/labs', 'display_order' => $moduleSlots['labs']]);
        }

        // Sort all tabs by display_order and clean up
        return $tabs
            ->sortBy('display_order')
            ->values()
            ->map(fn($tab) => [
                'title' => $tab['title'],
                'slug' => $tab['slug'],
            ]);
    }

    public function allSchools()
    {
        $schools = School::where('status', 1)
            ->orderBy('name', 'asc')
            ->get(['id', 'name']);

        return response()->json([
            'success' => true,
            'data' => $schools
        ], 200);
    }

    public function schoolPages(Request $request, $schoolSlug, $slug)
    {
        $school = School::where('slug', $schoolSlug)->first();
        if ($slug === 'programs') {


            $programs = Course::where('status', 1)->where(function ($query) use ($school) {
                $query->whereHas('departments', function ($q) use ($school) {
                    $q->where('departments.school_id', $school->id);
                })
                    ->orWhereHas('schools', function ($q) use ($school) {
                        $q->where('schools.id', $school->id);
                    });
            })
                ->select('courses.id', 'courses.name', 'courses.banner', 'courses.school_listing_image', 'courses.slug', 'courses.degree_id', 'courses.display_order')
                ->addSelect([
                    'program_order' => Program::select('display_order')
                        ->join('degree_programs', 'programs.id', '=', 'degree_programs.program_id')
                        ->whereColumn('degree_programs.degree_id', 'courses.degree_id')
                        ->limit(1)
                ])
                ->with([
                    'degree:id,short_name',
                ])
                ->orderBy('program_order', 'asc')
                ->orderBy('courses.display_order', 'asc')
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->name,
                        'image' => $item->school_listing_image ? url($item->school_listing_image) : null,
                        'banner' => $item->banner ? url($item->banner) : null,
                        'degree_name' => $item->degree->short_name ?? '',
                        'slug' => $item->slug,
                    ];
                });

            return response()->json([
                'status' => true,
                'type' => 'programs',
                'tabs' => $this->buildTabs($school),
                'data' => $programs
            ]);
        }

        if ($slug === 'departments') {
            $department = Department::where('school_id', $school->id)->where('status', 1)
                ->select('departments.id', 'departments.name', 'departments.image', 'departments.slug')
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->name,
                        'image' => $item->image ? url($item->image) : null,
                        'slug' => $item->slug,
                    ];
                });

            return response()->json([
                'status' => true,
                'type' => 'departments',
                'tabs' => $this->buildTabs($school),
                'data' => $department
            ]);
        }

        if ($slug === 'happenings') {
            $happenings = Happening::where('status', 1)->whereHas('schools', function ($q) use ($school) {
                $q->where('schools.id', $school->id);
            })
                ->select('happenings.id', 'happenings.title', 'happenings.slug', 'happenings.event_type', 'happenings.banner_images', 'happenings.event_date_from')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->title,
                        'slug' => $item->slug,
                        'event_type' => $item->event_type,
                        'banner_image' => $item->banner_images ? asset($item->banner_images) : null,
                        'event_date_from' => $item->event_date_from,
                    ];
                });

            return response()->json([
                'status' => true,
                'type' => 'happenings',
                'tabs' => $this->buildTabs($school),
                'data' => $happenings
            ]);
        }

        if ($slug === 'alumni') {
            $alumni = Leadership::where('status', 1)->with(['type', 'category'])->where(function ($query) use ($school) {
                $query->whereHas('departments', function ($q) use ($school) {
                    $q->where('departments.school_id', $school->id);
                })
                    ->orWhereHas('schools', function ($q) use ($school) {
                        $q->where('schools.id', $school->id);
                    });
            })->where('page_type', 'alumuni')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'slug' => $item->slug,
                        'designation' => $item->type->name ?? 'N/A',
                        'category' => $item->short_description ?? 'N/A',
                        'image' => $item->image
                            ? asset($item->image)
                            : asset('assets/img/placeholder.png'),
                    ];
                });

            return response()->json([
                'status' => true,
                'type' => 'alumni',
                'tabs' => $this->buildTabs($school),
                'data' => $alumni
            ]);
        }

        if ($slug === 'labs') {
            $labPages = $school->pages->where('type', 'Laboratory')->where('status', 1)->sortBy('display_order')->values();

            $sections = collect();
            foreach ($labPages as $page) {
                $pageSections = PageSection::where('page_id', $page->id)
                    ->orderBy('position')
                    ->get()
                    ->groupBy('group_key')
                    ->map(fn($group) => [
                        'type' => $group->first()->section_type,
                        'items' => $group->pluck('content')->toArray(),
                    ])
                    ->values();
                $sections = $sections->merge($pageSections);
            }

            return response()->json([
                'tabs' => $this->buildTabs($school),
                'page_title' => 'Labs',
                'slug' => $school->slug . '/labs',
                'sections' => $sections,
                'related_pages' => [],
            ]);
        }

        if ($slug === 'faculties') {

            $search = $request->input('search');
            $type = $request->input('type');
            $department = $request->input('department');

            $facultyQuery = Faculty::with('type')
                ->leftJoin('types', 'faculties.type_id', '=', 'types.id')
                ->where('faculties.status', 1)
                ->where(function ($query) use ($school) {
                    $query->whereHas('departments', function ($q) use ($school) {
                        $q->where('departments.school_id', $school->id);
                    })
                        ->orWhereHas('schools', function ($q) use ($school) {
                            $q->where('schools.id', $school->id);
                        });
                });

            // ✅ Apply department filter ONLY if present
            if ($department) {
                $facultyQuery->whereHas('departments', function ($q) use ($department) {
                    $q->where('departments.id', $department);
                });
            }

            if ($search) {
                $facultyQuery->where('faculties.name', 'like', "%{$search}%");
            }

            if ($type) {
                $facultyQuery->where('faculties.type_id', $type);
            }

            $faculties = $facultyQuery
                ->orderBy('faculties.display_order', 'asc')
                ->select('faculties.id', 'faculties.name', 'faculties.slug', 'faculties.image', 'faculties.display_order', 'faculties.type_id')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'slug' => $item->slug,
                        'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                        'type' => $item->type->name ?? 'N/A',
                        'display_order' => $item->display_order,
                    ];
                });

            return response()->json([
                'status' => true,
                'type' => 'faculties',
                'tabs' => $this->buildTabs($school),
                'data' => $faculties,
            ]);
        }
        return $this->show($school, $slug);
    }

    public function show($school, $slug)
    {
        $page = Pages::where('slug', $school->slug . '/' . $slug)
            ->where('status', 1)
            ->firstOrFail();

        $sections = PageSection::where('page_id', $page->id)
            ->orderBy('position')
            ->get()
            ->groupBy('group_key')
            ->map(fn($group) => [
                'type' => $group->first()->section_type,
                'items' => $group->pluck('content')->toArray(),
            ])
            ->values();

        $mainTab = $page->tabs->first();
        $relatedPages = [];

        if ($mainTab) {
            $relatedPages = Pages::join('tab_pages', 'pages.id', '=', 'tab_pages.page_id')
                ->where('tab_pages.tab_id', $mainTab->id)
                ->select('pages.title as text', 'pages.slug')
                ->orderBy('display_order')
                ->get()
                ->map(fn($item) => [
                    'text' => $item->text,
                    'url' => '/' . $item->slug,
                ]);
        }

        return response()->json([
            'tabs' => $this->buildTabs($school), // ← replaces all the manual tab logic
            'page_title' => $page->title,
            'slug' => $page->slug,
            'sections' => $sections,
            'related_pages' => $relatedPages,
        ]);
    }

    public function types($school)
    {
        $school = School::where('slug', $school)->first();
        if ($school) {
            $types = Type::whereHas('faculties', function ($query) use ($school) {
                $query->where('faculties.status', 1)
                    ->where(function ($q) use ($school) {
                        $q->whereHas('departments', function ($q2) use ($school) {
                            $q2->where('departments.school_id', $school->id);
                        })->orWhereHas('schools', function ($q2) use ($school) {
                            $q2->where('schools.id', $school->id);
                        });
                    });
            })
                ->select('id', 'name')
                ->get();
        }
        return response()->json([
            'status' => true,
            'data' => $types ?? [],
        ]);
    }
}
