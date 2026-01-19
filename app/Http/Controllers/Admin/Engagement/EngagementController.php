<?php

namespace App\Http\Controllers\Admin\Engagement;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Engagement\EngagementRequest;
use App\Models\Client;
use App\Models\Engagement;
use App\Services\Engagement\EngagementService;
use App\Utils\GlobalConstant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EngagementController extends BaseController
{
    public function __construct(protected EngagementService $service){}


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('admin/engagement/index', $this->service->list($request));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $clients = Client::select('id','name','company_name')
            ->where('status',GlobalConstant::STATUS_ACTIVE)
            ->orderBy('id','desc')
            ->get();
        return Inertia('admin/engagement/create',['clients'=>$clients]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(EngagementRequest $request)
    {
        $this->service->create($request);
        return redirect()
            ->route('jobs.index')
            ->with('success', 'Engagement created successfully.');
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
    public function edit(int $id)
    {
        $engagement = Engagement::findOrFail($id);
        $clients = Client::select('id','name','company_name')
            ->where('status',GlobalConstant::STATUS_ACTIVE)
            ->orderBy('id','desc')
            ->get();
        return inertia('admin/engagement/edit', [
            'job' => $engagement,
            'clients' => $clients,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EngagementRequest $request, int $id)
    {
        $this->service->update($id, $request);

        return redirect()
            ->route('jobs.index')
            ->with('success', 'Engagement updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->service->delete($id);
    }
}
