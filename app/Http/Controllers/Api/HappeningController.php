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
            $today = Carbon::today();

            $upcomingQuery = Happening::where('status', 1)
                ->whereDate('event_date_from', '>=', $today);

            $otherQuery = Happening::where('status', 1)
                ->whereDate('event_date_from', '<', $today);

            if ($request->filled('month')) {
                $upcomingQuery->whereMonth('event_date_from', $request->month);
                $otherQuery->whereMonth('event_date_from', $request->month);
            }

            if ($request->filled('school')) {
                $upcomingQuery->where('school_id', $request->school);
                $otherQuery->where('school_id', $request->school);
            }

            $upcomingEvents = $upcomingQuery->orderBy('display_order', 'asc')
                ->get(['id', 'title', 'event_type', 'banner_images', 'short_description', 'event_date_from']);

            $upcomingEventsFormatted = $upcomingEvents->map(fn($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'event_type' => $event->event_type,
                'banner_image' => $event->banner_images ? asset($event->banner_images) : null,
                'desc' => $event->short_description,
                'event_date_from' => $event->event_date_from,
            ]);

            $firstEvent = $otherQuery->orderBy('display_order', 'asc')->first();

            $firstEventFormatted = $firstEvent ? [
                'id' => $firstEvent->id,
                'title' => $firstEvent->title,
                'event_type' => $firstEvent->event_type,
                'banner_image' => $firstEvent->banner_images ? asset($firstEvent->banner_images) : null,
                'desc' => $firstEvent->short_description,
                'event_date_from' => $firstEvent->event_date_from,
            ] : null;

            $perPage = 8;
            $page = $request->get('page', 1);

            $otherEventsQuery = $otherQuery->where('id', '!=', optional($firstEvent)->id)
                ->orderBy('display_order', 'asc');

            $otherEventsPaginated = $otherEventsQuery->paginate($perPage, ['id', 'title', 'event_type', 'banner_images', 'short_description', 'event_date_from'], 'page', $page);

            $otherEventsFormatted = $otherEventsPaginated->getCollection()->map(fn($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'event_type' => $event->event_type,
                'banner_image' => $event->banner_images ? asset($event->banner_images) : null,
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
        $happening = Happening::with('galleries')->where('slug', $slug)->first();
        
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
                    'content' => $this->formatDescription($happening->description ?: $happening->short_description),
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
        try {
            $today = Carbon::today();

            $upcomingQuery = Happening::where('status', 1)->where('event_type','Gallery')
                ->whereDate('event_date_from', '>=', $today);

            $otherQuery = Happening::where('status', 1)->where('event_type','Gallery')
                ->whereDate('event_date_from', '<', $today);

            if ($request->filled('month')) {
                $upcomingQuery->whereMonth('event_date_from', $request->month);
                $otherQuery->whereMonth('event_date_from', $request->month);
            }

            if ($request->filled('school')) {
                $upcomingQuery->where('school_id', $request->school);
                $otherQuery->where('school_id', $request->school);
            }

            $upcomingEvents = $upcomingQuery->orderBy('display_order', 'asc')
                ->get(['id', 'title', 'event_type', 'banner_images', 'short_description', 'event_date_from']);

            $upcomingEventsFormatted = $upcomingEvents->map(fn($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'banner_image' => $event->banner_images ? asset($event->banner_images) : null,
                'event_type' => $event->event_type,
                'event_date_from' => $event->event_date_from,
            ]);

            $firstEvent = $otherQuery->orderBy('display_order', 'asc')->first();

            $firstEventFormatted = $firstEvent ? [
                'id' => $firstEvent->id,
                'title' => $firstEvent->title,
                'date' => $firstEvent->event_date_from ? Carbon::parse($firstEvent->event_date_from)->format('F d, Y') : null,
                'stats' => [
                    'photos' => rand(20, 60), // Assuming you'll replace with actual counts
                    'videos' => rand(5, 20),  // Assuming you'll replace with actual counts
                ],
                'thumbnail' => $firstEvent->banner_images ? asset($firstEvent->banner_images) : null,
                'media' => $this->getGalleryMedia($firstEvent), // Helper function to get media
            ] : null;

            $perPage = 8;
            $page = $request->get('page', 1);

            $otherEventsQuery = $otherQuery->where('id', '!=', optional($firstEvent)->id)
                ->orderBy('display_order', 'asc');

            $otherEventsPaginated = $otherEventsQuery->paginate($perPage, ['id', 'title', 'event_type', 'banner_images', 'short_description', 'event_date_from'], 'page', $page);

            $otherEventsFormatted = $otherEventsPaginated->getCollection()->map(fn($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'date' => $event->event_date_from ? Carbon::parse($event->event_date_from)->format('F d, Y') : null,
                'stats' => [
                    'photos' => rand(20, 60), // Assuming you'll replace with actual counts
                    'videos' => rand(5, 20),  // Assuming you'll replace with actual counts
                ],
                'thumbnail' => $event->banner_images ? asset($event->banner_images) : null,
                'media' => $this->getGalleryMedia($event), // Helper function to get media
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
                'message' => 'Failed to fetch gallery',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    private function getGalleryMedia($event)
    {

        $media = [];
        
        if ($event->banner_images) {
            $media[] = [
                'type' => 'image',
                'url' => asset($event->banner_images),
                'alt' => $event->title . ' Image 1',
            ];
        }
        
        for ($i = 2; $i <= 4; $i++) {
            if (rand(0, 1)) {
                $media[] = [
                    'type' => 'image',
                    'url' => '/images/home-page/gallary-popup-dummy-banner.png',
                    'alt' => $event->title . ' Image ' . $i,
                ];
            } else {
                $media[] = [
                    'type' => 'video',
                    'url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    'alt' => $event->title . ' Video ' . ($i - 1),
                ];
            }
        }
        
        return $media;
    }

    public function mediaCoverage()
    {
        $mediaGalleries = Gallery::where('type', 'media_coverage')->get();

        $galleryData = $mediaGalleries->map(function ($gallery, $index) {
            $mediaItems = collect();

            // Handle images
            if (is_array($gallery->images)) {
                foreach ($gallery->images as $i => $image) {
                    $mediaItems->push([
                        'type' => 'image',
                        'url' => asset($image),
                        'alt' => 'Gallery Image ' . ($i + 1),
                    ]);
                }
            }

            // Handle videos (if available)
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


    public function pressRlease()
    {
        $pressReleases = Gallery::where('type', 'notice_announcement')->get();

        $documentsData = $pressReleases->map(function ($item, $index) {
            return [
                'id' => $item->id,
                'title' => $item->title ?? 'Untitled Document',
                'date' => $item->event_date
                    ? \Carbon\Carbon::parse($item->event_date)->format('j F Y')
                    : null,
                'pdfUrl' => $item->pdf ? asset($item->pdf) : null,
            ];
        });

        return response()->json($documentsData);
    }
}
