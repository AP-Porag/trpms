<?php

namespace App\Http\Controllers\Admin\Note;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Note\NoteRequest;
use App\Models\Client;
use App\Models\Note;

class ClientNoteController extends BaseController
{
    public function store(NoteRequest $request, Client $client)
    {
        $client->notes()->create([
            'note' => $request->note,
            'created_by' => auth()->id(),
        ]);

        return back();
    }

    public function destroy(Note $note)
    {
        $note->delete();
        return back();
    }
}
