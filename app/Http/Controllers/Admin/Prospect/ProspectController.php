<?php

namespace App\Http\Controllers\Admin\Prospect;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Client\ClientRequest;
use App\Models\Client;
use App\Services\Prospect\ProspectService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProspectController extends BaseController
{

    public function __construct(protected ProspectService $service) {}


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render(
            'admin/prospect/index',
            $this->service->list($request)
        );
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia('admin/prospect/create');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(ClientRequest $request)
    {
        $this->service->create($request);

        return redirect()
            ->route('prospects.index')
            ->with('success', 'Prospect created successfully.');
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $prospect = Client::findOrFail($id);


        $data = $this->service->prospectDetail($prospect);

        return Inertia::render('admin/prospect/show', $data);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $prospect)
    {
        return inertia('admin/prospect/edit', [
            'prospect' => $prospect,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(ClientRequest $request, Client $prospect)
    {
        $this->service->update($prospect, $request);

        return redirect()
            ->route('prospects.index')
            ->with('success', 'Prospect updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $prospect)
    {
        $this->service->delete($prospect->id);
    }


    public function prospectToClient($id)
    {
        $prospect = Client::findOrFail($id);
        $prospect->update([
            'category' => 'client'
        ]);

        return redirect()
            ->route('prospects.index')
            ->with('success', 'Prospect updated successfully.');
    }
}
