<?php

namespace App\Models;

use App\Models\Degree;
use App\Models\Department;
use App\Models\Faq;
use App\Models\Program;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'department_id',
        'degree_id',
        'name',
        'menu_name',
        'name_short',
        'slug',
        'useful_links',
        'display_order',
        'status',
        'course_duration',
        'annual_fees',
        'academic_year',
        'eligibility_criteria',
        'eligibility_criteria_desc',
        'eligibility_criteria_notices',
        'apply_now_link',
        'program_structure',
        'brouchure',
        'scholarship',
        'peos',
        'pos',
        'pso',
        'curriculum_title',
        'curriculum_desc',
        'curriculum_image',
        'curriculum_pdf',
        'fee_structure_title',
        'fee_structure_short_description',
        'fee_structure_pdf',
        'fee_structure_image',
        'course_total_fees',
        'career_opportunities',
        'banner',
        'image',
        'school_listing_image',
        'eligibility_marks',
        'eligibility_desc',
        'overview_title',
        'overview_desc',
        'overview_image',
        'career_title',
        'career_subtitle',
        'career_desc',
        'career_image',
        'description_title',
        'description_content',
        'tab_section_info',
        'tab_section_tabs',
    ];

    protected $casts = [
        'eligibility_criteria_notices' => 'array',
        'peos' => 'array',
        'pos' => 'array',
        'pso' => 'array',
        'curriculum_desc' => 'array',
        'career_opportunities' => 'array',
        'useful_links' => 'array',
        'tab_section_info' => 'array',
        'tab_section_tabs' => 'array',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function degree()
    {
        return $this->belongsTo(Degree::class);
    }

    public function schools()
    {
        return $this->belongsToMany(School::class, 'courses_school', 'course_id', 'school_id')->withTimestamps();
    }

    public function pages()
    {
        return $this->belongsToMany(Pages::class, 'courses_page', 'course_id', 'page_id')->withTimestamps();
    }

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'courses_department', 'course_id', 'department_id')->withTimestamps();
    }

    public function testimonials()
    {
        return $this->belongsToMany(Testimonial::class, 'testimonials_courses', 'course_id', 'testimonial_id')->withTimestamps();
    }
    public function faqs()
    {
        return $this->belongsToMany(Faq::class, 'faqs_courses', 'course_id', 'faq_id')->withTimestamps();
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
