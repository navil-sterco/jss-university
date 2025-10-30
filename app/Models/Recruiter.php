<?php

namespace App\Models;

use App\Models\Pages;
use App\Models\School;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Recruiter extends Model
{
    protected $fillable = [
        'title',
        'image',
        'description',
        'status',
        'show_on_home',
        'display_order',
    ];

    public function schools()
    {
        return $this->belongsToMany(School::class, 'recruiters_school', 'recruiter_id', 'school_id')->withTimestamps();
    }

    public function pages()
    {
        return $this->belongsToMany(Pages::class, 'recruiters_page', 'recruiter_id', 'page_id')->withTimestamps();
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
