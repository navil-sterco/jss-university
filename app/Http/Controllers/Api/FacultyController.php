<?php

namespace App\Http\Controllers\Api;

use App\Models\Type;
use App\Models\Faculty;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FacultyController extends Controller
{
    public function listing(Request $request)
    {
        try {
            $search = $request->input('search');
            $school = $request->input('school');
            $type = $request->input('type');

            $facultyQuery = Faculty::with('type')->where('status', 1);

            if ($search) {
                $facultyQuery->filter(['search' => $search]);
            }

            if ($school) {
                $facultyQuery->where('school_id', $school);
            }

            if ($type) {
                $facultyQuery->where('type_id', $type);
            }

            $perPage = 6;
            $page = $request->get('page', 1);

            $facultyPaginated = $facultyQuery->orderBy('display_order', 'asc')
                ->paginate($perPage, ['*'], 'page', $page);

            $facultyFormatted = $facultyPaginated->getCollection()->map(function ($faculty) {
                return [
                    'id' => $faculty->id,
                    'name' => $faculty->name,
                    'slug' => $faculty->slug,
                    'image' => $faculty->image ? asset($faculty->image) : asset('assets/img/placeholder.png'),
                    'type' => $faculty->type->name ?? 'N/A',
                    'type_id' => $faculty->type_id,
                    'display_order' => $faculty->display_order,
                    'status' => $faculty->status,
                ];
            });

            $facultyPaginated->setCollection($facultyFormatted);

            return response()->json([
                'success' => true,
                'data' => [
                    'faculty' => $facultyPaginated->items(),
                    'pagination' => [
                        'current_page' => $facultyPaginated->currentPage(),
                        'last_page' => $facultyPaginated->lastPage(),
                        'per_page' => $facultyPaginated->perPage(),
                        'total' => $facultyPaginated->total(),
                        'next_page_url' => $facultyPaginated->nextPageUrl(),
                        'prev_page_url' => $facultyPaginated->previousPageUrl(),
                    ],
                    'filters' => [
                        'search' => $search,
                        'school' => $school,
                        'type' => $type,
                    ]
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch faculty',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function detail($slug)
    {
        $faculty = Faculty::with(['type', 'school'])
            ->where('status', 1)
            ->where('slug', $slug)
            ->first();

        if (!$faculty) {
            return response()->json(['message' => 'Faculty not found'], 404);
        }

        return response()->json([
            'id' => $faculty->id,
            'name' => $faculty->name,
            'designation' => $faculty->type->name ?? null,
            'image' => $faculty->image ? asset($faculty->image) : asset('assets/img/placeholder.png'),
            'link' => '#',
            'school' => $faculty->school->name ?? null,
            'type' => $faculty->type->element ?? null,
            'profile' => $faculty->profile,
            'email' => $faculty->email,
            'linkedin' => $faculty->linkedin_url,
            'education' => $faculty->education ? json_decode($faculty->education, true) : [],
            'research' => $faculty->research ? array_map(function($researchItem) {
                return [
                    'title' => $researchItem['title'] ?? '',
                    'link' => $researchItem['link'] ?? '',
                    'image' => isset($researchItem['image']) ? asset($researchItem['image']) : ''
                ];
            }, json_decode($faculty->research, true)) : [],
            'teaching' => $faculty->teaching ? json_decode($faculty->teaching, true) : [],
            'awards' => $faculty->award ? json_decode($faculty->award, true) : [],
            'socialEngagement' => $faculty->social_engagement ? json_decode($faculty->social_engagement, true) : [],
        ]);
    }

    public function types()
    {
        $types = Type::select('id','name')->where('element','faculty')->get();

        return response()->json([
            'status' => true,
            'types' => $types,
        ]);
    }
}
