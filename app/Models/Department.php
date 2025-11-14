<?php

namespace App\Models;

use App\Models\Faq;
use App\Models\Banner;
use App\Models\School;
use App\Models\Faculty;
use App\Models\Happening;
use App\Models\Recruiter;
use App\Models\Leadership;
use App\Models\Testimonial;
use App\Models\FactsAndFigures;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Department extends Model
{
    protected $fillable = [
        // Basic Info
        'name',
        'department_id',
        'menu_name',
        'name_short',
        'academic_year',
        'apply_now_link',
        'brochure',
        'useful_links',
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
        'hod_title',
        'hod_name',
        'hod_designation',
        'hod_messages', // JSON array
        'hod_image',

        // Tab 3: Courses
        'courses_title',
        'courses_subtitle',
        'courses_image',

        // Tab 4: Faculty
        'faculty_title',
        'faculty_subtitle',

        // Tab 5: Laboratories
        'lab_title',
        'lab_subtitle',
        'lab_description',
        'lab_url',

        // Tab 6: Happening
        'happening_title',
        'happening_subtitle',
    ];

    // Cast JSON fields to array automatically
    protected $casts = [
        'mission_points' => 'array',
        'hod_messages' => 'array',
        'usefull_links' => 'array',
    ];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function banners()
    {
        return $this->belongsToMany(Banner::class, 'banners_department', 'department_id', 'banner_id');
    }

    public function testimonials()
    {
        return $this->belongsToMany(Testimonial::class, 'testimonials_department', 'department_id', 'testimonial_id')->withTimestamps();
    }

    public function happenings()
    {
        return $this->belongsToMany(Happening::class, 'happenings_department', 'department_id', 'happening_id')->withTimestamps();
    }

    public function recruiters()
    {
        return $this->belongsToMany(Recruiter::class, 'recruiters_department', 'department_id', 'recruiter_id')->withTimestamps();
    }

    public function factsAndFigures()
    {
        return $this->belongsToMany(FactsAndFigures::class, 'facts_department', 'department_id', 'facts_id')->withTimestamps();
    }

    public function faqs()
    {
        return $this->belongsToMany(Faq::class, 'faqs_department', 'department_id', 'faq_id')->withTimestamps();
    }

    public function faculties()
    {
        return $this->belongsToMany(Faculty::class, 'faculties_department', 'department_id', 'faculty_id')->withTimestamps();
    }

    public function leaderships()
    {
        return $this->belongsToMany(Leadership::class, 'leaderships_department', 'department_id', 'leadership_id')->withTimestamps();
    }


    public function scopeFilter(Builder $query, $filters)
    {
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%");
            });
        }
    }
}
