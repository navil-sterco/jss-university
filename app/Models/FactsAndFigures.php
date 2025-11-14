<?php

namespace App\Models;

use App\Models\Pages;
use App\Models\Course;
use App\Models\School;
use App\Models\Department;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class FactsAndFigures extends Model
{
    protected $fillable = [
        'title',
        'description',
        'figure',
        'image',
        'status',
        'show_on_home',
        'display_order',
    ];

    public function schools()
    {
        return $this->belongsToMany(School::class, 'facts_and_figures_school', 'facts_and_figures_id', 'school_id')->withTimestamps();
    }

    public function pages()
    {
        return $this->belongsToMany(Pages::class, 'facts_and_figures_page', 'facts_and_figures_id', 'page_id')->withTimestamps();
    }

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'facts_department', 'facts_id', 'department_id')->withTimestamps();
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'facts_courses', 'facts_id', 'course_id')->withTimestamps();
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
