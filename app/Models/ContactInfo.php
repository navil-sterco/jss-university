<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactInfo extends Model
{
    protected $fillable = [
        'title',
        'address',
        'email',
        'phone',
        'landline_direct',
        'landline_epbx',
        'direction_url',
        'facebook',
        'instagram',
        'x',
        'youtube',
        'copyright'
    ];
}
