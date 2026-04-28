<?php

namespace App\Services\Lead;

use App\Models\Lead;
use App\Models\Note;
use App\Services\BaseService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;


class LeadService extends BaseService
{

    public function __construct(Lead $lead)
    {
        parent::__construct($lead);
    }

    public function list(Request $request): array
    {
        $search = $request->input('search', '');
        $status = $request->input('status', 'all');
        $perPage = $request->input('perPage', 5);
        $query = Lead::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('contact_name', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%");
                // ->orWhere('phone', 'like', "%{$search}%")
                // ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        // if ($status !== 'all') {
        //     $query->where('status', (int) $status);
        // }

        $leads = $query->latest()->paginate($perPage ?? 10);
        return [
            'leads' => $leads->items(),
            'meta' => pagination_meta($leads, 'Search by contact name, company name...'),
            'filters' => [
                'search' => $search,
                'status' => $status,
                'perPage' => $perPage,
            ],
        ];
    }

    /**
     * Paginate leads
     * Controller: index()
     */
    public function paginate($perPage = 15)
    {
        return $this->model
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Create lead
     * Controller: store()
     */
    public function create($data): Lead
    {


        $lead = Lead::create([
            'name'         => $data['name'],
            'company_name' => $data['company_name'],
            'industry_id'  => $data['industry_id'] ?? null,
            'source_id' => $data['source_id'] ?? null,
            'current_openings'    => $data['current_openings'],
            'status'    => $data['status'],
            'mpc'          => $data['mpc'],
        ]);
        // 🔥 Pivot table insert (IMPORTANT)
        if (!empty($data['departments'])) {
            $lead->departments()->sync(
                array_map('intval', $data['departments'])
            );
        }

        $note = $data['note'] ?? null;



        if (!empty($note)) {
            Note::create([
                'note' => $note,
                'noteable_id' => $lead->id,
                'noteable_type' => 'client',
                'created_by' => auth()->id(), // IMPORTANT if column exists
            ]);
        }

        return $lead;
    }

    /**
     * Update lead
     * Controller: update()
     */
    public function update($id, array $data): Lead
    {
        $lead = Lead::findOrFail($id);

        $lead->update([
            'name'             => $data['name'],
            'company_name'     => $data['company_name'],
            'industry_id'      => $data['industry_id'] ?? null,
            'source_id'        => $data['source_id'] ?? null,
            'mpc'              => $data['mpc'] ?? null,
            'current_openings' => $data['current_openings'] ?? null,
            'status'           => $data['status'],
        ]);

        // departments sync (safe)
        $lead->departments()->sync($data['departments'] ?? []);

        return $lead;
    }

    /**
     * Delete lead
     * Controller: destroy()
     */
    public function delete(int $id): bool
    {
        $lead = $this->model->findOrFail($id);

        $this->authorizeAccess($lead);

        return $lead->delete();
    }

    /**
     * Ownership enforcement (LemonGard rule compliance)
     */
    private function authorizeAccess(Lead $lead): void
    {
        $user = Auth::user();

        // Admin can access everything
        if ($user && $user->role === 'admin') {
            return;
        }

        // Users can only modify their own leads
        if ($user && isset($lead->user_id) && $lead->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }
    }

    public function leadtDetail(Lead $lead): array
    {
        return [
            'lead' => $lead->load([
                'departments',
                'notes',
                'contacts'
            ]),
        ];
    }
}
