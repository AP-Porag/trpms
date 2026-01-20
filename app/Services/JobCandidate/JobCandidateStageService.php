<?php

namespace App\Services\JobCandidate;

use App\Models\JobCandidate;
use App\Services\Activity\ActivityEvent;
use App\Services\Activity\ActivityLogger;
use App\Utils\JobCandidateStage;
use Illuminate\Validation\ValidationException;

class JobCandidateStageService
{
    /**
     * Move candidate to a new stage
     */
    public function move(
        JobCandidate $jc,
        string $toStage,
        ?string $interviewAt = null
    ): JobCandidate {
        $fromStage = $jc->stage;

        $this->validateTransition($fromStage, $toStage);

        $now = now();

        match ($toStage) {
            'submitted'     => $jc->submitted_at = $now,
            'interviewing'  => $jc->interviewing_at = $now,
            'offered'       => $jc->offered_at = $now,
            'placed'        => $jc->placed_at = $now,
            'rejected'      => $jc->rejected_at = $now,
        };

        if ($toStage === 'interviewing' && $interviewAt) {
            ActivityLogger::log(
                subject: $jc,
                event: ActivityEvent::INTERVIEW_SCHEDULED,
                metadata: [
                    'interview_scheduled_at' => $interviewAt,
                ]
            );
        }

        $jc->stage = $toStage;
        $jc->save();

        //ACTIVITY LOG
        ActivityLogger::log(
            subject: $jc,
            event: ActivityEvent::STAGE_CHANGED,
            metadata: [
                'from' => $fromStage,
                'to'   => $toStage,
                'candidate_id'   => $jc->candidate->id,
                'candidate_name' => $jc->candidate->first_name . ' ' . $jc->candidate->last_name,
                'interview_scheduled_at' => $interviewAt,
            ]
        );

        // Optional semantic events
        if ($toStage === 'placed') {
            ActivityLogger::log($jc, ActivityEvent::CANDIDATE_PLACED);
        }

        if ($toStage === 'rejected') {
            ActivityLogger::log($jc, ActivityEvent::CANDIDATE_REJECTED);
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
