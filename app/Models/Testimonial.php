<?php

namespace App\Models;

use App\Models\Pages;
use App\Models\Course;
use App\Models\School;
use App\Models\Department;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Testimonial extends Model
{
    protected $fillable = [
        'type',
        'title',
        'slug',
        'alt_text',
        'image',
        'video_url',
        'short_description',
        'name',
        'batch',
        'course',
        'description',
        'designation',
        'location',
        'company',
        'status',
        'show_on_home',
        'display_order',
    ];

    public function schools()
    {
        return $this->belongsToMany(School::class, 'testimonial_school', 'testimonial_id', 'school_id')->withTimestamps();
    }

    public function pages()
    {
        return $this->belongsToMany(Pages::class, 'testimonial_page', 'testimonial_id', 'page_id')->withTimestamps();
    }

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'testimonials_department', 'testimonial_id', 'department_id')->withTimestamps();
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'testimonials_courses', 'testimonial_id', 'course_id')->withTimestamps();
    }
    
    public function scopeFilter(Builder $query, $filters)
    {
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['search']}%");
            });
        }
    }
}
