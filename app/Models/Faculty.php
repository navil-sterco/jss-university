<?php

namespace App\Models;

use App\Models\Type;
use App\Models\Pages;
use App\Models\Course;
use App\Models\School;
use App\Models\Department;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Faculty extends Model
{
    protected $fillable = [
        'type_id',
        'school_id',
        'name',
        'slug',
        'email',
        'profile',
        'image',
        'linkedin_url',
        'education',
        'research', 
        'teaching',
        'award',
        'social_engagement',
        'status',
        'display_order',
    ];

    protected $casts = [
        'education' => 'array',
        'research' => 'array',
        'teaching' => 'array',
        'award' => 'array',
        'social_engagement' => 'array',
        'status' => 'boolean',
    ];

    public function schools()
    {
        return $this->belongsToMany(School::class, 'faculties_school', 'faculty_id', 'school_id')->withTimestamps();
    }

    public function pages()
    {
        return $this->belongsToMany(Pages::class, 'faculties_page', 'faculty_id', 'page_id')->withTimestamps();
    }

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'faculties_department', 'faculty_id', 'department_id')->withTimestamps();
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'faculties_courses', 'faculty_id', 'course_id')->withTimestamps();
    }

    public function type()
    {
        return $this->belongsTo(Type::class, 'type_id');
    }

    public function school()
    {
        return $this->belongsTo(School::class, 'school_id');
    }

    protected function formattedEducation(): Attribute
    {
        return Attribute::make(
            get: fn () => array_filter($this->education ?? []),
        );
    }

    protected function formattedResearch(): Attribute
    {
        return Attribute::make(
            get: fn () => array_filter($this->research ?? []),
        );
    }

    protected function formattedTeaching(): Attribute
    {
        return Attribute::make(
            get: fn () => array_filter($this->teaching ?? []),
        );
    }

    protected function formattedAward(): Attribute
    {
        return Attribute::make(
            get: fn () => array_filter($this->award ?? []),
        );
    }

    protected function formattedSocialEngagement(): Attribute
    {
        return Attribute::make(
            get: fn () => array_filter($this->social_engagement ?? []),
        );
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
