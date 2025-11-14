<?php

namespace App\Http\Controllers\Api;

use App\Models\ContactForm;
use App\Models\ContactInfo;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ContactUsController extends Controller
{
    public function index()
    {
        $contactInfo = ContactInfo::all();
        return response()->json([
            'status' => true,
            'data' => $contactInfo,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|string|max:255',
            'phone' => 'required|integer',
            'state' => 'required|string|max:255',
            'course' => 'required|string|max:255',
            'consent' => 'required|boolean',
        ]);

        ContactForm::create($validated);
        return response()->json([
            'status' => true,
            'data' => 'Form Submitted Successfully',
        ]);
    }
}
