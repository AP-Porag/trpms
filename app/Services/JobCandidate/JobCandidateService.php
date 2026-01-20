<?php

namespace App\Services\JobCandidate;

use App\Models\JobCandidate;
use App\Models\Engagement;
use Illuminate\Support\Collection;
use App\Utils\JobCandidateStage;

class JobCandidateService
{

    public function addCandidateToJob(
        Engagement $job,
        int $candidateId
    ): JobCandidate {
        return JobCandidate::create([
            'job_id' => $job->id,
            'candidate_id' => $candidateId,
            'stage' => JobCandidateStage::SUBMITTED,
            'submitted_at' => now(),
        ]);
    }
    /**
     * Get all candidates for a job (raw list)
     * Used for Kanban & Table views
     */
    public function listByJob(Engagement $job): Collection
    {
        return JobCandidate::with([
            'candidate:id,first_name,last_name,email,phone',
        ])
            ->where('job_id', $job->id)
            ->orderBy('created_at')
            ->get();
    }

    /**
     * Group candidates by stage for Kanban
     * Returns a predictable structure
     */
    public function groupByStage(Engagement $job): array
    {
        $candidates = $this->listByJob($job);

        return [
            'submitted' => $candidates->where('stage', 'submitted')->values(),
            'interviewing' => $candidates->where('stage', 'interviewing')->values(),
            'offered' => $candidates->where('stage', 'offered')->values(),
            'placed' => $candidates->where('stage', 'placed')->values(),
            'rejected' => $candidates->where('stage', 'rejected')->values(),
        ];
    }
}
