<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admission extends Model
{
    protected $fillable = [
        'title',
        'subtitle',
        'description',
        'image',
        'email',
        'phone',
        'brochure',
        'apply_now_link',
        'menus',
        'program_text',
        'program_desc',
        'program_button_text',
        'program_button_url',
        'academic_calendar',
    ];
    
    protected $casts = [
        'menus' => 'array',
    ];
}
