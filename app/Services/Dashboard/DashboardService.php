<?php

namespace App\Services\Dashboard;

use App\Models\Client;
use App\Models\Engagement;
use App\Models\JobCandidate;
use App\Models\Invoice;
use App\Models\RevenueGoal;
use App\Utils\GlobalConstant;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getDashboardData(): array
    {
        $year = request('year', now()->year);
        $clientId = request('client_id');

        return [
            'filters' => [
                'year' => $year,
                'client_id' => $clientId,
            ],

            'clients' => Client::select('id', 'name')->get(),

            'kpis' => $this->getKpis($year, $clientId),
            'charts' => $this->getCharts($year, $clientId),
            'tables' => $this->getTables($year, $clientId),
            'quick_actions' => $this->getQuickActions(),
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | KPIs
    |--------------------------------------------------------------------------
    */
    protected function getKpis($year, $clientId): array
    {
        return [
            'active_clients' => Client::where('status', 'active')->count(),

            'active_jobs' => Engagement::where('status', 'active')
                ->when($clientId, fn($q) => $q->where('client_id', $clientId))
                ->count(),

            'candidates_in_pipeline' => JobCandidate::count(),

            'placements_this_month' => JobCandidate::where('stage', 'placed')
                ->whereYear('placed_at', $year)
                ->whereMonth('placed_at', now()->month)
                ->count(),

            'revenue_this_month' => Invoice::where('status', 'paid')
                ->whereYear('paid_date', $year)
                ->when($clientId, fn($q) => $q->where('client_id', $clientId))
                ->whereMonth('paid_date', now()->month)
                ->sum('amount'),
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Charts
    |--------------------------------------------------------------------------
    */
    protected function getCharts($year, $clientId): array
    {
        return [
            'monthly_revenue' => $this->getMonthlyRevenue($year, $clientId),
            'placements_trend' => $this->getPlacementsTrend($year, $clientId),
            'revenue_vs_goal' => $this->getRevenueVsGoal($year, $clientId),
        ];
    }

    protected function getMonthlyRevenue($year, $clientId)
    {
        return Invoice::selectRaw('MONTH(paid_date) as month, SUM(amount) as total')
            ->where('status', 'paid')
            ->whereYear('paid_date', $year)
            ->when($clientId, fn($q) => $q->where('client_id', $clientId))
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }

    protected function getPlacementsTrend($year, $clientId)
    {
        return JobCandidate::selectRaw('MONTH(placed_at) as month, COUNT(*) as total')
            ->where('stage', 'placed')
            ->whereYear('placed_at', $year)
            ->when($clientId, fn($q) =>
            $q->whereHas('job', fn($q2) => $q2->where('client_id', $clientId))
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }

    protected function getRevenueVsGoal($year, $clientId): array
    {
        $actual = Invoice::where('status', 'paid')
            ->whereYear('paid_date', $year)
            ->when($clientId, fn($q) => $q->where('client_id', $clientId))
            ->sum('amount');

        $goal = RevenueGoal::where('year', $year)->value('yearly_goal') ?? 0;

        return [
            'actual' => $actual,
            'goal' => $goal,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Tables
    |--------------------------------------------------------------------------
    */
    protected function getTables($year, $clientId): array
    {
        return [
            'recent_placements' => $this->getRecentPlacements($year, $clientId),
            'pending_invoices' => $this->getPendingInvoices(),
            'active_jobs' => $this->getActiveJobsByClient(),
        ];
    }

    protected function getRecentPlacements($year, $clientId)
    {
        return JobCandidate::with(['job.client', 'candidate'])
            ->where('stage', 'placed')
            ->whereYear('placed_at', $year)
            ->when($clientId, fn($q) =>
            $q->whereHas('job', fn($q2) => $q2->where('client_id', $clientId))
            )
            ->latest()
            ->limit(5)
            ->get();
    }

    protected function getPendingInvoices()
    {
        return Invoice::with('client')
            ->where('status', 'pending')
            ->latest()
            ->limit(5)
            ->get();
    }

    protected function getActiveJobsByClient()
    {
        return Engagement::with('client')
            ->where('status', GlobalConstant::STATUS_ACTIVE)
            ->latest()
            ->limit(5)
            ->get();
    }

    /*
    |--------------------------------------------------------------------------
    | Quick Actions
    |--------------------------------------------------------------------------
    */
    protected function getQuickActions(): array
    {
        return [
            'add_client' => route('clients.create'),
            'add_job' => route('jobs.create'),
            'add_candidate' => route('candidates.create'),
            'create_invoice' => route('invoices.create'),
        ];
    }
}
