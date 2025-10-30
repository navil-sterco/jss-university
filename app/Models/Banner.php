<?php

namespace App\Models;

use App\Models\Pages;
use App\Models\School;
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

    public function scopeFilter(Builder $query, $filters)
    {
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('heading', 'like', "%{$filters['search']}%");
            });
        }
    }
}
