<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Department;
use App\Models\Faculty;
use App\Models\Leadership;
use App\Models\Faq;
use App\Models\Happening;
use App\Models\Pages;
use App\Models\PageSection;
use App\Models\Program;
use App\Models\School;
use App\Models\Type;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index($slug)
    {
        $today = Carbon::today();
        $departments = Department::where('status', 1)->where('slug', $slug)->first();

        if (!$departments) {
            return response()->json([
                'status' => false,
                'message' => 'Data not found',
            ], 404);
        }

        $id = $departments->id;

        // -------- SECTION NULL HANDLER --------
        $sectionOrNull = function ($data) use (&$sectionOrNull) {
            if ($data === null)
                return null;

            if ($data instanceof \Illuminate\Support\Collection) {
                return $data->isEmpty() ? null : $data;
            }

            if (is_array($data)) {
                foreach ($data as $value) {
                    if ($sectionOrNull($value) !== null) {
                        return $data;
                    }
                }
                return null;
            }

            if (is_object($data)) {
                foreach (get_object_vars($data) as $value) {
                    if ($sectionOrNull($value) !== null) {
                        return $data;
                    }
                }
                return null;
            }

            return $data !== null ? $data : null;
        };

        // -------- SECTIONS --------
        $sections = [
            'banners' => $departments->banners->where('status', 1)->take(5)->map(fn($item) => [
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
            ]),

            'tabs' => $this->buildTabs($departments),

            'course_data' => [
                'programs' => optional($departments->programs)
                    ->where('status', 1)
                    ->sortBy('display_order')
                    ->take(5)
                    ->map(function ($item) use ($departments) {
                        return [
                            'id' => $item->id ?? null,
                            'name' => $item->name ?? '',
                            'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                            'name_short' => $item->name_short ?? '',
                            'slug' => $item->slug ?? '',
                            'department_id' => $departments->id ?? '',
                        ];
                    })
                    ->values() ?? collect(),

                'title' => $departments->department_title,
                'desc' => $departments->department_desc,
                'course_count' => $departments->department_programs_count,
                'course_text' => $departments->department_programs_text,
                'apply_now' => $departments->apply_now_link,
                'academic_year' => $departments->academic_year,
                'academic_year_desc' => $departments->department_buttons,
            ],

            'placements' => [
                'title' => $departments->placement_title,
                'subtitle' => $departments->placement_subtitle,
                'facts_and_figures' => $departments->factsAndFigures->where('status', true)->sortBy('display_order')->values()->take(5)->map(fn($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'figure' => $item->figure,
                ]),
                'hall_of_fame' => [
                    'image' => $departments->hall_of_fame_image ? asset($departments->hall_of_fame_image) : null,
                    'heading' => $departments->hall_of_fame_heading,
                    'url' => $departments->hall_of_fame_url,
                ],
                'testimonials' => $departments->testimonials->where('status', true)->where('type', 'placement')->sortBy('display_order')->values()->take(15)->map(fn($item) => [
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
                'recruiters' => $departments->recruiters->where('status', true)->sortBy('display_order')->values()->take(20)->map(fn($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                    'description' => $item->description,
                ]),
            ],

            'about_school' => [
                'title' => $departments->title,
                'subtitle' => $departments->subtitle,
                'description' => $departments->description,
                'points' => $departments->mission_points,
                'stats' => $departments->factsAndFigures->where('status', true)->sortBy('display_order')->values()->take(3)->map(fn($item) => [
                    'id' => $item->id,
                    'logo' => $item->image ? asset($item->image) : null,
                    'value' => $item->figure,
                    'label' => $item->title,
                    'description' => $item->description,
                ]),
                'image' => $departments->image ? asset($departments->image) : null,
                'vision' => [
                    'title' => $departments->vision_title,
                    'description' => $departments->vision_description,
                ],
                'mission' => [
                    'title' => $departments->mission_title,
                    'points' => $departments->mission_points,
                ],
            ],

            'dean_message' => [
                'title' => $departments->hod_title,
                'name' => $departments->hod_name,
                'designation' => $departments->hod_designation,
                'message' => $departments->hod_messages,
                'message_list' => $departments->hod_messages_list,
                'img' => $departments->hod_image ? asset($departments->hod_image) : null,
            ],

            'courses_data' => [
                'title' => $departments->courses_title,
                'subtitle' => $departments->courses_subtitle,
                'image' => $departments->courses_image ? asset($departments->courses_image) : null,
                'courses' => Course::where('department_id', $id)->where('status', 1)->orderBy('display_order')->take(5)->get()->map(fn($item) => [
                    'id' => $item->id,
                    'category' => $item->degree->name ?? null,
                    'title' => $item->name,
                    'link' => $item->apply_now_link,
                ]),
                'admission_bar' => [
                    'title' => $departments->academic_year,
                    'links' => $departments->useful_links ? json_decode($departments->useful_links) : null,
                    'download_button' => $departments->brochure ? asset($departments->brochure) : null,
                    'apply_button' => $departments->apply_now_link,
                ],
            ],

            'faculty_data' => [
                'title' => $departments->faculty_title,
                'subtitle' => $departments->faculty_subtitle,
                'members' => $departments->faculties->where('status', 1)->map(fn($item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'designation' => $item->type->name ?? null,
                    'img' => $item->image ? asset($item->image) : null,
                    'url' => $item->slug,
                ]),
            ],

            'laboratories_data' => [
                'title' => $departments->lab_title,
                'subtitle' => $departments->lab_subtitle,
                'description' => $departments->lab_description,
                'url' => $departments->lab_url,
                'apply_button' => $departments->apply_now_link,
                'labs' => optional($departments->pages)
                    ? $departments->pages
                        ->where('type', 'Laboratory')
                        ->where('status', 1)
                        ->sortBy('display_order')
                        ->values()
                        ->map(fn($item) => [
                            'id' => $item->id,
                            'title' => $item->title,
                            'img' => $item->image ? asset($item->image) : null,
                            'url' => 'department/' . $departments->slug . '/labs',
                        ])
                    : [],
            ],

            'faqs' => $departments->faqs->where('status', 1)->take(5)->map(fn($item) => [
                'id' => $item->id,
                'question' => $item->question,
                'answer' => $item->answer,
            ]),

            'happenings' => [
                'title' => $departments->happening_title,
                'subtitle' => $departments->happening_subtitle,
                'happenings' => $departments->happenings->where('status', 1)->sortBy('display_order')->values()->take(9)->map(fn($item) => [
                    'id' => $item->id,
                    'event_type' => $item->event_type,
                    'upcoming_event' => $item->event_date_from > $today,
                    'title' => $item->title,
                    'slug' => $item->slug,
                    'image' => $item->image ? asset($item->image) : null,
                    'event_date_from' => $item->event_date_from,
                    'event_date_to' => $item->event_date_to,
                    'short_description' => $item->short_description,
                ]),
            ],
        ];

        $sections = collect($sections)->map(fn($section) => $sectionOrNull($section))->toArray();

        return response()->json([
            'status' => true,
            'departments_id' => $departments->id,
            'departments_name' => $departments->name,
            'departments_short_name' => $departments->name_short,
            'departments_slug' => $departments->slug,
            'sections' => $sections,
        ]);
    }

    private function buildTabs($department)
    {
        $tabs = collect();

        // CMS pages — set display_order in DB for desired position
        $department->pages
            ->where('status', 1)
            ->whereNotNull('department_id')
            ->where('type', '!=', 'Laboratory')
            ->each(fn($item) => $tabs->push([
                'title' => $item->title,
                'slug' => $item->slug,
                'display_order' => $item->display_order ?? 99,
            ]));


        $hasAlumni = Leadership::where('page_type', 'alumuni')->where('status', 1)
            ->whereHas('departments', function ($q) use ($department) {
                $q->where('departments.id', $department->id);
            })->exists();

        // Modules — fixed slots
        if ($department->courses->count() > 0) {
            $tabs->push(['title' => 'Programs', 'slug' => $department->slug . '/programs', 'display_order' => 2]);
        }
        if ($department->faculties->count() > 0) {
            $tabs->push(['title' => 'Faculty', 'slug' => $department->slug . '/faculties', 'display_order' => 3]);
        }
        if ($department->pages->where('type', 'Laboratory')->where('status', 1)->count() >= 1) {
            $tabs->push(['title' => 'Labs', 'slug' => $department->slug . '/labs', 'display_order' => 6]);
        }
        if ($hasAlumni) {
            $tabs->push(['title' => 'Alumni', 'slug' => $department->slug . '/alumni', 'display_order' => 7]);
        }
        if ($department->faqs->count() > 0) {
            $tabs->push(['title' => 'FAQs', 'slug' => $department->slug . '/faqs', 'display_order' => 7]);
        }
        if ($department->happenings->count() > 0) {
            $tabs->push(['title' => 'Happenings', 'slug' => $department->slug . '/happenings', 'display_order' => 8]);
        }

        return $tabs
            ->sortBy('display_order')
            ->values()
            ->map(fn($tab) => [
                'title' => $tab['title'],
                'slug' => $tab['slug'],
            ]);
    }

    public function departmentPages(Request $request, $departmentSlug, $slug)
    {
        $department = Department::where('slug', $departmentSlug)->first();
        if ($slug === 'programs') {
            $programs = Course::where('status', 1)->whereHas('departments', function ($q) use ($department) {
                $q->where('departments.id', $department->id);
            })
                ->select('courses.id', 'courses.name', 'courses.banner', 'courses.school_listing_image', 'courses.slug','courses.degree_id','courses.display_order')
                ->addSelect([
                    'program_order' => Program::select('display_order')->where('status', 1)
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
                'tabs' => $this->buildTabs($department),
                'data' => $programs
            ]);
        }

        if ($slug === 'happenings') {


            $happenings = Happening::whereHas('departments', function ($q) use ($department) {
                $q->where('departments.id', $department->id);
            })->where('status', 1)
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
                'type' => 'programs',
                'tabs' => $this->buildTabs($department),
                'data' => $happenings
            ]);
        }

        if ($slug === 'alumni') {
            $alumni = Leadership::with(['type', 'category'])->whereHas('departments', function ($q) use ($department) {
                $q->where('departments.id', $department->id);
            })->where('page_type', 'alumuni')->where('status', 1)
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
                'tabs' => $this->buildTabs($department),
                'data' => $alumni
            ]);
        }

        if ($slug === 'faculties') {

            $search = $request->input('search');
            $type   = $request->input('type');

            $facultyQuery = Faculty::with('type')
                ->leftJoin('types', 'faculties.type_id', '=', 'types.id')
                ->whereHas('departments', function ($q) use ($department) {
                    $q->where('departments.id', $department->id);
                })
                ->where('faculties.status', 1);

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
                        'id'            => $item->id,
                        'name'          => $item->name,
                        'slug'          => $item->slug,
                        'image'         => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                        'type'          => $item->type->name ?? 'N/A',
                        'display_order' => $item->display_order,
                    ];
                });

            return response()->json([
                'status' => true,
                'type'   => 'faculties',
                'tabs'   => $this->buildTabs($department),
                'data'   => $faculties,
            ]);
        }

        if ($slug === 'faqs') {
            $faqs = Faq::whereHas('departments', function ($q) use ($department) {
                $q->where('departments.id', $department->id);
            })->where('status', 1)
                ->select('faqs.id', 'faqs.question', 'faqs.answer')
                ->get()
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->question,
                        'slug' => $item->answer,
                    ];
                });

            return response()->json([
                'status' => true,
                'type' => 'faqs',
                'tabs' => $this->buildTabs($department),
                'data' => $faqs
            ]);
        }

        if ($slug === 'labs') {
            $labPages = $department->pages->where('type', 'Laboratory')->where('status', 1)->sortBy('display_order')->values();

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
                'tabs' => $this->buildTabs($department),
                'page_title' => 'Labs',
                'slug' => $department->slug . '/labs',
                'sections' => $sections,
                'related_pages' => [],
            ]);
        }

        return $this->show($department, $slug);
    }

    public function show($department, $slug)
    {
        $page = Pages::where('slug', $department->slug . '/' . $slug)
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
            'tabs' => $this->buildTabs($department), // ← replaces all manual tab logic
            'page_title' => $page->title,
            'slug' => $page->slug,
            'sections' => $sections,
            'related_pages' => $relatedPages,                 // ← was missing from response
        ]);
    }

    public function types($department) {
        $department = Department::where('slug', $department)->first();
        if($department){
            $types = Type::whereHas('faculties', function ($query) use ($department) {
                $query->where('faculties.status', 1)
                    ->where(function ($q) use ($department) {
                        $q->whereHas('departments', function ($q2) use ($department) {
                            $q2->where('departments.id', $department->id);
                        });
                    });
            })
            ->select('id', 'name')
            ->get();
        }
        return response()->json([
            'status' => true,
            'data'   => $types ?? [],
        ]);
    }
}
