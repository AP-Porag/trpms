<?php

namespace App\Services\Client;

use App\Models\Agreement;
use App\Models\Client;
use App\Services\BaseService;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ClientService extends BaseService
{
    public function __construct(Client $client)
    {
        parent::__construct($client);
    }
    public function list(Request $request): array
    {
        $search = $request->input('search', '');
        $status = $request->input('status', 'all');
        $perPage = $request->input('perPage', 5);
        $query = Client::clients(); // uses model scope

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

        $clients = $query->latest()->paginate($perPage ?? 10);
        return [
            'clients' => $clients->items(),
            'meta' => pagination_meta($clients, 'Search by name, email, phone or company...'),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'perPage' => $perPage,
            ],
        ];
    }

    public function create($data): Client
    {

        $client = Client::create([
            'name'         => $data->name,
            'company_name' => $data->company_name,
            'email'        => $data->email,
            'phone'        => $data->phone,
            'address'      => $data->address,
            'industry_id'  => $data->industry_id,
            'client_type'  => $data->client_type,
            'fee_type'     => $data->fee_type,
            'fee_value'    => $data->fee_value,
            'status'       => $data->status,
            'rating'       => $data->rating,
            'agreement_type' => $data->agreement_type,
            'signed_date'    => $data->signed_date,
        ]);
        // 🔥 Pivot table insert (IMPORTANT)
        if (!empty($data->departments)) {
            $client->departments()->sync(
                array_map('intval', $data->departments)
            );
        }

        if ($client) {

            foreach ($data->file('agreements', []) as $file) {

                if ($file instanceof UploadedFile) {

                    Agreement::create([
                        'client_id'      => $client->id,
                        'file_path' => $file->store('agreements', 'public'),
                        'original_name'  => $file->getClientOriginalName(),
                    ]);
                }
            }
        }

        return $client;
    }



    public function update(Client $client, $data): Client
    {

        if ($client->category === 'prospect' && $data->file('agreements')) {
            $client->update([
                'category' => 'client'
            ]);
        }

        $client->update([
            'name'         => $data->name,
            'company_name' => $data->company_name,
            'email'        => $data->email,
            'phone'        => $data->phone,
            'address'      => $data->address,
            'client_type'  => $data->client_type,
            'fee_type'     => $data->fee_type,
            'fee_value'    => $data->fee_value,
            'rating'      => $data->rating,
            'status'       => $data->status,
            'agreement_type' => $data->agreement_type,
            'signed_date'    => $data->signed_date,
        ]);

        // 🔥 Pivot update (VERY IMPORTANT)
        $client->departments()->sync(
            array_map('intval', $data->departments ?? [])
        );
        /*
        |--------------------------------------------------------------------------
        | Handle existing agreements
        |--------------------------------------------------------------------------
        */

        $keepIds = $data->input('existing_agreements', []);

        foreach ($client->agreements as $agreement) {

            if (!in_array($agreement->id, $keepIds)) {

                if (
                    $agreement->file_path &&
                    Storage::disk('public')->exists($agreement->file_path)
                ) {
                    Storage::disk('public')->delete($agreement->file_path);
                }

                $agreement->delete();
            }
        }

        /*
        |----------------------------------------------------
        | 4. Store new agreements (FIXED STORAGE ISSUE)
        |----------------------------------------------------
        */
        if ($data->hasFile('agreements')) {

            foreach ($data->file('agreements') as $file) {

                if ($file instanceof UploadedFile) {

                    $path = $file->store('agreements', 'public'); // IMPORTANT FIX

                    Agreement::create([
                        'client_id'     => $client->id,
                        'file_path'     => $path,
                        'original_name' => $file->getClientOriginalName(),
                    ]);
                }
            }
        }

        return $client;
    }

    public function detail(Client $client): array
    {

        return [
            'client' => $client->load([
                'notes',
                'departments',
                'contacts',
                'agreements:id,client_id,file_path,original_name,agreement_type,signed_date',
            ]),
        ];
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

    //Target Account
    public function tergetAccountDetail(Client $targetAccount): array
    {
        return [
            'targetAccount' => $targetAccount->load([
                'notes',
                'departments',
                'contacts',
                'agreements:id,client_id,file_path,original_name,agreement_type,signed_date',
            ]),
        ];
    }
    //hiring manager
    public function setHiringManager(Client $client, ?int $contactId): Client
    {
        $client->update([
            'hiring_manager_contact_id' => $contactId,
        ]);

        return $client->fresh();
    }
}
