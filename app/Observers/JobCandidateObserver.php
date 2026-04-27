<?php

namespace App\Observers;

use App\Models\JobCandidate;
use App\Models\Engagement;

class JobCandidateObserver
{
    public function created(JobCandidate $jobCandidate)
    {
        $this->updateEngagementStage($jobCandidate->job_id);
    }

    public function updated(JobCandidate $jobCandidate)
    {
        $this->updateEngagementStage($jobCandidate->job_id);
    }

    protected function updateEngagementStage($jobId)
    {
        $engagement = Engagement::with('jobCandidates')->find($jobId);

        if (!$engagement) return;

        $candidates = $engagement->jobCandidates;

        if ($candidates->whereNotNull('placed_at')->count() > 0) {
            $stage = 'placed';
        } elseif ($candidates->whereNotNull('offered_at')->count() > 0) {
            $stage = 'offered';
        } elseif ($candidates->whereNotNull('interviewing_at')->count() > 0) {
            $stage = 'interviewing';
        } elseif ($candidates->whereNotNull('submitted_at')->count() > 0) {
            $stage = 'submitted';
        } else {
            $stage = 'sourcing';
        }

        // Prevent backward
        $priority = [
            'sourcing' => 1,
            'submitted' => 2,
            'interviewing' => 3,
            'offered' => 4,
            'placed' => 5,
        ];

        if ($priority[$stage] >= $priority[$engagement->stage]) {
            $engagement->update(['stage' => $stage]);
        }
    }
}
