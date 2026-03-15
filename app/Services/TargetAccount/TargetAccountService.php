<?php

namespace App\Services\TargetAccount;

use App\Models\Client;
use App\Services\Client\ClientService;
use App\Utils\GlobalConstant;
use Illuminate\Http\Request;

class TargetAccountService extends ClientService
{

    public function list(Request $request): array
    {
        $search = $request->input('search', '');
        $status = $request->input('status', 'all');
        $perPage = $request->input('perPage', 5);

        $query = Client::targetAccounts(); // uses model scope

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        if ($status !== 'all') {
            $query->where('status', (int) $status);
        }

        $prospects = $query->latest()->paginate($perPage ?? 10);

        return [
            'prospects' => $prospects->items(),
            'meta' => pagination_meta($prospects,'Search by name, email, phone or company...'),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'perPage' => $perPage,
            ],
        ];
    }


    public function create($data): Client
    {
        return Client::create([
            ...$data->validated(),
            'category' => GlobalConstant::CLIENT_CATEGORY_TARGET_ACCOUNT,
        ]);
    }


    public function update(Client $client, $data): Client
    {
        return parent::update($client, $data);
    }


    public function delete($id)
    {
        $client = Client::targetAccounts()->findOrFail($id);

        return parent::delete($client->id);
    }

}
