<?php

namespace App\Http\Controllers\Admin\Note;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'note' => ['required','string'],
            'noteable_id' => ['required','integer'],
            'noteable_type' => ['required','string']
        ]);

        Note::create([
            'note' => $validated['note'],
            'noteable_id' => $validated['noteable_id'],
            'noteable_type' => $validated['noteable_type'],
            'created_by' => auth()->id(),
        ]);

        return back()->with('success','Note added successfully');
    }

    public function destroy(Note $note)
    {
        $note->delete();

        return back()->with('success','Note deleted successfully');
    }
}
