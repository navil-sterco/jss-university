<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SectionTemplate extends Model
{
    protected $guarded = [];

    protected $casts = [
        'fields' => 'array',
        'allow_multiple_items' => 'boolean',
        'is_active' => 'boolean',
    ];
}

