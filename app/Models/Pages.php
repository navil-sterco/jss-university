<?php

namespace App\Models;

use App\Models\Banner;
use App\Models\Department;
use App\Models\Happening;
use App\Models\School;
use App\Models\Tab;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Pages extends Model
{
    protected $fillable = [
        'parent_id',
        'school_id',
        'department_id',
        'title',
        'type',
        'image',
        'sub_title',
        'publish_date',
        'start_date',
        'end_date',
        'slug',
        'page_group',
        'display_order',
        'template_path',
        'status',
        'target_blank',
    ];

    public function school()
    {
        return $this->belongsTo(School::class, 'school_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function sections()
    {
        return $this->hasMany(PageSection::class,'page_id');
    }
    
    public function banners()
    {
        return $this->belongsToMany(Banner::class, 'banner_page', 'page_id', 'banner_id');
    }

    public function testimonials()
    {
        return $this->belongsToMany(Testimonial::class, 'testimonial_page', 'page_id', 'testimonial_id')->withTimestamps();
    }

    public function happenings()
    {
        return $this->belongsToMany(Happening::class, 'happening_page', 'page_id', 'happening_id')->withTimestamps();
    }

    public function schools()
    {
        return $this->belongsToMany(School::class, 'pages_school', 'page_id', 'school_id')->withTimestamps();
    }
    public function departments()
    {
        return $this->belongsToMany(Department::class, 'pages_department', 'page_id', 'department_id')->withTimestamps();
    }

    public function tabs()
    {
        return $this->belongsToMany(Tab::class, 'tab_pages', 'page_id', 'tab_id')->withTimestamps();
    }

    public function scopeFilter(Builder $query, $filters)
    {
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['search']}%")
                ->orWhere('slug', 'like', "%{$filters['search']}%");
            });
        }
    }
}
