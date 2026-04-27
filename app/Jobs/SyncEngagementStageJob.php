<?php

namespace App\Jobs;

use App\Models\Engagement;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable as FoundationQueueable;

class SyncEngagementStageJob
{

    public function handle(): void
    {
        Engagement::with('jobCandidates')
            ->chunk(200, function ($engagements) {

                foreach ($engagements as $engagement) {

                    $candidates = $engagement->jobCandidates;

                    if ($candidates->isEmpty()) {
                        $newStage = 'sourcing';
                    } elseif ($candidates->whereNotNull('placed_at')->count() > 0) {
                        $newStage = 'placed';
                    } elseif ($candidates->whereNotNull('offered_at')->count() > 0) {
                        $newStage = 'offered';
                    } elseif ($candidates->whereNotNull('interviewing_at')->count() > 0) {
                        $newStage = 'interviewing';
                    } elseif ($candidates->whereNotNull('submitted_at')->count() > 0) {
                        $newStage = 'submitted';
                    } else {
                        $newStage = 'sourcing';
                    }

                    // Same priority logic (NO backward)
                    $priority = [
                        'sourcing' => 1,
                        'submitted' => 2,
                        'interviewing' => 3,
                        'offered' => 4,
                        'placed' => 5,
                    ];

                    $currentStage = $engagement->stage;

                    // Skip if same (avoid unnecessary DB write)
                    if ($currentStage === $newStage) {
                        continue;
                    }

                    // Prevent backward
                    if ($priority[$newStage] >= ($priority[$currentStage] ?? 0)) {
                        $engagement->update([
                            'stage' => $newStage
                        ]);
                    }
                }
            });
    }
}
