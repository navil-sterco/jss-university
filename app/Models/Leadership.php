<?php

namespace App\Models;

use App\Models\Type;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Leadership extends Model
{
    protected $fillable = [
        'type_id',
        'name', 
        'image',
        'banner_image',
        'video',
        'short_description',
        'description',
        'biography', 
        'message',
        'display_order',
        'status',
    ];

    protected $casts = [
        'description' => 'array',
        'message' => 'array',
    ];

    public function type()
    {
        return $this->belongsTo(Type::class, 'type_id');
    }

    public function scopeFilter(Builder $query, $filters)
    {
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%");
            });
        }
    }
}
