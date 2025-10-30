<?php

namespace App\Models;

use App\Models\Pages;
use App\Models\School;
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
    
    public function scopeFilter(Builder $query, $filters)
    {
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['search']}%");
            });
        }
    }
}
