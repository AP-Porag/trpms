<?php

namespace App\Http\Controllers\Admin\JobCandidate;

use App\Http\Controllers\Controller;
use App\Models\Engagement;
use App\Models\JobCandidate;
use App\Services\JobCandidate\JobCandidateService;
use App\Services\JobCandidate\JobCandidateStageService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class JobCandidateController extends Controller
{

    public function store(
        Request $request,
        JobCandidateService $service
    ) {
        $validated = $request->validate([
            'job_id' => ['required', 'exists:engagements,id'],
            'candidate_id' => ['required', 'exists:candidates,id'],
        ]);

        $job = Engagement::findOrFail($validated['job_id']);

        $service->addCandidateToJob($job, $validated['candidate_id']);

        return back()->with('success', 'Candidate added to job.');
    }
    public function changeStage(
        Request $request,
        JobCandidate $jobCandidate,
        JobCandidateStageService $stageService
    ) {
        $validated = $request->validate([
            'stage' => ['required', 'string'],
            'interview_scheduled_at' => ['nullable', 'date'],
        ]);

        try {
            $stageService->move(
                $jobCandidate,
                $validated['stage'],
                $validated['interview_scheduled_at'] ?? null
            );
        } catch (ValidationException $e) {
            return back()->withErrors([
                'stage' => $e->getMessage(),
            ]);
        }

        return back()->with('success', 'Stage updated');
    }

    public function destroy(JobCandidate $jobCandidate)
    {
        $jobCandidate->delete();

        return back();
    }
}
