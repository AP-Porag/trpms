<?php

namespace App\Http\Controllers\Admin\Lead;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Industry;
use App\Models\Lead;
use App\Models\Source;
use App\Services\Lead\LeadService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadController extends Controller
{
    protected LeadService $leadService;

    public function __construct(LeadService $leadService)
    {
        $this->leadService = $leadService;
    }

    public function index(Request $request)
    {
        return Inertia::render('admin/lead/index', $this->leadService->list($request));
    }

    public function create()
    {
        return Inertia::render('admin/lead/create', [
            'industries' => Industry::select('id', 'name')->get(),
            'source' => Source::select('id', 'name')->get(),
            'departments' => Department::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'         => ['required', 'string'],
            'company_name' => ['required', 'string'],
            'industry_id'  => ['nullable', 'exists:industries,id'],
            'source_id'    => ['nullable', 'exists:sources,id'],
            'current_openings'    => ['nullable'],
            'status'    => ['nullable'],
            'mpc'          => ['nullable', 'string'],
            'departments' => 'nullable',
        ]);
        $this->leadService->create($data);

        return redirect()
            ->route('leads.index')
            ->with('success', 'Client created successfully.');
    }

    public function show(string $id)
    {
        $lead = Lead::with(['source', 'industry'])->find($id);


        $data = $this->leadService->leadtDetail($lead);

        return Inertia::render('admin/lead/show', $data);
    }


    public function edit(Lead $lead)
    {
        return inertia('admin/lead/edit', [
            'lead' => $lead->load('departments:id,name'),
            'industries' => Industry::select('id', 'name')->get(),
            'departments' => Department::select('id', 'name')->get(),
            'source' => Source::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, LeadService $service, $id)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:3'],
            'company_name' => ['required', 'string', 'min:3'],
            'industry_id' => ['nullable', 'exists:industries,id'],
            'source_id' => ['nullable', 'exists:sources,id'],
            'mpc' => ['nullable', 'string'],
            'current_openings' => ['nullable', 'string'],
            'status' => ['required', 'in:0,1'],
            'departments' => ['nullable', 'array'],
            'departments.*' => ['exists:departments,id'],
        ]);

        $service->update($id, $validated);

        return redirect()
            ->route('leads.index')
            ->with('success', 'Lead updated successfully.');
    }

    public function destroy($id)
    {
        $this->leadService->delete($id);

        return redirect()->back()->with('success', 'Lead deleted successfully.');
    }
}
