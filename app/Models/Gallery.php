<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    protected $fillable = [
        'title',
        'event_date',
        'type',
        'images',
        'videos',
        'pdf',
        'display_order',
        'event_date' => 'date',
    ];

    protected $casts = [
        'images' => 'array',
        'videos' => 'array',
    ];

    public function happenings()
    {
        return $this->belongsToMany(Happening::class, 'gallery_happening', 'gallery_id', 'happening_id');
    }
}
