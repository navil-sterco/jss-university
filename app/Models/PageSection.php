<?php

namespace App\Models;

use App\Models\Pages;
use App\Models\Banner;
use App\Models\PageSection;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Model;

class PageSection extends Model
{
    protected $guarded = [];

    protected $casts = [
        'content' => 'array',
    ];

    public function page()
    {
        return $this->belongsTo(Pages::class);
    }

}
