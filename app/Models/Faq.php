<?php

namespace App\Models;

use App\Models\Pages;
use App\Models\School;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Faq extends Model
{
    protected $fillable = [
        'question',
        'answer',
        'status',
        'display_order',
    ];

    public function schools()
    {
        return $this->belongsToMany(School::class, 'faqs_school', 'faq_id', 'school_id')->withTimestamps();
    }

    public function pages()
    {
        return $this->belongsToMany(Pages::class, 'faqs_page', 'faq_id', 'page_id')->withTimestamps();
    }

    public function scopeFilter(Builder $query, $filters)
    {
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('question', 'like', "%{$filters['search']}%");
            });
        }
    }
}
