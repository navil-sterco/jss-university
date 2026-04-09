<?php

namespace App\Models;

use App\Models\Banner;
use App\Models\FactsAndFigures;
use App\Models\Faculty;
use App\Models\Faq;
use App\Models\Happening;
use App\Models\Leadership;
use App\Models\Pages;
use App\Models\Program;
use App\Models\Recruiter;
use App\Models\School;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    protected $fillable = [
        // Basic Info
        'name',
        'department_id',
        'menu_name',
        'school_id',
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
        'hod_messages_list',
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
        'name_of_laboratory',
        'name_of_equipment',
        'lab_images',

        'placement_title', 
        'placement_subtitle', 
        'hall_of_fame_image', 
        'hall_of_fame_heading',
        'hall_of_fame_url',

        // Program Count Section
        'department_title',
        'department_desc',
        'department_programs_count',
        'department_programs_text',
        'department_buttons',
    ];

    // Cast JSON fields to array automatically
    protected $casts = [
        'mission_points' => 'array',
        'hod_messages' => 'array',
        'hod_messages_list' => 'array',
        'usefull_links' => 'array',
        'name_of_laboratory' => 'array',
        'name_of_equipment' => 'array',
        'lab_images' => 'array',
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

    public function programs()
    {
        return $this->belongsToMany(Program::class, 'programs_department', 'department_id', 'program_id')->withTimestamps();
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

    public function pages()
    {
        return $this->belongsToMany(Pages::class, 'pages_department', 'department_id', 'page_id')->withTimestamps();
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'courses_department', 'department_id', 'course_id')->withTimestamps();
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
