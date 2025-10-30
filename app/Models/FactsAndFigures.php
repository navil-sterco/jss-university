<?php

namespace App\Models;

use App\Models\Pages;
use App\Models\School;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class FactsAndFigures extends Model
{
    protected $fillable = [
        'title',
        'description',
        'figure',
        'status',
        'show_on_home',
        'display_order',
    ];

    public function schools()
    {
        return $this->belongsToMany(School::class, 'facts_and_figures_school', 'facts_and_figures_id', 'school_id')->withTimestamps();
    }

    public function pages()
    {
        return $this->belongsToMany(Pages::class, 'facts_and_figures_page', 'facts_and_figures_id', 'page_id')->withTimestamps();
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
