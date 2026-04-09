<?php

namespace App\Http\Controllers;

use App\Models\LeadershipCategory;
use Illuminate\Http\Request;

class LeadershipCategoryController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        LeadershipCategory::create([
            'name' => $request->name,
        ]);

        return redirect()->back()->with('success', 'Category created successfully!');
    }

    public function update(Request $request, LeadershipCategory $leadershipCategory)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $leadershipCategory->update([
            'name' => $request->name,
        ]);

        return redirect()->back()->with('success', 'Category updated successfully!');
    }

    public function destroy(LeadershipCategory $leadershipCategory)
    {
        $leadershipCategory->delete();
        return redirect()->back()->with('success', 'Category deleted successfully!');
    }
}
