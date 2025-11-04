<?php

namespace App\Models;

use App\Models\Page;
use App\Models\School;
use App\Models\Department;
use Illuminate\Database\Eloquent\Model;

class Footer extends Model
{
    protected $fillable = [
        'navigation_items',
        'quick_links',
    ];

    protected $casts = [
        'navigation_items' => 'array',
        'quick_links' => 'array',
    ];

    public function getResolvedNavigationItemsAttribute()
    {
        if (!$this->navigation_items) {
            return [];
        }

        return collect($this->navigation_items)->map(function ($item) {
            $item['resolved_name'] = $this->resolveItemName($item['type'], $item['item_id']);
            return $item;
        })->toArray();
    }

    private function resolveItemName($type, $id)
    {
        switch ($type) {
            case 'school':
                $school = School::find($id);
                return $school ? $school->name : 'Unknown School';
            
            case 'department':
                $department = Department::find($id);
                return $department ? $department->name : 'Unknown Department';
            
            case 'page':
                $page = Page::find($id);
                return $page ? $page->title : 'Unknown Page';
            
            default:
                return 'Unknown Item';
        }
    }

    public static function getConfiguration()
    {
        return static::first() ?? new static();
    }
}
