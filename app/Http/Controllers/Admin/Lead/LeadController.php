<?php

namespace App\Http\Controllers\Admin\Lead;

use App\Http\Controllers\Controller;
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

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'  => ['required', 'string'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string'],
        ]);

        $this->leadService->create($data);

        return redirect()->back()->with('success', 'Lead created successfully.');
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'name'  => ['required', 'string'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string'],
        ]);

        $this->leadService->update($id, $data);

        return redirect()->back()->with('success', 'Lead updated successfully.');
    }

    public function destroy($id)
    {
        $this->leadService->delete($id);

        return redirect()->back()->with('success', 'Lead deleted successfully.');
    }
}
