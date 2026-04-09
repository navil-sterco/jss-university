<?php

namespace App\Models;

use App\Models\Department;
use App\Models\Pages;
use App\Models\School;
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
        'video_url',
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

    public function schools()
    {
        return $this->belongsToMany(School::class, 'gallery_school', 'gallery_id', 'school_id')->withTimestamps();
    }

    public function pages()
    {
        return $this->belongsToMany(Pages::class, 'gallery_page', 'gallery_id', 'page_id')->withTimestamps();
    }

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'gallery_department', 'gallery_id', 'department_id')->withTimestamps();
    }
}
