<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\School;
use App\Models\Gallery;
use App\Models\Happening;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class HappeningController extends Controller
{
    public function happenings(Request $request)
    {
        try {
            $validated = $request->validate([
                'month' => 'nullable|integer|min:1|max:12',
                'school' => 'nullable|integer|exists:schools,id',
                'department' => 'nullable|integer|exists:departments,id',
                'page' => 'nullable|integer|min:1'
            ]);
            $today = Carbon::today();

            $upcomingQuery = Happening::with('schools:id,name','departments:id,name')->where('status', 1)
                ->whereDate('event_date_from', '>=', $today);

            $otherQuery = Happening::with('schools:id,name','departments:id,name')->where('status', 1)
                ->whereDate('event_date_from', '<', $today);

            if ($request->filled('month')) {
                $upcomingQuery->whereMonth('event_date_from', $validated['month']);
                $otherQuery->whereMonth('event_date_from', $validated['month']);
            }

            if ($request->filled('school')) {
                $upcomingQuery->whereHas('schools', function ($q) use ($validated) {
                    $q->where('school_id', $validated['school']);
                });

                $otherQuery->whereHas('schools', function ($q) use ($validated) {
                    $q->where('school_id', $validated['school']);
                });
            }

            if ($request->filled('department')) {
                $upcomingQuery->whereHas('departments', function ($q) use ($validated) {
                    $q->where('department_id', $validated['department']);
                });

                $otherQuery->whereHas('departments', function ($q) use ($validated) {
                    $q->where('department_id', $validated['department']);
                });
            }

            $upcomingEvents = $upcomingQuery->orderBy('display_order', 'asc')
                ->get(['id', 'title', 'event_type', 'slug', 'banner_images', 'short_description', 'event_date_from']);

            $upcomingEventsFormatted = $upcomingEvents->map(fn($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'event_type' => $event->event_type,
                'banner_image' => $event->banner_images ? asset($event->banner_images) : null,
                'desc' => $event->short_description,
                'event_date_from' => $event->event_date_from,
            ]);

            if ($request->filled('school')) {
                $firstEvent = Happening::with('schools:id,name')->where('status', 1)
                ->whereDate('event_date_from', '<', $today)->whereHas('schools', function ($q) use ($validated) {
                    $q->where('school_id', $validated['school']);
                })->orderBy('display_order', 'asc')->first();
            }
            else if($request->filled('department')){
                $firstEvent = Happening::with('departments:id,name')->where('status', 1)
                ->whereDate('event_date_from', '<', $today)->whereHas('departments', function ($q) use ($validated) {
                    $q->where('department_id', $validated['department']);
                })->orderBy('display_order', 'asc')->first();
            }
            else{
                $firstEvent = Happening::where('status', 1)->orderBy('display_order', 'asc')->first();
            }

            $firstEventFormatted = $firstEvent ? [
                'id' => $firstEvent->id,
                'title' => $firstEvent->title,
                'slug' => $firstEvent->slug,
                'event_type' => $firstEvent->event_type,
                'banner_image' => $firstEvent->banner_images ? asset($firstEvent->banner_images) : null,
                'desc' => $firstEvent->short_description,
                'event_date_from' => $firstEvent->event_date_from,
            ] : null;

            $perPage = 8;
            $page = $request->get('page', 1);

            $otherEventsQuery = $otherQuery->where('id', '!=', optional($firstEvent)->id)
                ->orderBy('display_order', 'asc');

            $otherEventsPaginated = $otherEventsQuery->paginate($perPage, ['id', 'title', 'event_type', 'slug', 'image', 'short_description', 'event_date_from'], 'page', $page);

            $otherEventsFormatted = $otherEventsPaginated->getCollection()->map(fn($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'event_type' => $event->event_type,
                'banner_image' => $event->image ? asset($event->image) : null,
                'desc' => $event->short_description,
                'event_date_from' => $event->event_date_from,
            ]);

            $otherEventsPaginated->setCollection($otherEventsFormatted);

            return response()->json([
                'success' => true,
                'data' => [
                    'upcoming_events' => $upcomingEventsFormatted,
                    'first_event' => $firstEventFormatted,
                    'other_events' => $otherEventsPaginated->items(),
                    'pagination' => [
                        'current_page' => $otherEventsPaginated->currentPage(),
                        'last_page' => $otherEventsPaginated->lastPage(),
                        'per_page' => $otherEventsPaginated->perPage(),
                        'total' => $otherEventsPaginated->total(),
                        'next_page_url' => $otherEventsPaginated->nextPageUrl(),
                        'prev_page_url' => $otherEventsPaginated->previousPageUrl(),
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch happenings',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($slug)
    {
        $happening = Happening::with('galleries')->where('status', 1)->where('slug', $slug)->first();
        
        if (!$happening) {
            return response()->json([
                'success' => false,
                'message' => 'Happening not found'
            ], 404);
        }

        $happeningsData = [
            'innerTitle' => [
                'date' => $this->formatEventDate($happening->event_date_from, $happening->event_date_to),
                'heading' => $happening->title,
                'icons' => [
                    ['src' => "/images/custom-page/printIcon.svg"],
                    ['src' => "/images/custom-page/shareIcon.svg"],
                ],
            ],
            'mainBanner' => [
                'img' => $happening->banner_images ? asset($happening->banner_images) : "/images/custom-page/happni-banner.webp",
                'alt' => $happening->alt_text ?: $happening->title,
            ],
            'sections' => [
                [
                    'smallImg' => $happening->image ? asset($happening->image) : "/images/custom-page/happsmall.webp",
                    'content' => $happening->description,
                ],
            ],
            'related' => $this->getRelatedHappenings($happening->id),
            'gallery' => $this->formatGalleryData($happening->galleries),
        ];

        return response()->json([
            'success' => true,
            'data' => $happeningsData
        ]);
    }

    private function formatGalleryData($galleries)
    {
        if ($galleries->isEmpty()) {
            return [
                'images' => [],
                'videos' => [],
                'documents' => []
            ];
        }

        $galleryData = [
            'images' => [],
            'videos' => [],
            'documents' => []
        ];

        foreach ($galleries as $gallery) {
            // Process Images
            if ($gallery->images && is_array($gallery->images)) {
                foreach ($gallery->images as $image) {
                    if ($image) {
                        $galleryData['images'][] = [
                            'url' => asset($image),
                            'alt' => $gallery->title ?: 'Gallery Image',
                            'title' => $gallery->title,
                            'type' => $gallery->type ?: 'gallery',
                            'event_date' => $gallery->event_date ? \Carbon\Carbon::parse($gallery->event_date)->format('M d, Y') : null,
                        ];
                    }
                }
            }

            // Process Videos
            if ($gallery->videos && is_array($gallery->videos)) {
                foreach ($gallery->videos as $video) {
                    if ($video) {
                        $galleryData['videos'][] = [
                            'url' => $video,
                            'title' => $gallery->title,
                            'type' => $gallery->type ?: 'gallery',
                            'event_date' => $gallery->event_date ? \Carbon\Carbon::parse($gallery->event_date)->format('M d, Y') : null,
                        ];
                    }
                }
            }

            // Process PDF
            if ($gallery->pdf) {
                $galleryData['documents'][] = [
                    'url' => asset($gallery->pdf),
                    'title' => $gallery->title ?: 'Document',
                    'type' => 'pdf',
                    'event_date' => $gallery->event_date ? \Carbon\Carbon::parse($gallery->event_date)->format('M d, Y') : null,
                ];
            }
        }

        return $galleryData;
    }

    private function formatEventDate($dateFrom, $dateTo)
    {
        if (!$dateFrom) return "Date to be announced";
        
        $from = \Carbon\Carbon::parse($dateFrom);
        
        if ($dateTo && $dateFrom != $dateTo) {
            $to = \Carbon\Carbon::parse($dateTo);
            if ($from->format('Y') === $to->format('Y')) {
                if ($from->format('M') === $to->format('M')) {
                    return $from->format('M d') . ' - ' . $to->format('d, Y');
                }
                return $from->format('M d') . ' - ' . $to->format('M d, Y');
            }
            return $from->format('M d, Y') . ' - ' . $to->format('M d, Y');
        }
        
        return $from->format('M d, Y');
    }

    private function formatDescription($description)
    {
        if (!$description) {
            return [
                "Event details are being finalized. Please check back soon for more information about this exciting happening.",
                "We're working hard to bring you all the details about this event. Stay tuned for updates on speakers, schedule, and registration information.",
                "For any immediate queries, please contact our events team."
            ];
        }

        // Clean and split the description
        $description = strip_tags($description);
        $paragraphs = preg_split('/\n\s*\n/', $description);
        
        $content = array_filter(array_map('trim', $paragraphs));
        
        return !empty($content) ? array_values($content) : [
            "Detailed information about this event will be available soon.",
            "We appreciate your interest and look forward to sharing more details with you."
        ];
    }

    private function getRelatedHappenings($currentId, $limit = 2)
    {
        $related = Happening::where('id', '!=', $currentId)
            ->where('status', 1)
            ->where(function($query) {
                $query->where('event_date_from', '>=', now())
                    ->orWhereNull('event_date_from');
            })
            ->inRandomOrder()
            ->limit($limit)
            ->get()
            ->map(function ($item) {
                return [
                    'img' => $item->image ? asset($item->image) : "/images/custom-page/reletedImg.webp",
                    'alt' => $item->alt_text ?: $item->title,
                    'title' => $item->title,
                    'slug' => $item->slug,
                    'date' => $item->event_date_from ? \Carbon\Carbon::parse($item->event_date_from)->format('M d, Y') : 'Coming Soon',
                    'type' => $item->event_type ?: 'Event'
                ];
            })
            ->toArray();

        // Fill with placeholder data if needed
        $defaults = [
            [
                'img' => "/images/custom-page/reletedImg.webp",
                'alt' => "Upcoming Event",
                'title' => "More Events Coming Soon",
                'slug' => "#",
                'date' => 'Stay Tuned',
                'type' => 'Event'
            ],
            [
                'img' => "/images/custom-page/reletedImg.webp", 
                'alt' => "Future Event",
                'title' => "Exciting Events Ahead",
                'slug' => "#",
                'date' => 'Coming Soon',
                'type' => 'Event'
            ]
        ];

        for ($i = count($related); $i < $limit; $i++) {
            $related[] = $defaults[$i] ?? $defaults[0];
        }

        return array_slice($related, 0, $limit);
    }

    public function gallery(Request $request)
    {
        $filter = $request->query('filter'); // image | video | both
        $schoolId = $request->query('school');
        $departmentId = $request->query('department');
        $perPage = 9;
        $page = $request->get('page', 1);

        $query = Gallery::where('type', 'gallery');

        // Filter by school
        if ($schoolId) {
            $query->whereHas('schools', function ($q) use ($schoolId) {
                $q->where('school_id', $schoolId);
            });
        }

        // Filter by department
        if ($departmentId) {
            $query->whereHas('departments', function ($q) use ($departmentId) {
                $q->where('sdepartment_id', $departmentId);
            });
        }

        // Filter logic
        if ($filter === 'video') {
            $query->where(function ($q) {
                $q->whereJsonLength('videos', '>', 0)
                ->orWhereNotNull('video_url');
            });
        } elseif ($filter === 'image') {
            $query->whereJsonLength('images', '>', 0);
        }

        // Helper to merge media
        $formatMedia = function ($item) use ($filter) {
            $media = collect();

            // Images
            if ($filter !== 'video' && is_array($item->images)) {
                foreach ($item->images as $i => $img) {
                    $media->push([
                        'type' => 'image',
                        'url' => asset($img),
                        'alt' => 'Gallery Image ' . ($i + 1),
                    ]);
                }
            }

            // Videos (JSON column)
            if ($filter !== 'image' && is_array($item->videos)) {
                foreach ($item->videos as $i => $vid) {
                    $media->push([
                        'type' => 'video',
                        'url' => asset($vid),
                        'alt' => 'Gallery Video ' . ($i + 1),
                    ]);
                }
            }

            // Video URL column
            if ($filter !== 'image' && !empty($item->video_url)) {
                $media->push([
                    'type' => 'video',
                    'url' => $item->video_url,
                    'alt' => 'Gallery Video',
                ]);
            }

            return $media->values();
        };

        // Paginated data
        $paginated = $query
            ->orderBy('event_date', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        $galleryData = $paginated->getCollection()->map(function ($item) use ($formatMedia) {

            $media = $formatMedia($item);

            return [
                'id' => $item->id,
                'title' => $item->title,
                'date' => $item->event_date,
                'stats' => [
                    'photos' => is_array($item->images) ? count($item->images) : 0,
                    'videos' => (is_array($item->videos) ? count($item->videos) : 0)
                                + (!empty($item->video_url) ? 1 : 0),
                ],
                'video_url' => $item->video_url,
                'video' => !empty($item->videos[0])
                            ? asset($item->videos[0])
                            :  null,
                'thumbnail' => $media->first()['url'] ?? asset('assets/img/placeholder.png'),
                'media' => $media
            ];
        });

        return response()->json([
            'gallery_data' => $galleryData,
            'pagination' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ]
        ]);
    }

    public function mediaCoverage(Request $request)
    {
        $schoolId = $request->query('school');
        $departmentId = $request->query('department');

        $query = Gallery::where('type', 'media_coverage');

        if ($schoolId) {
            $query->whereHas('schools', function ($q) use ($schoolId) {
                $q->where('school_id', $schoolId);
            });
        }
        if ($departmentId) {
            $query->whereHas('departments', function ($q) use ($departmentId) {
                $q->where('departments_id', $departmentId);
            });
        }

        $mediaGalleries = $query->get();

        $galleryData = $mediaGalleries->map(function ($gallery, $index) {
            $mediaItems = collect();

            if (is_array($gallery->images)) {
                foreach ($gallery->images as $i => $image) {
                    $mediaItems->push([
                        'type' => 'image',
                        'url' => asset($image),
                        'alt' => 'Gallery Image ' . ($i + 1),
                    ]);
                }
            }

            if (is_array($gallery->videos)) {
                foreach ($gallery->videos as $i => $video) {
                    $mediaItems->push([
                        'type' => 'video',
                        'url' => asset($video),
                        'alt' => 'Gallery Video ' . ($i + 1),
                    ]);
                }
            }

            return [
                'id' => $gallery->id,
                'thumbnail' => $mediaItems->first()['url'] ?? asset('assets/img/placeholder.png'),
                'media' => $mediaItems->values(),
            ];
        });

        return response()->json($galleryData);
    }

    public function pressRlease(Request $request)
    {
        $schoolId = $request->query('school');
        $departmentId = $request->query('department');

        $query = Gallery::where('type', 'notice_announcement');

        if ($schoolId) {
            $query->whereHas('schools', function ($q) use ($schoolId) {
                $q->where('school_id', $schoolId);
            });
        }
        if ($departmentId) {
            $query->whereHas('departments', function ($q) use ($departmentId) {
                $q->where('department_id', $departmentId);
            });
        }

        $pressReleases = $query->get();

        $documentsData = $pressReleases->map(function ($item, $index) {
            return [
                'id' => $item->id,
                'title' => $item->title ?? 'Untitled Document',
                'date' => $item->event_date
                    ? Carbon::parse($item->event_date)->format('j F Y')
                    : null,
                'pdfUrl' => $item->pdf ? asset($item->pdf) : null,
            ];
        });

        return response()->json($documentsData);
    }

    public function count(Request $request)
    {
        $schoolId = $request->query('school');
        $departmentId = $request->query('department');

        // Base query with filters
        $baseQuery = Gallery::query();

        if ($schoolId) {
            $baseQuery->whereHas('schools', function ($q) use ($schoolId) {
                $q->where('school_id', $schoolId);
            });
        }

        if ($departmentId) {
            $baseQuery->whereHas('departments', function ($q) use ($departmentId) {
                $q->where('department_id', $departmentId);
            });
        }

        // Clone and count for each type
        $galleryCount = (clone $baseQuery)
            ->where('type', 'gallery')
            ->count();

        $mediaCoverageCount = (clone $baseQuery)
            ->where('type', 'media_coverage')
            ->count();

        $pressReleaseCount = (clone $baseQuery)
            ->where('type', 'notice_announcement')
            ->count();

        // Total count
        $totalCount = $galleryCount + $mediaCoverageCount + $pressReleaseCount;

        return response()->json([
            'gallery_count' => $galleryCount,
            'media_coverage_count' => $mediaCoverageCount,
            'press_release_count' => $pressReleaseCount,
            'newsletter' => 10,
            'total_count' => $totalCount,
        ]);
    }

    
}
