<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Homepage extends Model
{
    protected $fillable = [
        'name',
        'menu_name',
        'about_title',
        'about_subtitle',
        'about_description',
        'about_url',
        'about_chancellor_img',
        'about_chancellor_message',
        'highlights',
        'buttons',
        'logo_content',
        'facilities_heading',
        'facilities_subheading',
        'facilities',
        'department_title',
        'department_desc',
        'department_programs_count',
        'department_programs_text',
        'department_button_1_text',
        'department_button_1_url',
        'department_academic_year',
        'department_academic_year_desc',
        'placement_title',
        'placement_subtitle',
        'hall_of_fame_image',
        'hall_of_fame_heading',
        'hall_of_fame_url',
        'testimonial_title',
        'testimonial_subtitle',
        'happening_title',
        'happening_subtitle',
    ];

    protected $casts = [
        'highlights' => 'array',
        'buttons' => 'array',
        'logo_content' => 'array',
        'facilities' => 'array',
    ];
}
