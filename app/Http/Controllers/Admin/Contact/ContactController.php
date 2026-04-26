<?php

namespace App\Http\Controllers\Admin\Contact;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {

        $validated = $request->validate([
            'contacts' => ['required', 'array'],
            'contacts.*.name' => ['required', 'string'],
            'contacts.*.type' => ['required', 'string'],
            'contacts.*.contact' => ['required', 'string'],

            'contactable_id' => ['required', 'integer'],
            'contactable_type' => ['required', 'string'],
        ]);

        foreach ($validated['contacts'] as $contact) {
            Contact::create([
                'name' => $contact['name'],
                'type' => $contact['type'],
                'contact' => $contact['contact'],

                // ✅ FIX HERE
                'contactable_id' => $validated['contactable_id'],
                'contactable_type' => $validated['contactable_type'],

                'created_by' => auth()->id(),
            ]);
        }
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();

        return back()->with('success', 'Contact deleted successfully');
    }
}
