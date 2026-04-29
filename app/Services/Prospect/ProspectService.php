<?php

namespace App\Services\Prospect;

use App\Models\Client;
use App\Models\Note;
use App\Services\Client\ClientService;
use App\Utils\GlobalConstant;
use Illuminate\Http\Request;

class ProspectService extends ClientService
{

    public function list(Request $request): array
    {
        $search = $request->input('search', '');
        $status = $request->input('status', 'all');
        $perPage = $request->input('perPage', 5);

        $query = Client::prospects(); // uses model scope

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
            'meta' => pagination_meta($prospects, 'Search by name, email, phone or company...'),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'perPage' => $perPage,
            ],
        ];
    }


    public function create($data): Client
    {



        // return Client::create([
        //     ...$data->validated(),
        //     'category' => GlobalConstant::CLIENT_CATEGORY_PROSPECT,
        // ]);

        // 1. Prospect create
        $prospect = Client::create([
            ...$data->validated(),
            'category' => GlobalConstant::CLIENT_CATEGORY_PROSPECT,
        ]);

        $note = $data->validated()['note'] ?? null;

        if (!empty($note)) {
            Note::create([
                'note' => $note,
                'noteable_id' => $prospect->id,
                'noteable_type' => 'client',
                'created_by' => auth()->id(), // IMPORTANT if column exists
            ]);
        }

        return $prospect;
    }


    public function update(Client $client, $data): Client
    {
        return parent::update($client, $data);
    }


    public function delete($id)
    {
        $client = Client::prospects()->findOrFail($id);

        return parent::delete($client->id);
    }

    //ProspectDetails
    public function prospectDetail(Client $prospect): array
    {
        return [
            'prospect' => $prospect->load([
                'notes',
                'contacts',
                'agreements:id,client_id,file_path,original_name,agreement_type,signed_date',
            ]),
        ];
    }
}
