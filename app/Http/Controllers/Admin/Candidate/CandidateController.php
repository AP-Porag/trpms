<?php

namespace App\Http\Controllers\Admin\Candidate;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Candidate\CandidateRequest;
use App\Models\Candidate;
use App\Services\Candidate\CandidateService;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
}
