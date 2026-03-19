<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Placement extends Model
{
    protected $fillable = [
        'job_candidate_id',
        'client_id',
        'job_id',
        'candidate_id',
        'fee_type',
        'salary',
        'fee_percentage',
        'placement_fee',
        'offer_accepted_at',
        'placement_date',
        'start_date',
        'guarantee_end_date',
        'recruiter_id',
        'invoice_id',
        'invoiced_at',
        'placement_invoice_status',
        'created_by'
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function job()
    {
        return $this->belongsTo(Engagement::class);
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function recruiter()
    {
        return $this->belongsTo(User::class, 'recruiter_id');
    }

    public function jobCandidate()
    {
        return $this->belongsTo(JobCandidate::class);
    }

    public function notes()
    {
        return $this->morphMany(Note::class, 'noteable')->latest();
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
