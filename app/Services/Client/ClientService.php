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
        $query = Client::query();

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
            'meta' => pagination_meta($clients,'Search by name, email, phone or company...'),
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
            'name'=>$data->name,
            'company_name'=>$data->company_name,
            'email'=>$data->email,
            'phone'=>$data->phone,
            'address'=>$data->address,
            'client_type'=>$data->client_type,
            'fee_percentage'=>$data->fee_percentage,
            'status'=>$data->status,
        ]);

        if ($client){
            foreach ($data->file('agreements', []) as $file) {;
                Agreement::create([
                    'client_id' => $client->id,
                    'file_path' => $file->store('agreements'),
                    'original_name'  => $file->getClientOriginalName(),
                    'agreement_type'=>$data->agreement_type,
                    'signed_date'=>$data->signed_date
                ]);
            }

        }
        return $client;
    }

    public function update(Client $client, $data): Client
    {
        // Update client fields
        $client->update([
            'name'           => $data->name,
            'company_name'   => $data->company_name,
            'email'          => $data->email,
            'phone'          => $data->phone,
            'address'        => $data->address,
            'client_type'    => $data->client_type,
            'fee_percentage' => $data->fee_percentage,
            'status'         => $data->status,
        ]);

        $keepIds = $data->input('existing_agreements', []);

        foreach ($client->agreements as $agreement) {
            if (!in_array($agreement->id, $keepIds)) {
                Storage::delete($agreement->file_path);
                $agreement->delete();
            }
        }

        foreach ($data->file('agreements', []) as $file) {
            if ($file instanceof UploadedFile) {
                Agreement::create([
                    'client_id'      => $client->id,
                    'file_path'      => $file->store('agreements'),
                    'original_name'  => $file->getClientOriginalName(),
                    'agreement_type' => $data->agreement_type,
                    'signed_date'    => $data->signed_date,
                ]);
            }
        }

        return $client;
    }


    public function detail(Client $client): array
    {
        return [
            'client' => $client->load('notes.author'),
        ];
    }
}
