<?php

namespace App\Services\Revenue;

use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RevenueReportService
{
    protected function baseQuery($filters)
    {
        $query = DB::table('invoices')
            ->where('invoices.status', 'paid')
            ->whereYear('paid_date', $filters['year']);

        if (!empty($filters['client_id'])) {
            $query->where('client_id', $filters['client_id']);
        }

        return $query;
    }

    /*
    |--------------------------------------------------------------------------
    | OVERVIEW TAB
    |--------------------------------------------------------------------------
    */
    public function getOverview($filters)
    {
        $query = $this->baseQuery($filters);

        // TOTAL
        $totalRevenue = (clone $query)->sum('amount');

        // THIS MONTH
        $thisMonth = (clone $query)
            ->whereMonth('paid_date', now()->month)
            ->sum('amount');

        // THIS YEAR
        $thisYear = $totalRevenue;

        // MONTHLY
        $monthly = (clone $query)
            ->selectRaw('MONTH(paid_date) as month, SUM(amount) as revenue')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($row) {
                return [
                    'month' => Carbon::create()->month($row->month)->format('M'),
                    'revenue' => (float) $row->revenue,
                ];
            });

        // QUARTERLY
        $quarterly = (clone $query)
            ->selectRaw('QUARTER(paid_date) as quarter, SUM(amount) as revenue')
            ->groupBy('quarter')
            ->orderBy('quarter')
            ->get()
            ->map(function ($row) {
                return [
                    'quarter' => 'Q' . $row->quarter,
                    'revenue' => (float) $row->revenue,
                ];
            });

        // YEARLY (for future multi-year support)
        $yearly = (clone $query)
            ->selectRaw('YEAR(paid_date) as year, SUM(amount) as revenue')
            ->groupBy('year')
            ->get();

        // BY CLIENT
        $byClient = (clone $query)
            ->join('clients', 'clients.id', '=', 'invoices.client_id')
            ->selectRaw('clients.name as client, SUM(invoices.amount) as revenue')
            ->groupBy('clients.name')
            ->orderByDesc('revenue')
            ->get();

        $byIndustry = (clone $query)
            ->join('clients', 'clients.id', '=', 'invoices.client_id')
            ->join('industries', 'industries.id', '=', 'clients.industry_id')
            ->selectRaw('industries.name as industry, SUM(invoices.amount) as revenue')
            ->groupBy('industries.name')
            ->orderByDesc('revenue')
            ->get();

        return [
            'summary' => [
                'total' => (float) $totalRevenue,
                'this_month' => (float) $thisMonth,
                'this_year' => (float) $thisYear,
            ],
            'monthly' => $monthly,
            'quarterly' => $quarterly,
            'yearly' => $yearly,
            'by_client' => $byClient,
            'by_industry' => $byIndustry,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | GOAL VS TARGET TAB
    |--------------------------------------------------------------------------
    */
    public function getGoalVsTarget($filters)
    {
        $year = $filters['year'];

        $query = $this->baseQuery($filters);

        $actual = (clone $query)->sum('amount');

        // GET GOAL
        $goalRow = DB::table('revenue_goals')
            ->where('year', $year)
            ->first();

        if (!$goalRow) {
            return [
                'has_goal' => false,
            ];
        }

        $goal = (float) $goalRow->yearly_goal;

        // CALCULATIONS
        $low = $goal * 0.8;
        $high = $goal * 1.2;

        $percentage = $goal > 0 ? ($actual / $goal) * 100 : 0;

        // RUN RATE
        $startOfYear = Carbon::create($year, 1, 1);
        $endOfYear = Carbon::create($year, 12, 31);

        $daysPassed = now()->diffInDays($startOfYear);
        $totalDays = $endOfYear->diffInDays($startOfYear);

        $expectedByNow = ($daysPassed / $totalDays) * $goal;

        $status = 'on_track';
        if ($actual < $expectedByNow) {
            $status = 'behind';
        } elseif ($actual > $expectedByNow) {
            $status = 'ahead';
        }

        // MONTHLY TARGET VS ACTUAL
        $monthlyTarget = $goal / 12;

        $monthlyActual = (clone $query)
            ->selectRaw('MONTH(paid_date) as month, SUM(amount) as revenue')
            ->groupBy('month')
            ->pluck('revenue', 'month');

        $monthly = collect(range(1, 12))->map(function ($month) use ($monthlyActual, $monthlyTarget) {
            return [
                'month' => Carbon::create()->month($month)->format('M'),
                'target' => (float) $monthlyTarget,
                'actual' => (float) ($monthlyActual[$month] ?? 0),
            ];
        });

        // CLIENT CONTRIBUTION
        $byClient = (clone $query)
            ->join('clients', 'clients.id', '=', 'invoices.client_id')
            ->selectRaw('clients.name as client, SUM(invoices.amount) as revenue')
            ->groupBy('clients.name')
            ->orderByDesc('revenue')
            ->get();

        return [
            'has_goal' => true,

            'summary' => [
                'goal' => $goal,
                'actual' => (float) $actual,
                'percentage' => round($percentage, 2),
            ],

            'range' => [
                'low' => $low,
                'target' => $goal,
                'high' => $high,
            ],

            'run_rate' => [
                'expected' => (float) $expectedByNow,
                'actual' => (float) $actual,
                'status' => $status, // ahead | behind | on_track
                'difference' => (float) ($actual - $expectedByNow),
            ],

            'monthly' => $monthly,

            'by_client' => $byClient,
        ];
    }
}
