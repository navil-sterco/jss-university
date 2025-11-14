<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\Banner;
use App\Models\School;
use App\Models\Program;
use App\Models\Homepage;
use App\Models\Happening;
use App\Models\Recruiter;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use App\Models\FactsAndFigures;
use App\Http\Controllers\Controller;

class HomepageController extends Controller
{
    public function index()
    {
        $homepage = Homepage::first();
        $today = Carbon::today();

        if (!$homepage) {
            return response()->json([
                'status' => false,
                'message' => 'Homepage not found',
            ], 404);
        }

        $sections = [
            'banners' => Banner::where('status', 1)->where('show_on_home', 1)->orderBy('display_order', 'asc')->take(5)->get()
                ->map(function ($banner) {
                    return [
                        'id' => $banner->id,
                        'title' => $banner->heading,
                        'desc' => $banner->subheading,
                        'url' => $banner->link ? asset($banner->link) : null,
                        'linked_text' => $banner->linked_text,
                        'desktop_banner' => asset($banner->image),
                        'mobile_banner' => asset($banner->mobile_image),
                        'display_order' => $banner->display_order,
                    ];
                }),

            'about_section' => [
                'title' => $homepage->about_title,
                'subtitle' => $homepage->about_subtitle,
                'description' => $homepage->about_description,
                'url' => $homepage->about_url,
                'chancellor_title' => $homepage->about_chancellor_title,
                'chancellor_name' => $homepage->about_chancellor_name,
                'chancellor_img' => $homepage->about_chancellor_img ? asset($homepage->about_chancellor_img) : asset('assets/img/placeholder.png'),
                'video_url' => $homepage->about_chancellor_video_url,
                'highlights' => array_map(function($highlight) {
                    return [
                        'rank' => $highlight['rank'] ?? null,
                        'text' => $highlight['text'] ?? null,
                        'source' => $highlight['source'] ?? null,
                    ];
                }, $homepage->highlights ?? []),
                'buttons' => array_map(function($button) {
                    return [
                        'text' => $button['text'] ?? null,
                        'url' => $button['url'] ?? null,
                    ];
                }, $homepage->buttons ?? []),
                'logo_content' => array_map(function($logo) {
                    return [
                        'image' => $logo['image'] ? asset($logo['image']) : null,
                        'description' => $logo['description'] ?? null,
                    ];
                }, $homepage->logo_content ?? []),
            ],

            'facilities_section' => [
                'heading' => $homepage->facilities_heading,
                'subheading' => $homepage->facilities_subheading,
                'facilities' => array_map(function($facility) {
                    return [
                        'title' => $facility['title'] ?? null,
                        'description' => $facility['description'] ?? null,
                        'main_link' => $facility['main_link'] ?? null,
                        'image' => $facility['image'] ? asset($facility['image']) : null,
                        'links' => array_map(function($link) {
                            return [
                                'text' => $link['text'] ?? null,
                                'url' => $link['url'] ?? null,
                            ];
                        }, $facility['links'] ?? []),
                    ];
                }, $homepage->facilities ?? []),
            ],

            'departments_section' => [
                'title' => $homepage->department_title,
                'subtitle' => $homepage->department_subtitle,
                'programs' => Program::where('status', 1)->orderBy('display_order', 'asc')->take(5)->get()->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                        'name_short' => $item->name_short,
                        'slug' => $item->slug,
                    ];
                }),
                'programs_title' => $homepage->programs_title,
                'departments' => School::where('status', 1)->orderBy('display_order', 'asc')->take(6)->get()->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'name' => $item->name,
                        'slug' => $item->slug,
                        'short_name' => $item->name_short,
                    ];
                }),
                'programs_count' => $homepage->department_programs_count,
                'programs_text' => $homepage->department_programs_text,
                'buttons' => [
                    [
                        'text' => $homepage->department_button_1_text,
                        'url' => $homepage->department_button_1_url,
                    ]
                ],
                'academic_year' => [
                    'year' => $homepage->department_academic_year,
                    'description' => $homepage->department_academic_year_desc,
                ],
            ],

            'placement_section' => [
                'title' => $homepage->placement_title,
                'subtitle' => $homepage->placement_subtitle,
                'facts_and_figures' => FactsAndFigures::where('show_on_home', true)->where('status', true)->orderBy('display_order', 'asc')->take(5)->get()->map(fn($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'figure' => $item->figure,
                ]),
                'hall_of_fame' => [
                    'image' => $homepage->hall_of_fame_image ? asset($homepage->hall_of_fame_image) : null,
                    'heading' => $homepage->hall_of_fame_heading,
                    'url' => $homepage->hall_of_fame_url,
                ],
                'testimonials' => Testimonial::where('show_on_home', true)->where('type','placement')->where('status', true)->orderBy('display_order', 'asc')->take(15)->get()->map(fn($item) => [
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
                'recruiters' => Recruiter::where('show_on_home', true)->where('status', true)->orderBy('display_order', 'asc')->take(20)->get()->map(fn($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'image' => $item->image ? asset($item->image) : asset('assets/img/placeholder.png'),
                    'description' => $item->description,
                ]),
            ],

            'testimonial_section' => [
                'title' => $homepage->testimonial_title,
                'subtitle' => $homepage->testimonial_subtitle,
                'testimonials' => Testimonial::where('status', 1)
                ->where('show_on_home', 1)
                ->whereNot('type','placement')
                ->orderBy('display_order', 'asc')
                ->take(5)
                ->get()
                ->map(function ($item) {
                    return [
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
                    ];
                }),
            ],

            'happening_section' => [
                'title' => $homepage->happening_title,
                'subtitle' => $homepage->happening_subtitle,
                'happenings' => Happening::where('status', 1)
                    ->where('show_on_home', 1)
                    ->orderBy('display_order', 'asc')
                    ->take(9)
                    ->get()
                    ->map(function ($happening) use ($today) {
                        return [
                            'id' => $happening->id,
                            'event_type' => $happening->event_type,
                            'upcoming_event' => $happening->event_date_from > $today,
                            'title' => $happening->title,
                            'slug' => $happening->slug,
                            'alt_text' => $happening->title,
                            'image' => $happening->image 
                                ? asset($happening->image) 
                                : asset('assets/img/placeholder.png'),
                            'banner_images' => $happening->banner_images 
                                ? asset($happening->banner_images) 
                                : asset('assets/img/placeholder.png'),
                            'event_date_from' => $happening->event_date_from,
                            'event_date_to' => $happening->event_date_to,
                            'short_description' => $happening->short_description,
                        ];
                    }),
            ],
        ];

        return response()->json([
            'status' => true,
            'homepage_id' => $homepage->id,
            'homepage_name' => $homepage->name,
            'menu_name' => $homepage->menu_name,
            'sections' => $sections,
        ]);
    }

    public function getSection($section)
    {
        $homepage = Homepage::first();

        if (!$homepage) {
            return response()->json([
                'status' => false,
                'message' => 'Homepage not found',
            ], 404);
        }

        $sectionData = $this->getSectionData($homepage, $section);

        if (!$sectionData) {
            return response()->json([
                'status' => false,
                'message' => 'Section not found',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'homepage_id' => $homepage->id,
            'homepage_name' => $homepage->name,
            'section' => $section,
            'data' => $sectionData,
        ]);
    }

    public function getMultipleSections(Request $request)
    {
        $homepage = Homepage::first();

        if (!$homepage) {
            return response()->json([
                'status' => false,
                'message' => 'Homepage not found',
            ], 404);
        }

        $sections = $request->input('sections', []);
        $sectionData = [];

        foreach ($sections as $section) {
            $data = $this->getSectionData($homepage, $section);
            if ($data) {
                $sectionData[$section] = $data;
            }
        }

        return response()->json([
            'status' => true,
            'homepage_id' => $homepage->id,
            'homepage_name' => $homepage->name,
            'sections' => $sectionData,
        ]);
    }

    private function getSectionData($homepage, $section)
    {
        switch ($section) {
            case 'banner':
                return [
                    Banner::where('status', 1)
                    ->where('show_on_home', 1)
                    ->orderBy('display_order', 'asc')
                    ->take(5)
                    ->get()
                    ->map(function ($banner) {
                        return [
                            'id' => $banner->id,
                            'heading' => $banner->heading,
                            'subheading' => $banner->subheading,
                            'link' => $banner->link ? asset($banner->link) : null,
                            'linked_text' => $banner->linked_text,
                            'image' => $banner->image ? asset($banner->image) : asset('assets/img/placeholder.png'),
                            'status' => $banner->status,
                            'show_on_home' => $banner->show_on_home,
                            'display_order' => $banner->display_order,
                        ];
                    }),
                ];
            case 'about':
                return [
                    'title' => $homepage->about_title,
                    'subtitle' => $homepage->about_subtitle,
                    'description' => $homepage->about_description,
                    'url' => $homepage->about_url,
                    'chancellor' => [
                        'image' => $homepage->about_chancellor_img ? asset($homepage->about_chancellor_img) : null,
                        'message' => $homepage->about_chancellor_message,
                    ],
                    'highlights' => array_map(function($highlight) {
                        return [
                            'rank' => $highlight['rank'] ?? null,
                            'text' => $highlight['text'] ?? null,
                            'source' => $highlight['source'] ?? null,
                        ];
                    }, $homepage->highlights ?? []),
                    'buttons' => array_map(function($button) {
                        return [
                            'text' => $button['text'] ?? null,
                            'url' => $button['url'] ?? null,
                        ];
                    }, $homepage->buttons ?? []),
                    'logo_content' => array_map(function($logo) {
                        return [
                            'image' => $logo['image'] ? asset($logo['image']) : null,
                            'description' => $logo['description'] ?? null,
                        ];
                    }, $homepage->logo_content ?? []),
                ];

            case 'facilities':
                return [
                    'heading' => $homepage->facilities_heading,
                    'subheading' => $homepage->facilities_subheading,
                    'facilities' => array_map(function($facility) {
                        return [
                            'title' => $facility['title'] ?? null,
                            'description' => $facility['description'] ?? null,
                            'main_link' => $facility['main_link'] ?? null,
                            'image' => $facility['image'] ? asset($facility['image']) : null,
                            'links' => array_map(function($link) {
                                return [
                                    'text' => $link['text'] ?? null,
                                    'url' => $link['url'] ?? null,
                                ];
                            }, $facility['links'] ?? []),
                        ];
                    }, $homepage->facilities ?? []),
                ];

            case 'departments':
                return [
                    'title' => $homepage->department_title,
                    'description' => $homepage->department_desc,
                    'programs_count' => $homepage->department_programs_count,
                    'programs_text' => $homepage->department_programs_text,
                    'buttons' => [
                        [
                            'text' => $homepage->department_button_1_text,
                            'url' => $homepage->department_button_1_url,
                        ]
                    ],
                    'academic_year' => [
                        'year' => $homepage->department_academic_year,
                        'description' => $homepage->department_academic_year_desc,
                    ],
                ];

            case 'placement':
                return [
                    'title' => $homepage->placement_title,
                    'subtitle' => $homepage->placement_subtitle,
                    'hall_of_fame' => [
                        'image' => $homepage->hall_of_fame_image ? asset($homepage->hall_of_fame_image) : null,
                        'heading' => $homepage->hall_of_fame_heading,
                        'url' => $homepage->hall_of_fame_url,
                    ],
                ];

            case 'testimonials':
                return [
                    'title' => $homepage->testimonial_title,
                    'subtitle' => $homepage->testimonial_subtitle,
                ];

            case 'happenings':
                return [
                    'title' => $homepage->happening_title,
                    'subtitle' => $homepage->happening_subtitle,
                ];

            default:
                return null;
        }
    }
}
