<?php

namespace App\Http\Controllers;

use App\Models\Type;
use Illuminate\Http\Request;

class TypeController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'element' => 'required|string|max:255',
            'display_order' => 'nullable|integer'
        ]);

        $type = Type::create([
            'name' => $request->name,
            'element' => $request->element,
            'display_order' => $request->display_order ?? 0,
        ]);

        return redirect()->back()->with('success', 'Type created successfully!');
    }

    public function update(Request $request, Type $type)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'element' => 'required|string|max:255',
            'display_order' => 'nullable|integer'
        ]);

        $type->update([
            'name' => $request->name,
            'element' => $request->element,
            'display_order' => $request->display_order ?? 0,
        ]);

        return redirect()->back()->with('success', 'Type Updated successfully!');
    }

    public function destroy(Type $type)
    {
        $type->delete();
        return redirect()->back()->with('success', 'Type deleted successfully!');
    }
}
