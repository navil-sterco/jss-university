<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Department extends Model
{
    protected $fillable = [
        // Basic Info
        'name',
        'school_id',
        'menu_name',
        'name_short',
        'slug',
        'display_order',

        // Tab 1: About Department
        'title',
        'subtitle',
        'description',
        'vision_title',
        'vision_description',
        'mission_title',
        'mission_points', // JSON array
        'image',
        'tab_display_order',
        'status',

        // Tab 2: Dean/HOD Message
        'hod_name',
        'hod_designation',
        'hod_messages', // JSON array
        'hod_image',

        // Tab 3: Courses
        'courses_title',
        'courses_image',

        // Tab 4: Faculty
        'faculty_title',
        'faculty_subtitle',

        // Tab 5: Laboratories
        'lab_title',
        'lab_subtitle',

        // Tab 6: Happening
        'happening_title',
        'happening_subtitle',
    ];

    // Cast JSON fields to array automatically
    protected $casts = [
        'mission_points' => 'array',
        'hod_messages' => 'array',
    ];

    public function scopeFilter(Builder $query, $filters)
    {
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%");
            });
        }
    }
}
