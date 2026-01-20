<?php

namespace App\Http\Controllers\Admin\Activity;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Engagement;
use App\Models\JobCandidate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    /**
     * Generic activity fetcher for ANY subject
     */

    public function forSubject(Request $request)
    {
        $validated = $request->validate([
            'subject_type' => ['required', 'string'],
            'subject_id'   => ['required', 'integer'],
        ]);

        $subjectType = $validated['subject_type'];
        $subjectId   = $validated['subject_id'];

        // 🔹 Base query
        $query = ActivityLog::with('actor');

        /**
         * 🔥 AGGREGATION LOGIC
         * If subject is Job → include Job + JobCandidate activities
         */
        if ($subjectType === Engagement::class) {
            // Get all job_candidate IDs for this job
            $jobCandidateIds = JobCandidate::where('job_id', $subjectId)->pluck('id');

            $query->where(function ($q) use ($subjectType, $subjectId, $jobCandidateIds) {
                // Job-level activity
                $q->where(function ($qq) use ($subjectType, $subjectId) {
                    $qq->where('subject_type', $subjectType)
                        ->where('subject_id', $subjectId);
                });

                // JobCandidate-level activity
                if ($jobCandidateIds->isNotEmpty()) {
                    $q->orWhere(function ($qq) use ($jobCandidateIds) {
                        $qq->where('subject_type', JobCandidate::class)
                            ->whereIn('subject_id', $jobCandidateIds);
                    });
                }
            });
        } else {
            /**
             * 🔹 Default behavior (Candidate, Invoice, Revenue, etc.)
             */
            $query->where('subject_type', $subjectType)
                ->where('subject_id', $subjectId);
        }

        return response()->json(
            $query->latest()->get()
        );
    }
}

