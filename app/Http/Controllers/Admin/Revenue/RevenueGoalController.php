<?php

namespace App\Http\Controllers\Admin\Revenue;

use App\Http\Controllers\Controller;
use App\Models\RevenueGoal;
use App\Models\RevenueGoalBreakdown;
use App\Services\Revenue\RevenueGoalService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RevenueGoalController extends Controller
{
    protected $service;

    public function __construct(RevenueGoalService $service)
    {
        $this->service = $service;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $goal = RevenueGoal::with('breakdowns')
            ->orderByDesc('year')
            ->first();

        $breakdowns = [];

        if ($goal) {

            $breakdowns = $this->service->calculateBreakdowns(
                $goal->yearly_goal,
                $goal->breakdowns->toArray()
            );
        }

        return Inertia::render('admin/revenue/goal/index', [
            'goal' => $goal,
            'breakdowns' => $breakdowns
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

        $validated = $request->validate([
            'year' => 'required|integer',
            'yearly_goal' => 'required|numeric|min:1',

            'breakdowns' => 'required|array|min:3',

            'breakdowns.*.rank' => 'required|in:A,B,C',
            'breakdowns.*.company_count' => 'required|integer|min:1',
            'breakdowns.*.percent' => 'required|numeric|min:0|max:100',
        ]);

        $goal = RevenueGoal::updateOrCreate(
            ['year' => $validated['year']],
            ['yearly_goal' => $validated['yearly_goal']]
        );

        RevenueGoalBreakdown::where('revenue_goal_id', $goal->id)->delete();

        foreach ($validated['breakdowns'] as $row) {

            RevenueGoalBreakdown::create([
                'revenue_goal_id' => $goal->id,
                'rank' => $row['rank'],
                'company_count' => $row['company_count'],
                'percent' => $row['percent']
            ]);
        }

        return redirect()
            ->route('revenue-goals.index')
            ->with('success', 'Revenue goal saved successfully');
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
    public function update(Request $request, RevenueGoal $revenueGoal)
    {

        $validated = $request->validate([
            'yearly_goal' => 'required|numeric|min:1',
            'breakdowns' => 'required|array|min:3'
        ]);

        $revenueGoal->update([
            'yearly_goal' => $validated['yearly_goal']
        ]);

        RevenueGoalBreakdown::where('revenue_goal_id', $revenueGoal->id)->delete();

        foreach ($validated['breakdowns'] as $row) {

            RevenueGoalBreakdown::create([
                'revenue_goal_id' => $revenueGoal->id,
                'rank' => $row['rank'],
                'company_count' => $row['company_count'],
                'percent' => $row['percent']
            ]);
        }

        return redirect()
            ->route('revenue.goals.index')
            ->with('success', 'Revenue goal updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
