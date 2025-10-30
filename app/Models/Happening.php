<?php

namespace App\Models;

use App\Models\Pages;
use App\Models\School;
use App\Models\Gallery;
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
