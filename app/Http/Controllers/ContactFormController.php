<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\ContactForm;
use Illuminate\Http\Request;

class ContactFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $forms = ContactForm::filter(['search' => $search])->orderBy('id', 'desc')->paginate(10)->withQueryString()->through(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'email' => $item->email,
                'phone' => $item->phone,
                'state' => $item->state,
                'course' => $item->course,
                'consent' => $item->consent,
            ];
        });

        return Inertia::render('ContactForm/Index', [
            'forms' => $forms,
            'searchTerm' => $search ?? '',
        ]);
    }

    public function destroy(ContactForm $contactForm)
    {
        $contactForm->delete();
        return redirect()->route('form.index')->with('success', 'Form Deleted successfully!');
    }
}
