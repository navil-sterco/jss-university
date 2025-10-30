<?php

namespace App\Models;

use App\Models\Pages;
use App\Models\Banner;
use App\Models\Happening;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Pages extends Model
{
    protected $guarded = [];

    public function sections()
    {
        return $this->hasMany(PageSection::class);
    }
    
    public function banners()
    {
        return $this->belongsToMany(Banner::class, 'banner_page', 'page_id', 'banner_id');
    }

    public function testimonials()
    {
        return $this->belongsToMany(Testimonial::class, 'testimonial_page', 'page_id', 'testimonial_id')->withTimestamps();
    }

    public function happenings()
    {
        return $this->belongsToMany(Happening::class, 'happening_page', 'page_id', 'happening_id')->withTimestamps();
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
