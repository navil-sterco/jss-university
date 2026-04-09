<?php

namespace App\Models;

use App\Models\Type;
use App\Models\LeadershipCategory;
use App\Models\Pages;
use App\Models\Course;
use App\Models\School;
use App\Models\Department;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Leadership extends Model
{
    protected $fillable = [
        'type_id',
        'category_id',
        'name',
        'slug',
        'image',
        'banner_image',
        'video',
        'page_type',
        'message_image',
        'short_description',
        'description',
        'biography', 
        'message',
        'display_order',
        'status',
    ];

    protected $casts = [
        'description' => 'array',
        'message' => 'array',
    ];

    public function schools()
    {
        return $this->belongsToMany(School::class, 'leaderships_school', 'leadership_id', 'school_id')->withTimestamps();
    }

    public function pages()
    {
        return $this->belongsToMany(Pages::class, 'leaderships_page', 'leadership_id', 'page_id')->withTimestamps();
    }

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'leaderships_department', 'leadership_id', 'department_id')->withTimestamps();
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'leaderships_courses', 'leadership_id', 'course_id')->withTimestamps();
    }

    public function type()
    {
        return $this->belongsTo(Type::class, 'type_id');
    }

    public function category()
    {
        return $this->belongsTo(LeadershipCategory::class, 'category_id');
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
