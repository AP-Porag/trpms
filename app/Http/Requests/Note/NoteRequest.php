<?php

namespace App\Http\Requests\Note;

use App\Http\Requests\BaseRequest;
use Illuminate\Foundation\Http\FormRequest;

class NoteRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'note' => 'required|string',
        ];
    }
}
