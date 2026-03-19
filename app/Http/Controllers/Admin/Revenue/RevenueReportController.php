<?php

namespace App\Http\Controllers\Admin\Revenue;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Services\Revenue\RevenueReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RevenueReportController extends Controller
{
    protected $service;

    public function __construct(RevenueReportService $service)
    {
        $this->service = $service;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $clients = Client::select('id', 'name')->get();
        $filters = [
            'year' => $request->get('year', now()->year),
            'client_id' => $request->get('client_id'),
        ];

        $overview = $this->service->getOverview($filters);
        $goal = $this->service->getGoalVsTarget($filters);

        return Inertia::render('admin/revenue/reports/index', [
            'filters' => $filters,
            'overview' => $overview,
            'goal' => $goal,
            'clients' => $clients,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
