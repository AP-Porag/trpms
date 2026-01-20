<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\MorphMany;

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
    public function notes():MorphMany
    {
        return $this->morphMany(Note::class, 'noteable')->latest();
    }
}
