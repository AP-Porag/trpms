<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Engagement extends BaseModel
{

    use HasFactory;
    protected $fillable = [
        'client_id',
        'title',
        'description',
        'department_id',
        'location',
        'priority',
        'fee_type',
        'fee_value',
        'salary_range',
        'status',
        'stage',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function notes()
    {
        return $this->morphMany(Note::class, 'noteable')->latest();
    }
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function jobCandidates()
    {
        return $this->hasMany(JobCandidate::class, 'job_id');
    }
}
