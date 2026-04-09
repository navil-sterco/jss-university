<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Popup extends Model
{
    use HasFactory;

    protected $fillable = [
        'heading',
        'items',
        'status',
    ];

    protected $casts = [
        'items' => 'array',
        'status' => 'boolean',
    ];
}
