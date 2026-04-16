<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Candidate extends BaseModel
{

    use HasFactory;
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'resume_path',
        'original_name',
        'expected_salary',
    ];

    public function resumes()
    {
        return $this->hasMany(Resume::class);
    }

    // Notes (polymorphic)
    public function notes():MorphMany
    {
        return $this->morphMany(Note::class, 'noteable')->latest();
    }
}
