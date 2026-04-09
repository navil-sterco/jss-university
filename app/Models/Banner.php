<?php

namespace App\Models;

use App\Models\Pages;
use App\Models\Course;
use App\Models\School;
use App\Models\Department;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Banner extends Model
{
    protected $fillable = [
        'heading',
        'subheading',
        'linked_text',
        'link',
        'image',
        'mobile_image',
        'video_desktop',
        'video_mobile',
        'video_url',
        'display_order',
        'status',
        'show_on_home',
    ];

    public function schools()
    {
        return $this->belongsToMany(School::class, 'banner_school', 'banner_id', 'school_id')->withTimestamps();
    }

    public function pages()
    {
        return $this->belongsToMany(Pages::class, 'banner_page', 'banner_id', 'page_id')->withTimestamps();
    }

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'banners_department', 'banner_id', 'department_id')->withTimestamps();
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'banners_courses', 'banner_id', 'course_id')->withTimestamps();
    }

    public function scopeFilter(Builder $query, $filters)
    {
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('heading', 'like', "%{$filters['search']}%");
            });
        }
    }
}
