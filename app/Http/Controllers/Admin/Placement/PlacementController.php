<?php

namespace App\Http\Controllers\Admin\Placement;

use App\Http\Controllers\Controller;
use App\Models\JobCandidate;
use App\Models\Placement;
use App\Services\JobCandidate\JobCandidateStageService;
use App\Services\Placement\PlacementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PlacementController extends Controller
{
    protected PlacementService $placementService;
    protected JobCandidateStageService $stageService;

    public function __construct(
        PlacementService $placementService,
        JobCandidateStageService $stageService
    ) {
        $this->placementService = $placementService;
        $this->stageService = $stageService;
    }
    /**
     * Display a listing of the resource.
     */
    //    public function index(Request $request)
    //    {
    //        $search = $request->get('search');
    //
    //        $query = Placement::query()
    //            ->with([
    //                'candidate:id,first_name,last_name',
    //                'client:id,name,company_name',
    //                'job:id,title',
    //                'recruiter:id,name'
    //            ]);
    //
    //        /* =========================
    //           SEARCH
    //        ========================= */
    //
    //        if ($search) {
    //            $query->where(function ($q) use ($search) {
    //
    //                $q->whereHas('candidate', function ($q2) use ($search) {
    //                    $q2->where('first_name', 'like', "%{$search}%")
    //                        ->orWhere('last_name', 'like', "%{$search}%");
    //                });
    //
    //                $q->orWhereHas('client', function ($q2) use ($search) {
    //                    $q2->where('name', 'like', "%{$search}%")
    //                        ->orWhere('company_name', 'like', "%{$search}%");
    //                });
    //
    //                $q->orWhereHas('job', function ($q2) use ($search) {
    //                    $q2->where('title', 'like', "%{$search}%");
    //                });
    //
    //            });
    //        }
    //
    //        /* =========================
    //           FILTERS
    //        ========================= */
    //
    //        if ($request->client_id) {
    //            $query->where('client_id', $request->client_id);
    //        }
    //
    //        if ($request->job_id) {
    //            $query->where('job_id', $request->job_id);
    //        }
    //
    //        if ($request->recruiter_id) {
    //            $query->where('recruiter_id', $request->recruiter_id);
    //        }
    //
    //        if ($request->date_from) {
    //            $query->whereDate('placement_date', '>=', $request->date_from);
    //        }
    //
    //        if ($request->date_to) {
    //            $query->whereDate('placement_date', '<=', $request->date_to);
    //        }
    //
    //        if ($request->fee_min) {
    //            $query->where('placement_fee', '>=', $request->fee_min);
    //        }
    //
    //        if ($request->fee_max) {
    //            $query->where('placement_fee', '<=', $request->fee_max);
    //        }
    //
    //        /* =========================
    //           SORTING
    //        ========================= */
    //
    //        $sort = $request->get('sort', 'placement_date');
    //        $direction = $request->get('direction', 'desc');
    //
    //        $allowedSorts = [
    //            'placement_date',
    //            'salary',
    //            'placement_fee'
    //        ];
    //
    //        if (! in_array($sort, $allowedSorts)) {
    //            $sort = 'placement_date';
    //        }
    //
    //        $query->orderBy($sort, $direction);
    //
    //        /* =========================
    //           PAGINATION
    //        ========================= */
    //
    //        $placements = $query
    //            ->paginate(20)
    //            ->withQueryString();
    //
    //        return Inertia::render('admin/placements/index', [
    //            'placements' => $placements->items(),
    //            'meta' => [
    //                'from' => $placements->firstItem(),
    //                'to' => $placements->lastItem(),
    //                'total' => $placements->total(),
    //                'current_page' => $placements->currentPage(),
    //                'last_page' => $placements->lastPage(),
    //                'searchPlaceholderText' => 'Search candidate, client, job...',
    //            ],
    //            'filters' => $request->only([
    //                'search',
    //                'client_id',
    //                'job_id',
    //                'recruiter_id',
    //                'date_from',
    //                'date_to',
    //                'fee_min',
    //                'fee_max',
    //                'sort',
    //                'direction'
    //            ])
    //        ]);
    //    }

    public function index(Request $request)
    {
        $search = $request->get('search');
        $period = $request->get('period', 'monthly');

        $query = Placement::query()
            ->with([
                'candidate:id,first_name,last_name',
                'client:id,name,company_name',
                'job:id,title,created_at',
                'recruiter:id,first_name'
            ]);

        /* =========================
           SEARCH
        ========================= */

        if ($search) {
            $query->where(function ($q) use ($search) {

                $q->whereHas('candidate', function ($q2) use ($search) {
                    $q2->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                });

                $q->orWhereHas('client', function ($q2) use ($search) {
                    $q2->where('name', 'like', "%{$search}%")
                        ->orWhere('company_name', 'like', "%{$search}%");
                });

                $q->orWhereHas('job', function ($q2) use ($search) {
                    $q2->where('title', 'like', "%{$search}%");
                });
            });
        }

        /* =========================
           FILTERS
        ========================= */

        if ($request->client_id) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->job_id) {
            $query->where('job_id', $request->job_id);
        }

        if ($request->recruiter_id) {
            $query->where('recruiter_id', $request->recruiter_id);
        }

        if ($request->date_from) {
            $query->whereDate('placement_date', '>=', $request->date_from);
        }

        if ($request->date_to) {
            $query->whereDate('placement_date', '<=', $request->date_to);
        }

        if ($request->fee_min) {
            $query->where('placement_fee', '>=', $request->fee_min);
        }

        if ($request->fee_max) {
            $query->where('placement_fee', '<=', $request->fee_max);
        }

        /* =========================
           SORTING
        ========================= */

        $sort = $request->get('sort', 'placement_date');
        $direction = $request->get('direction', 'desc');

        $allowedSorts = [
            'placement_date',
            'salary',
            'placement_fee'
        ];

        if (! in_array($sort, $allowedSorts)) {
            $sort = 'placement_date';
        }

        $query->orderBy($sort, $direction);

        /* =========================
           PAGINATION
        ========================= */

        $placements = $query
            ->paginate(20)
            ->withQueryString();

        /* =====================================================
           PLACEMENT SUMMARY ANALYTICS
        ===================================================== */

        $now = now();

        $placementsThisMonth = Placement::whereMonth('placement_date', $now->month)
            ->whereYear('placement_date', $now->year)
            ->count();

        $revenueThisMonth = Placement::whereMonth('placement_date', $now->month)
            ->whereYear('placement_date', $now->year)
            ->sum('placement_fee');

        $averageFee = Placement::avg('placement_fee');

        $topClient = Placement::select('client_id')
            ->selectRaw('SUM(placement_fee) as revenue')
            ->with('client:id,name')
            ->groupBy('client_id')
            ->orderByDesc('revenue')
            ->first();

        /* =========================
   TIME GROUPING
========================= */

        if ($period === 'annual') {

            $placementsOverTime = Placement::selectRaw('YEAR(placement_date) as label')
                ->selectRaw('COUNT(*) as total')
                ->groupBy('label')
                ->orderBy('label')
                ->get();

            $revenueOverTime = Placement::selectRaw('YEAR(placement_date) as label')
                ->selectRaw('SUM(placement_fee) as revenue')
                ->groupBy('label')
                ->orderBy('label')
                ->get();
        } elseif ($period === 'quarterly') {

            $placementsOverTime = Placement::selectRaw('QUARTER(placement_date) as label')
                ->selectRaw('COUNT(*) as total')
                ->groupBy('label')
                ->orderBy('label')
                ->get();

            $revenueOverTime = Placement::selectRaw('QUARTER(placement_date) as label')
                ->selectRaw('SUM(placement_fee) as revenue')
                ->groupBy('label')
                ->orderBy('label')
                ->get();
        } else {

            $placementsOverTime = Placement::selectRaw('MONTH(placement_date) as label')
                ->selectRaw('COUNT(*) as total')
                ->groupBy('label')
                ->orderBy('label')
                ->get();

            $revenueOverTime = Placement::selectRaw('MONTH(placement_date) as label')
                ->selectRaw('SUM(placement_fee) as revenue')
                ->groupBy('label')
                ->orderBy('label')
                ->get();
        }

        /* =========================
           TOP CLIENTS
        ========================= */

        $topClients = Placement::select('client_id')
            ->selectRaw('SUM(placement_fee) as revenue')
            ->with('client:id,name')
            ->groupBy('client_id')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get();

        /* =========================
        TOP RECRUITERS
        ========================= */

        $topRecruiters = Placement::select('recruiter_id')
            ->selectRaw('SUM(placement_fee) as revenue')
            ->with('recruiter:id,first_name')
            ->groupBy('recruiter_id')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get();

        return Inertia::render('admin/placements/index', [
            'placements' => $placements->items(),
            'meta' => [
                'from' => $placements->firstItem(),
                'to' => $placements->lastItem(),
                'total' => $placements->total(),
                'current_page' => $placements->currentPage(),
                'last_page' => $placements->lastPage(),
                'searchPlaceholderText' => 'Search candidate, client, job...',
            ],
            'filters' => $request->only([
                'search',
                'client_id',
                'job_id',
                'recruiter_id',
                'date_from',
                'date_to',
                'fee_min',
                'fee_max',
                'sort',
                'direction'
            ]),

            /* =========================
               SUMMARY DATA
            ========================= */

            'summary' => [
                'placementsThisMonth' => $placementsThisMonth,
                'revenueThisMonth' => $revenueThisMonth,
                'averageFee' => $averageFee,
                'topClient' => $topClient,
                'placementsOverTime' => $placementsOverTime,
                'revenueOverTime' => $revenueOverTime,
                'topClients' => $topClients,
                'topRecruiters' => $topRecruiters,
                'period' => $period,
            ]
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
            'job_candidate_id' => ['required', 'exists:job_candidates,id'],
            'salary' => ['required', 'numeric', 'min:0'],
            'fee_percentage' => ['nullable', 'numeric'],
            'placement_fee' => ['nullable', 'numeric'],
            'offer_accepted_at' => ['nullable', 'date'],
            'start_date' => ['nullable', 'date'],
            'placement_date' => ['nullable', 'date'],
            'guarantee_end_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string']
        ]);

        // Find JobCandidate
        $jobCandidate = JobCandidate::with(['job.client', 'candidate'])
            ->findOrFail($validated['job_candidate_id']);

        // Create Placement
        $placement = $this->placementService->createFromJobCandidate(
            $jobCandidate,
            $validated
        );

        // Move candidate to placed stage
        $this->stageService->move($jobCandidate, 'placed');

        return redirect()->back()->with([
            'placement_success' => true,
            'placement_id' => $placement->id
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Placement $placement)
    {
        $placement->load([
            'candidate',
            'client',
            'job',
            'recruiter',
            'notes'
        ]);

        return Inertia::render('admin/placements/view', [
            'placement' => $placement
        ]);
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
