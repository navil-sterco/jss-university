<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Admission;
use Illuminate\Http\Request;

class AdmissionController extends Controller
{
    public function edit()
    {
        $admission = Admission::first();
        $admissionData = $admission ? $admission : [
            'id' => null,
            'title' => '',
            'subtitle' => '',
            'description' => '',
            'email' => '',
            'phone' => '',
            'apply_now_link' => '',
            'program_text' => '',
            'program_desc' => '',
            'program_button_text' => '',
            'program_button_url' => '',
            'image' => null,
            'brochure' => null,
            'menus' => [],
        ];

        return Inertia::render('Admissions/Edit', [
            'admission' => $admissionData,
        ]);
    }

    public function update(Request $request)
    {
        $admission = Admission::first();
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'apply_now_link' => 'nullable|url|max:255',
            'program_text' => 'nullable|string|max:255',
            'program_desc' => 'nullable|string',
            'program_button_text' => 'nullable|string|max:255',
            'program_button_url' => 'nullable|max:255',
            'menus' => 'nullable|array',
            'menus.*.text' => 'required_with:menus|string|max:255',
            'menus.*.link' => 'required_with:menus|max:255',
            // Remove image and brochure validation from here
        ]);

        // Validate image only if it's uploaded
        if ($request->hasFile('image')) {
            $imageValidated = $request->validate([
                'image' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            ]);
            $validated['image'] = $imageValidated['image'];
        }

        // Validate brochure only if it's uploaded
        if ($request->hasFile('brochure')) {
            $brochureValidated = $request->validate([
                'brochure' => 'file|mimes:pdf|max:10240',
            ]);
            $validated['brochure'] = $brochureValidated['brochure'];
        }

        try {
            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($admission && $admission->image && file_exists(public_path($admission->image))) {
                    unlink(public_path($admission->image));
                }

                $image = $request->file('image');
                $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->move(public_path('assets/img/admission/'), $imageName);
                $validated['image'] = 'assets/img/admission/' . $imageName;
            } else {
                // Keep existing image if no new file uploaded
                if ($admission) {
                    $validated['image'] = $admission->image;
                } else {
                    $validated['image'] = null;
                }
            }

            // Handle brochure upload (PDF)
            if ($request->hasFile('brochure')) {
                // Delete old brochure if exists
                if ($admission && $admission->brochure && file_exists(public_path($admission->brochure))) {
                    unlink(public_path($admission->brochure));
                }

                $brochure = $request->file('brochure');
                $brochureName = time() . '_' . uniqid() . '_brochure.' . $brochure->getClientOriginalExtension();
                $brochure->move(public_path('assets/admission/documents/'), $brochureName);
                $validated['brochure'] = 'assets/admission/documents/' . $brochureName;
            } else {
                // Keep existing brochure if no new file uploaded
                if ($admission) {
                    $validated['brochure'] = $admission->brochure;
                } else {
                    $validated['brochure'] = null;
                }
            }

            // Handle menus JSON
            $validated['menus'] = $request->has('menus') ? json_encode($validated['menus']) : ($admission ? $admission->menus : null);

            if ($admission) {
                // Update existing admission
                $admission->update($validated);
                $message = 'Admission information updated successfully!';
            } else {
                // Create new admission
                Admission::create($validated);
                $message = 'Admission information created successfully!';
            }
            
            return redirect()->route('admission.edit')->with('success', $message);

        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to save admission information: ' . $e->getMessage());
        }
    }
}
