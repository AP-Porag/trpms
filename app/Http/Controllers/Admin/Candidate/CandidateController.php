<?php

namespace App\Http\Controllers\Admin\Candidate;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Candidate\CandidateRequest;
use App\Models\Candidate;
use App\Services\Candidate\CandidateService;
use App\Services\JobCandidate\JobCandidateService;
use App\Services\JobCandidate\JobCandidateStageService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;

class CandidateController extends BaseController
{
    public function __construct(protected CandidateService $service){}


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('admin/candidate/index', $this->service->list($request));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia('admin/candidate/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CandidateRequest $request)
    {
        $this->service->create($request);
        return redirect()
            ->route('candidates.index')
            ->with('success', 'Candidate created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Candidate $candidate)
    {
        return inertia('admin/candidate/edit', [
            'candidate' => $candidate,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CandidateRequest $request, Candidate $candidate)
    {
        $this->service->update($candidate, $request);

        return redirect()
            ->route('candidates.index')
            ->with('success', 'Candidate updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Candidate $candidate)
    {
        $this->service->delete($candidate->id);
    }

    public function search(Request $request): JsonResponse
    {
        $q = trim($request->query('q', ''));
        $jobId = $request->query('job_id');

        $query = Candidate::query()
            ->whereNotIn('id', function ($sub) use ($jobId) {
                $sub->select('candidate_id')
                    ->from('job_candidates')
                    ->where('job_id', $jobId);
            });

        if ($q !== '') {
            $query->where(function ($q2) use ($q) {
                $q2->where('first_name', 'like', "%{$q}%")
                    ->orWhere('last_name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            });
        }

        return response()->json(
            $query->limit(10)->get([
                'id',
                'first_name',
                'last_name',
                'email',
                'phone',
            ])
        );
    }

}
