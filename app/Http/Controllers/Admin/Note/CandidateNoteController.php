<?php

namespace App\Http\Controllers\Admin\Note;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Note\NoteRequest;
use App\Models\Candidate;

class CandidateNoteController extends BaseController
{
    public function store(NoteRequest $request, Candidate $candidate)
    {
        $candidate->notes()->create([
            'note' => $request->note,
            'created_by' => auth()->id(),
        ]);

        return back();
    }
}
