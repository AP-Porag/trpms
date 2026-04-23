<?php

namespace App\Services\Lead;

use App\Models\Lead;
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
    public function create(array $data)
    {
        // If ownership is needed (recommended for SaaS rule)
        if (Auth::check()) {
            $data['user_id'] = Auth::id();
        }

        return $this->model->create($data);
    }

    /**
     * Update lead
     * Controller: update()
     */
    public function update(int $id, array $data)
    {
        $lead = $this->model->findOrFail($id);

        $this->authorizeAccess($lead);

        $lead->update($data);

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
}
