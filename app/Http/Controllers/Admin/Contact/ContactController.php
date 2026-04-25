<?php

namespace App\Http\Controllers\Admin\Contact;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Label' => ['required', 'string'],
            'name' => ['required', 'integer'],
            'contact_type' => ['required', 'string'],
            'contact' => ['required', 'string']
        ]);

        Note::create([
            'label' => $validated['label'],
            'name' => $validated['name'],
            'contact_type' => $validated['contact_type'],
            'contact' => ['contact']
        ]);

        return back()->with('success', 'Note added successfully');
    }

    public function destroy(Note $note)
    {
        $note->delete();

        return back()->with('success', 'Note deleted successfully');
    }
}
