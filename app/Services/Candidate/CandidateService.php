<?php

namespace App\Services\Candidate;
use App\Models\Candidate;
use App\Services\BaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CandidateService extends BaseService
{
    public function __construct(Candidate $engagement)
    {
        parent::__construct($engagement);
    }
    public function list(Request $request): array
    {
        $search = $request->input('search', '');
        $status = $request->input('status', 'all');
        $perPage = $request->input('perPage', 5);
        $query = Candidate::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($status !== 'all') {
            $query->where('status', (int) $status);
        }

        $candidates = $query->latest()->paginate($perPage ?? 10);
        return [
            'candidates' => $candidates->items(),
            'meta' => pagination_meta($candidates,'Search by name, email, phone...'),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'perPage' => $perPage,
            ],
        ];
    }

    public function create($data): Candidate
    {
        $resumePath = null;
        $originalName = null;

        if ($data->hasFile('file')) {
            $resumePath = $data->file('file')->store('resumes', 'public');
            $originalName = $data->file('file')->getClientOriginalName();
        }

        return Candidate::create([
            'first_name'    => $data->first_name,
            'last_name'     => $data->last_name,
            'email'         => $data->email,
            'phone'         => $data->phone,
            'address'       => $data->address,
            'resume_path'   => $resumePath,
            'original_name' => $originalName,
        ]);
    }


    public function update(Candidate $candidate, $data): Candidate
    {
        $updateData = [
            'first_name' => $data->first_name,
            'last_name'  => $data->last_name,
            'email'      => $data->email,
            'phone'      => $data->phone,
            'address'    => $data->address,
        ];

        // Only replace resume if new file uploaded
        if ($data->hasFile('file')) {

            // Delete old resume
            if ($candidate->resume_path && Storage::exists($candidate->resume_path)) {
                Storage::delete($candidate->resume_path);
            }

            $updateData['resume_path'] = $data->file('file')->store('resumes','public');
            $updateData['original_name'] = $data->file('file')->getClientOriginalName();
        }

        $candidate->update($updateData);

        return $candidate;
    }



    public function detail(Candidate $candidate): array
    {
        return [
            'candidate' => $candidate->load('notes.author'),
        ];
    }
}
