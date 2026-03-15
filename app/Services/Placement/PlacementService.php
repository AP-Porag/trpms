<?php

namespace App\Services\Placement;

use App\Models\JobCandidate;
use App\Models\Placement;

class PlacementService
{
    public function createFromJobCandidate(JobCandidate $jc, array $data): Placement
    {
        if ($jc->placement()->exists()) {
            return $jc->placement;
        }

        $job = $jc->job;
        $client = $job->client;

        $placement = Placement::create([
            'job_candidate_id' => $jc->id,
            'client_id' => $client->id,
            'job_id' => $job->id,
            'candidate_id' => $jc->candidate_id,
            'fee_type' => $job->fee_type,
            'salary' => $data['salary'],
            'fee_percentage' => $data['fee_percentage'],
            'placement_fee' => $data['placement_fee'],
            'offer_accepted_at' => $data['offer_accepted_at'] ?? null,
            'start_date' => $data['start_date'] ?? null,
            'guarantee_end_date' => $data['guarantee_end_date'] ?? null,
            'placement_date' => $data['placement_date'] ?? now(),
            'recruiter_id' => auth()->id(),
            'created_by' => auth()->id(),
        ]);

        if (!empty($data['notes'])) {

            $placement->notes()->create([
                'note' => $data['notes'],
                'created_by' => auth()->id(),
            ]);

        }

        return $placement;
    }
}
