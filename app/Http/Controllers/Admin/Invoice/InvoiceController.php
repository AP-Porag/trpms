<?php

namespace App\Http\Controllers\Admin\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\Placement;
use App\Utils\GlobalConstant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $clientId = $request->get('client_id');
        $status = $request->get('status');
        $dateFrom = $request->get('date_from');
        $dateTo = $request->get('date_to');
        $selectedMonth = $request->get('month');

        $query = Invoice::query()
            ->with([
                'client:id,name,company_name',
                'creator:id,first_name'
            ]);

        /* =========================
           SEARCH
        ========================= */

        if ($search) {
            $query->where(function ($q) use ($search) {

                $q->where('invoice_number', 'like', "%{$search}%")

                    ->orWhereHas('client', function ($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%")
                            ->orWhere('company_name', 'like', "%{$search}%");
                    });

            });
        }

        /* =========================
           FILTERS
        ========================= */

        if ($clientId) {
            $query->where('client_id', $clientId);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($dateFrom) {
            $query->whereDate('sent_date', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('sent_date', '<=', $dateTo);
        }

        if ($selectedMonth) {

            $year = \Carbon\Carbon::parse($selectedMonth)->year;
            $month = \Carbon\Carbon::parse($selectedMonth)->month;

            $query->whereYear('sent_date', $year)
                ->whereMonth('sent_date', $month);
        }

        /* =========================
           SORTING
        ========================= */

        $sort = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');

        $allowedSorts = [
            'invoice_number',
            'sent_date',
            'amount',
            'status'
        ];

        if (!in_array($sort, $allowedSorts)) {
            $sort = 'created_at';
        }

        $query->orderBy($sort, $direction);

        /* =========================
           PAGINATION
        ========================= */

        $invoices = $query
            ->paginate(20)
            ->withQueryString();

        /* =========================
           SUMMARY CARDS
        ========================= */

        $summaryQuery = Invoice::query();

        if ($clientId) {
            $summaryQuery->where('client_id', $clientId);
        }

        if ($status) {
            $summaryQuery->where('status', $status);
        }

        if ($dateFrom) {
            $summaryQuery->whereDate('sent_date', '>=', $dateFrom);
        }

        if ($dateTo) {
            $summaryQuery->whereDate('sent_date', '<=', $dateTo);
        }

        if ($selectedMonth) {

            $year = \Carbon\Carbon::parse($selectedMonth)->year;
            $month = \Carbon\Carbon::parse($selectedMonth)->month;

            $summaryQuery->whereYear('sent_date', $year)
                ->whereMonth('sent_date', $month);
        }

        $totalInvoices = (clone $summaryQuery)
            ->where('status', '!=', GlobalConstant::INVOICE_STATUS_CANCELED)
            ->count();

        $totalCollected = (clone $summaryQuery)
            ->where('status', GlobalConstant::INVOICE_STATUS_PAID)
            ->sum('amount');

        $totalFinalAmount = (clone $summaryQuery)
            ->where('status', '!=', GlobalConstant::INVOICE_STATUS_CANCELED)
            ->sum('amount');

        $totalOutstanding = (clone $summaryQuery)
            ->where('status', GlobalConstant::INVOICE_STATUS_ISSUED)
            ->sum('amount');

        /* =========================
           CLIENTS FOR FILTER
        ========================= */

        $clients = Client::select('id','name','company_name')
            ->orderBy('name')
            ->get();

        /* =========================
           MONTH DROPDOWN
        ========================= */

        $months = [];

        for ($i = 0; $i < 12; $i++) {

            $month = now()->subMonths($i)->format('Y-m');

            $months[$month] = now()
                ->subMonths($i)
                ->format('F Y');
        }

        return Inertia::render('admin/invoices/index', [

            /* =========================
               TABLE DATA
            ========================= */

            'invoices' => $invoices->items(),

            'meta' => [
                'from' => $invoices->firstItem(),
                'to' => $invoices->lastItem(),
                'total' => $invoices->total(),
                'current_page' => $invoices->currentPage(),
                'last_page' => $invoices->lastPage(),
                'searchPlaceholderText' => 'Search invoice number or client...',
            ],

            /* =========================
               FILTER STATE
            ========================= */

            'filters' => $request->only([
                'search',
                'client_id',
                'status',
                'date_from',
                'date_to',
                'month',
                'sort',
                'direction'
            ]),

            /* =========================
               FILTER OPTIONS
            ========================= */

            'clients' => $clients,

            'months' => $months,

            /* =========================
               SUMMARY CARDS
            ========================= */

            'summary' => [
                'totalInvoices' => $totalInvoices,
                'totalCollected' => $totalCollected,
                'totalFinalAmount' => $totalFinalAmount,
                'totalOutstanding' => $totalOutstanding,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $clients = Client::select('id', 'name', 'company_name')
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/invoices/create', [
            'clients' => $clients
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'placements' => 'required|array|min:1'
        ]);

        DB::beginTransaction();

        try {

            /* =========================
               GET PLACEMENTS
            ========================= */

            $placements = Placement::whereIn('id', $request->placements)
                ->lockForUpdate()
                ->get();

            /* =========================
               CALCULATE TOTAL
            ========================= */

            $amount = $placements->sum('placement_fee');

            /* =========================
               CREATE INVOICE
            ========================= */

            $invoice = Invoice::create([
                'invoice_number' => 'INV-' . now()->format('Ymd') . '-' . rand(1000,9999),
                'client_id' => $request->client_id,
                'amount' => $amount,
                'sent_date' => now(),
                'status' => GlobalConstant::INVOICE_STATUS_ISSUED,
                'created_by' => auth()->id()
            ]);

            /* =========================
               UPDATE PLACEMENTS
            ========================= */

            Placement::whereIn('id', $request->placements)
                ->update([
                    'invoice_id' => $invoice->id,
                    'invoiced_at' => now(),
                    'placement_invoice_status' => GlobalConstant::PLACEMENT_INVOICE_STATUS_INVOICED
                ]);

            DB::commit();

            return redirect()
                ->route('invoices.show', $invoice->id)
                ->with([
                    'success' => 'Invoice created successfully',
                    'invoice_id' => $invoice->id
                ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return back()->withErrors([
                'error' => 'Failed to create invoice'
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $invoice = Invoice::with([
            'client:id,name,company_name',
            'placements.candidate:id,first_name,last_name',
            'placements.job:id,title'
        ])->findOrFail($id);

        return Inertia::render('admin/invoices/view', [
            'invoice' => $invoice
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
    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);
        DB::beginTransaction();

        try {

            /* =========================
               PREVENT CANCEL IF PAID
            ========================= */

            if ($invoice->status === GlobalConstant::INVOICE_STATUS_PAID) {

                return back()->withErrors([
                    'error' => 'Paid invoices cannot be canceled.'
                ]);
            }

            /* =========================
               RESET PLACEMENTS
            ========================= */

            Placement::where('invoice_id', $invoice->id)
                ->update([
                    'invoice_id' => null,
                    'invoiced_at' => null,
                    'placement_invoice_status' => GlobalConstant::PLACEMENT_INVOICE_STATUS_NOT_INVOICED
                ]);

            /* =========================
               CANCEL INVOICE
            ========================= */

            $invoice->update([
                'status' => GlobalConstant::INVOICE_STATUS_CANCELED
            ]);

            DB::commit();

            return back()->with('success', 'Invoice canceled successfully.');

        } catch (\Exception $e) {

            DB::rollBack();

            return back()->withErrors([
                'error' => 'Failed to cancel invoice.'
            ]);
        }
    }

    public function getClientPlacements($id)
    {
        $client = Client::find($id);

        /* =========================
           PLACEMENTS
        ========================= */

        $placements = Placement::where('client_id', $client->id)
            ->with([
                'candidate:id,first_name,last_name',
                'job:id,title'
            ])
            ->orderByDesc('placement_date')
            ->get();

        /* =========================
           CLIENT SUMMARY
        ========================= */

        $paymentCount = Invoice::where('client_id', $client->id)
            ->where('status', GlobalConstant::INVOICE_STATUS_PAID)
            ->count();

        $totalCollected = Invoice::where('client_id', $client->id)
            ->where('status', GlobalConstant::INVOICE_STATUS_PAID)
            ->sum('amount');

        $totalBalance = Placement::where('client_id', $client->id)
            ->where('placement_invoice_status', GlobalConstant::PLACEMENT_INVOICE_STATUS_NOT_INVOICED)
            ->sum('placement_fee');

        $clientSummary = [
            'name' => $client->name ?? $client->company_name,
            'payment_count' => $paymentCount,
            'total_collected' => $totalCollected,
            'total_balance' => $totalBalance
        ];

        return response()->json([
            'placements' => $placements,
            'clientSummary' => $clientSummary
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:issued,paid',
            'sent_date' => 'nullable|date',
            'paid_date' => 'nullable|date'
        ]);

        $invoice = Invoice::findOrFail($id);

        DB::beginTransaction();

        try {

            /* =========================
               PREVENT EDIT IF PAID
            ========================= */

            if ($invoice->status === GlobalConstant::INVOICE_STATUS_PAID) {

                return back()->withErrors([
                    'error' => 'Paid invoices cannot be modified.'
                ]);
            }

            /* =========================
               UPDATE INVOICE
            ========================= */

            $invoice->update([
                'status' => $request->status,
                'sent_date' => $request->sent_date,
                'paid_date' => $request->status === GlobalConstant::INVOICE_STATUS_PAID
                    ? ($request->paid_date ?? now())
                    : null
            ]);

            /* =========================
               UPDATE PLACEMENTS
            ========================= */

            if ($request->status === GlobalConstant::INVOICE_STATUS_PAID) {

                Placement::where('invoice_id', $invoice->id)
                    ->update([
                        'placement_invoice_status' => GlobalConstant::PLACEMENT_INVOICE_STATUS_PAID
                    ]);

            }

            DB::commit();

            return back()->with('success', 'Invoice status updated successfully.');

        } catch (\Exception $e) {

            DB::rollBack();

            return back()->withErrors([
                'error' => 'Failed to update invoice status.'
            ]);
        }
    }
}
