<?php

namespace App\Models;

use App\Models\Program;
use App\Models\Department;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Course extends Model
{
    protected $fillable = [
        'department_id',
        'program_id',
        'name',
        'menu_name',
        'name_short',
        'slug',
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
    ];

    protected $casts = [
        'eligibility_criteria_notices' => 'array',
        'peos' => 'array',
        'pos' => 'array',
        'pso' => 'array',
        'curriculum_desc' => 'array',
        'career_opportunities' => 'array',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function program()
    {
        return $this->belongsTo(Program::class);
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
