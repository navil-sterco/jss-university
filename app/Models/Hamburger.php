<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hamburger extends Model
{
    protected $fillable = [
        'title',
        'url',
        'type',
        'reference_id',
        'parent_id',
        'section_title',
        'section_subtitle',
        'link',
        'section_title_second',
        'section_subtitle_second',
        'section_image_first',
        'section_heading_first',
        'section_subheading_first',
        'section_image_second',
        'section_heading_second',
        'section_subheading_second',
        'section_video_url',
        'display_order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function parent()
    {
        return $this->belongsTo(Hamburger::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Hamburger::class, 'parent_id')->orderBy('display_order');
    }

    public function scopeRootItems($query)
    {
        return $query->whereNull('parent_id')->orderBy('display_order');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeWithChildren($query)
    {
        return $query->with(['children' => function($query) {
            $query->orderBy('display_order');
        }]);
    }
}
