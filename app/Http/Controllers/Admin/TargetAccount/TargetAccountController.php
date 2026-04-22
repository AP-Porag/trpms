<?php

namespace App\Http\Controllers\Admin\TargetAccount;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Client\ClientRequest;
use App\Models\Client;
use App\Services\TargetAccount\TargetAccountService;
use App\Utils\GlobalConstant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TargetAccountController extends BaseController
{
    public function __construct(protected TargetAccountService $service) {}


    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render(
            'admin/target-account/index',
            $this->service->list($request)
        );
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia('admin/target-account/create');
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(ClientRequest $request)
    {
        $this->service->create($request);

        return redirect()
            ->route('target-accounts.index')
            ->with('success', 'Target Account created successfully.');
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
    public function edit(Client $targetAccount)
    {
        return inertia('admin/target-account/edit', [
            'prospect' => $targetAccount,
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(ClientRequest $request, Client $targetAccount)
    {
        $this->service->update($targetAccount, $request);

        return redirect()
            ->route('target-accounts.index')
            ->with('success', 'Target Account updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $targetAccount)
    {
        $this->service->delete($targetAccount->id);
    }

    public function promote(Client $client)
    {
        $client->update([
            'category' => GlobalConstant::CLIENT_CATEGORY_PROSPECT
        ]);

        return redirect()
            ->route('target-accounts.index')
            ->with('success', 'Target account promoted to prospect successfully.');
    }
}
