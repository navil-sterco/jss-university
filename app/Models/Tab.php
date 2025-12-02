<?php

namespace App\Models;

use App\Models\Pages;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Tab extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
    ];

    public function scopeFilter(Builder $query, $filters)
    {
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['search']}%");
            });
        }
    }
}
