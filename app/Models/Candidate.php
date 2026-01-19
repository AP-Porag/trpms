<?php

namespace App\Models;

class Candidate extends BaseModel
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'resume_path',
        'original_name',
    ];

    // Notes (polymorphic)
    public function notes()
    {
        return $this->morphMany(Note::class, 'noteable')->latest();
    }
}
