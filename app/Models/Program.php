<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Program extends Model
{
    protected $fillable = [
        'name',
        'menu_name',
        'name_short',
        'image',
        'alternate_image',
        'slug',
        'display_order',
        'status',
        'title',
        'description',
    ];

    public function scopeFilter(Builder $query, $filters)
    {
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%");
            });
        }
    }

    public function schools()
    {
        return $this->belongsToMany(School::class, 'programs_school', 'program_id', 'school_id')->withTimestamps();
    }

    public function pages()
    {
        return $this->belongsToMany(Pages::class, 'programs_page', 'program_id', 'page_id')->withTimestamps();
    }

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'programs_department', 'program_id', 'department_id')->withTimestamps();
    }
}
