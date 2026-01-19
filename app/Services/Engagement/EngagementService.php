<?php

namespace App\Services\Engagement;
use App\Models\Engagement;
use App\Services\BaseService;
use Illuminate\Http\Request;

class EngagementService extends BaseService
{
    public function __construct(Engagement $engagement)
    {
        parent::__construct($engagement);
    }
    public function list(Request $request): array
    {
        $search = $request->input('search', '');
        $status = $request->input('status', 'all');
        $perPage = $request->input('perPage', 5);
        $query = Engagement::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('fee_type', 'like', "%{$search}%")
                    ->orWhere('fee_value', 'like', "%{$search}%");
            });
        }

        if ($status !== 'all') {
            $query->where('status', (int) $status);
        }

        $jobs = $query->latest()->paginate($perPage ?? 10);
        return [
            'jobs' => $jobs->items(),
            'meta' => pagination_meta($jobs,'Search by title, fee type, fee value...'),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'perPage' => $perPage,
            ],
        ];
    }

    public function create($data): Engagement
    {
        return Engagement::create([
            'client_id'=>$data->client_id,
            'title'=>$data->title,
            'description'=>$data->description,
            'fee_type'=>$data->fee_type,
            'fee_value'=>$data->fee_value,
            'status'=>$data->status,
        ]);
    }

    public function update($id, $data)
    {
        // Update job fields
        $job = Engagement::findOrFail($id);
        $job->update([
            'client_id'=>$data->client_id,
            'title'=>$data->title,
            'description'=>$data->description,
            'fee_type'=>$data->fee_type,
            'fee_value'=>$data->fee_value,
            'status'=>$data->status,
        ]);
        return $job;
    }


    public function detail(Engagement $engagement): array
    {
        return [
            'job' => $engagement->load('notes.author'),
        ];
    }
}
