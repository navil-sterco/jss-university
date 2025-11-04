<?php

namespace App\Models;

use App\Models\Type;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Faculty extends Model
{
    protected $fillable = [
        'type_id',
        'name', 
        'email',
        'profile',
        'image',
        'linkedin_url',
        'education',
        'research', 
        'teaching',
        'award',
        'social_engagement',
        'status',
        'display_order',
    ];

    protected $casts = [
        'education' => 'array',
        'research' => 'array',
        'teaching' => 'array',
        'award' => 'array',
        'social_engagement' => 'array',
        'status' => 'boolean',
    ];

    public function type()
    {
        return $this->belongsTo(Type::class, 'type_id');
    }

    protected function formattedEducation(): Attribute
    {
        return Attribute::make(
            get: fn () => array_filter($this->education ?? []),
        );
    }

    protected function formattedResearch(): Attribute
    {
        return Attribute::make(
            get: fn () => array_filter($this->research ?? []),
        );
    }

    protected function formattedTeaching(): Attribute
    {
        return Attribute::make(
            get: fn () => array_filter($this->teaching ?? []),
        );
    }

    protected function formattedAward(): Attribute
    {
        return Attribute::make(
            get: fn () => array_filter($this->award ?? []),
        );
    }

    protected function formattedSocialEngagement(): Attribute
    {
        return Attribute::make(
            get: fn () => array_filter($this->social_engagement ?? []),
        );
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
