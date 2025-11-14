<?php

namespace App\Models;

use App\Models\Pages;
use App\Models\Course;
use App\Models\School;
use App\Models\Gallery;
use App\Models\Department;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Happening extends Model
{
    protected $fillable = [
        'event_type',
        'title',
        'slug',
        'alt_text',
        'image',
        'banner_images',
        'pdf',
        'pdf_title',
        'video',
        'event_date_from',
        'event_date_to',
        'short_description',
        'description',
        'display_order',
        'show_on_home',
        'status',
        'school_id',
    ];
    
    public function schools()
    {
        return $this->belongsToMany(School::class, 'happening_school', 'happening_id', 'school_id')->withTimestamps();
    }

    public function pages()
    {
        return $this->belongsToMany(Pages::class, 'happening_page', 'happening_id', 'page_id')->withTimestamps();
    }

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'happenings_department', 'happening_id', 'department_id')->withTimestamps();
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'happenings_courses', 'happening_id', 'course_id')->withTimestamps();
    }

    public function galleries()
    {
        return $this->belongsToMany(Gallery::class, 'gallery_happening', 'happening_id', 'gallery_id');
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
