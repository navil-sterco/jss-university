<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\ContactInfo;
use Illuminate\Http\Request;

class ContactInfoController extends Controller
{
    public function edit()
    {
        $contacts = ContactInfo::first();
        $contactData = $contacts ? $contacts : [
            'id' => null,
            'title' => '',
            'address' => '',
            'email' => '',
            'phone' => '',
            'landline_direct' => '',
            'landline_epbx' => '',
            'direction_url' => '',
            'facebook' => '',
            'instagram' => '',
            'x' => '',
            'youtube' => '',
            'copyright' => '',
        ];

        return Inertia::render('Contactinfo/Edit', [
            'contacts' => $contactData,
        ]);
    }

    public function update(Request $request)
    {
        $contact = ContactInfo::first();
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'landline_direct' => 'nullable|string|max:20',
            'landline_epbx' => 'nullable|string|max:20',
            'direction_url' => 'nullable|url|max:500',
            'facebook' => 'nullable|url|max:500',
            'instagram' => 'nullable|url|max:500',
            'x' => 'nullable|url|max:500',
            'youtube' => 'nullable|url|max:500',
            'copyright' => 'nullable|string|max:255',
        ]);

        try {
            if ($contact) {
                $contact->update($validated);
                $message = 'Contact information updated successfully!';
            } else {
                ContactInfo::create($validated);
                $message = 'Contact information created successfully!';
            }
            
            return redirect()->route('contact.edit')->with('success', $message);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to save contact information: ' . $e->getMessage());
        }
    }
}
