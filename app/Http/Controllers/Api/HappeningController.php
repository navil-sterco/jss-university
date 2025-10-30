<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\School;
use App\Models\Happening;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class HappeningController extends Controller
{
    public function index(Request $request)
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
}
