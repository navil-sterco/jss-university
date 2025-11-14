<?php

namespace App\Http\Controllers\Api;

use App\Models\Admission;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AdmissionController extends Controller
{
    public function index()
    {
        $admission = Admission::first();
        
        if (!$admission) {
            return response()->json([
                'success' => true,
                'data' => [
                    'left' => [
                        'subtitle' => "JOIN JSSATE NOIDA FOR 2025-26",
                        'title' => "STEP INTO YOUR FUTURE AT JSS NOIDA",
                        'desc' => "Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo.",
                        'querytext' => "Any Query ? please mail us.",
                        'email' => "principal@jssaten.ac.in",
                        'phone' => "+91-9311830458",
                        'ctas' => [
                            ['text' => "APPLY NOW", 'url' => "/apply-now", 'type' => "primary"],
                            ['text' => "DOWNLOAD SYLLABUS", 'url' => "#", 'type' => "secondary"],
                        ],
                    ],
                    'middle' => [
                        'links' => [
                            ['title' => "Scholarship", 'url' => "/"],
                            ['title' => "Course, Eligibility & Fee Structure", 'url' => "/"],
                            ['title' => "Admission Document & Undertaking", 'url' => "/"],
                            ['title' => "Admissions Office Contacts", 'url' => "/"],
                            ['title' => "Hostel Details", 'url' => "/"],
                        ],
                        'stats' => [
                            'text' => "1,200+ ACROSS UG & PG PROGRAMS",
                            'subtext' => "Total student intake (annual)",
                            'btnText' => ['text' => "VIEW PROGRAMMES", 'url' => "/programs"],
                        ],
                    ],
                    'right' => [
                        'img' => "/images/header/admission-banner.png",
                        'alt' => "Admissions Image",
                    ],
                ]
            ]);
        }

        // Parse menus if they exist - now with title and url
        $menus = [];
        if ($admission->menus) {
            $parsedMenus = is_array($admission->menus) ? $admission->menus : json_decode($admission->menus, true);
            if (is_array($parsedMenus)) {
                $menus = array_map(function($menu) {
                    return [
                        'title' => $menu['text'] ?? $menu['title'] ?? 'Link',
                        'url' => $menu['link'] ?? $menu['url'] ?? '#'
                    ];
                }, $parsedMenus);
            }
        }

        // If no menus exist, use default structure with URLs
        if (empty($menus)) {
            $menus = [
                ['title' => "Scholarship", 'url' => "/scholarship"],
                ['title' => "Course, Eligibility & Fee Structure", 'url' => "/courses"],
                ['title' => "Admission Document & Undertaking", 'url' => "/admission-documents"],
                ['title' => "Admissions Office Contacts", 'url' => "/contact"],
                ['title' => "Hostel Details", 'url' => "/hostel"],
            ];
        }

        // Build the response structure
        $admissionData = [
            'left' => [
                'subtitle' => $admission->subtitle ?: "JOIN JSSATE NOIDA FOR 2025-26",
                'title' => $admission->title ?: "STEP INTO YOUR FUTURE AT JSS NOIDA",
                'desc' => $admission->description ?: "Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo.",
                'querytext' => "Any Query ? please mail us.",
                'email' => $admission->email ?: "principal@jssaten.ac.in",
                'phone' => $admission->phone ?: "+91-9311830458",
                'ctas' => [
                    [
                        'text' => $admission->program_button_text ?: "APPLY NOW",
                        'url' => $admission->apply_now_link ?: "/apply-now",
                        'type' => "primary"
                    ],
                    [
                        'text' => "DOWNLOAD SYLLABUS",
                        'url' => $admission->brochure ? asset($admission->brochure) : "/syllabus",
                        'type' => "secondary"
                    ],
                ],
            ],
            'middle' => [
                'links' => $menus,
                'stats' => [
                    'text' => $admission->program_text ?: "1,200+ ACROSS UG & PG PROGRAMS",
                    'subtext' => $admission->program_desc ?: "Total student intake (annual)",
                    'btnText' => [
                        'text' => "VIEW PROGRAMMES", 
                        'url' => $admission->program_button_url ?: "/programs"
                    ],
                ],
            ],
            'right' => [
                'img' => $admission->image ? asset($admission->image) : "/images/header/admission-banner.png",
                'alt' => "Admissions Image",
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $admissionData
        ]);
    }
}
