<?php

namespace App\Services\JobCandidate;

use App\Models\JobCandidate;
use App\Utils\JobCandidateStage;
use Illuminate\Validation\ValidationException;

class JobCandidateStageService
{
    /**
     * Move candidate to a new stage
     */
    public function move(JobCandidate $jc, string $toStage): JobCandidate
    {
        if (!JobCandidateStage::isValid($toStage)) {
            throw ValidationException::withMessages([
                'stage' => 'Invalid stage provided.',
            ]);
        }

        $this->validateTransition($jc->stage, $toStage);

        $now = now();

        match ($toStage) {
            JobCandidateStage::SUBMITTED     => $jc->submitted_at = $now,
            JobCandidateStage::INTERVIEWING  => $jc->interviewing_at = $now,
            JobCandidateStage::OFFERED       => $jc->offered_at = $now,
            JobCandidateStage::PLACED        => $jc->placed_at = $now,
            JobCandidateStage::REJECTED      => $jc->rejected_at = $now,
        };

        $jc->stage = $toStage;
        $jc->save();

        if ($toStage === 'interviewing' && request('interview_scheduled_at')) {
            $jc->interview_scheduled_at = request('interview_scheduled_at');
        }

        return $jc;
    }

    /**
     * Validate stage transitions
     */
    protected function validateTransition(string $from, string $to): void
    {
        $allowed = JobCandidateStage::TRANSITIONS[$from] ?? [];

        if (!in_array($to, $allowed, true)) {
            throw ValidationException::withMessages([
                'stage' => "Cannot move candidate from {$from} to {$to}.",
            ]);
        }
    }
}
