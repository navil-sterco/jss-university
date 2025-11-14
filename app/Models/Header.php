<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Header extends Model
{
    protected $fillable = [
        'title', 'url', 'type', 'reference_id', 'parent_id',
        'section_title', 'section_subtitle', 'section_description',
        'section_button_text', 'section_button_url', 'boxes',
        'display_order', 'is_active'
    ];

    protected $casts = [
        'boxes' => 'array',
        'is_active' => 'boolean',
    ];

    public function parent()
    {
        return $this->belongsTo(Header::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Header::class, 'parent_id')->orderBy('display_order');
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