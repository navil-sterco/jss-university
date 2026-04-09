<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Type extends Model
{
    public function faculties()
    {
        return $this->hasMany(Faculty::class, 'type_id');
    }
    protected $fillable = [
        'name',
        'element',
        'display_order'
    ];
}
