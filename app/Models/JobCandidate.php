<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobCandidate extends BaseModel
{
    protected $fillable = [
        'job_id',
        'candidate_id',
        'stage',
        'submitted_at',
        'interviewing_at',
        'offered_at',
        'placed_at',
        'rejected_at',
        'interview_scheduled_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'interviewing_at' => 'datetime',
        'offered_at' => 'datetime',
        'placed_at' => 'datetime',
        'rejected_at' => 'datetime',
        'interview_scheduled_at' => 'datetime',
    ];

    public function candidate():BelongsTo
    {
        return $this->belongsTo(Candidate::class, 'candidate_id');
    }

    public function job():BelongsTo
    {
        return $this->belongsTo(Engagement::class, 'job_id');
    }
}
