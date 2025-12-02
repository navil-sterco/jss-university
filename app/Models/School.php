<?php

namespace App\Models;

use App\Models\Banner;
use App\Models\Happening;
use App\Models\Recruiter;
use App\Models\Department;
use App\Models\Testimonial;
use App\Models\FactsAndFigures;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class School extends Model
{
    protected $fillable = [
        'name', 'menu_name', 'name_short', 'short_description', 'slug', 'image',
        'program_image', 'course_image', 'prospectus', 'alt_prospectus', 'icons',
        'thumbnail_image', 'status', 'display_order', 'academic_years', 'dean_message',
        'mobile_contact', 'virtual_tour', 'virtual_display_order','apply_now_link',
        'useful_links',

        'about_school_title', 'about_school_subtitle', 'about_school_description',
        'about_school_url', 'about_school_chancellor_img', 'about_school_chancellor_logo',
        'about_school_logo_content', 'about_school_stats_number', 'about_school_stats_content',
        'about_highlights', 'about_buttons',

        'department_title', 'department_desc', 'department_programs_count',
        'department_programs_text', 'department_buttons',

        'placement_title', 'placement_subtitle', 'hall_of_fame_image', 'hall_of_fame_heading',
        'hall_of_fame_url', 'testimonial_title', 'testimonial_subtitle', 'happening_title',
        'happening_subtitle',
    ];

    protected $casts = [
        'about_highlights' => 'array',
        'about_buttons' => 'array',
        'department_buttons' => 'array',
        'useful_links' => 'array',
    ];

    public function banners()
    {
        return $this->belongsToMany(Banner::class, 'banner_school', 'school_id', 'banner_id');
    }

    public function testimonials()
    {
        return $this->belongsToMany(Testimonial::class, 'testimonial_school', 'school_id', 'testimonial_id')->withTimestamps();
    }

    public function happenings()
    {
        return $this->belongsToMany(Happening::class, 'happening_school', 'school_id', 'happening_id')->withTimestamps();
    }

    public function recruiters()
    {
        return $this->belongsToMany(Recruiter::class, 'recruiters_school', 'school_id', 'recruiter_id')->withTimestamps();
    }

    public function factsAndFigures()
    {
        return $this->belongsToMany(FactsAndFigures::class, 'facts_and_figures_school', 'school_id', 'facts_and_figures_id')->withTimestamps();
    }

    public function departments()
    {
        return $this->hasMany(Department::class);
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
