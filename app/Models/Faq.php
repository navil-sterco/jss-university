<?php

namespace App\Models;

use App\Models\Pages;
use App\Models\Course;
use App\Models\School;
use App\Models\Department;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Faq extends Model
{
    protected $fillable = [
        'question',
        'answer',
        'status',
        'display_order',
    ];

    public function schools()
    {
        return $this->belongsToMany(School::class, 'faqs_school', 'faq_id', 'school_id')->withTimestamps();
    }

    public function pages()
    {
        return $this->belongsToMany(Pages::class, 'faqs_page', 'faq_id', 'page_id')->withTimestamps();
    }
    

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'faqs_department', 'faq_id', 'department_id')->withTimestamps();
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'faqs_courses', 'faq_id', 'course_id')->withTimestamps();
    }

    public function scopeFilter(Builder $query, $filters)
    {
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('question', 'like', "%{$filters['search']}%");
            });
        }
    }
}
