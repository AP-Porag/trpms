<?php

namespace App\Services\GlobalSearch;

use App\DTOs\GlobalSearchResult\GlobalSearchResultDto;
use App\Models\Candidate;
use App\Models\Client;
use App\Models\Engagement;
use App\Models\JobCandidate;
use App\Services\BaseService;
use App\Utils\GlobalConstant;
use App\Models\Contact;
use App\Models\Invoice;
use App\Models\Lead;
use App\Models\Note;
use App\Models\Placement;
use Illuminate\Support\Str;
use Illuminate\Support\Collection;


class GlobalSearchService extends BaseService
{
    private const MIN_LENGTH = 3;

    public const TYPES = [
        'all',
        'clients',
        'jobs',
        'candidates',
        'pipeline',
        'prospects',
        'leads',
        'placements',
        'invoices',
        'notes',
        'contacts',
    ];

    public const FILTERS = [
        [
            'value' => 'all',
            'label' => 'All Results',
        ],
        [
            'value' => 'clients',
            'label' => 'Clients',
        ],
        [
            'value' => 'jobs',
            'label' => 'Jobs',
        ],
        [
            'value' => 'candidates',
            'label' => 'Candidates',
        ],
        [
            'value' => 'pipeline',
            'label' => 'Pipeline',
        ],
        [
            'value' => 'prospects',
            'label' => 'Prospects',
        ],
        [
            'value' => 'leads',
            'label' => 'Leads',
        ],
        [
            'value' => 'placements',
            'label' => 'Placements',
        ],
        [
            'value' => 'invoices',
            'label' => 'Invoices',
        ],
        [
            'value' => 'notes',
            'label' => 'Notes',
        ],
        [
            'value' => 'contacts',
            'label' => 'Contacts',
        ],
    ];

    public function __construct()
    {
        parent::__construct(new Client());
    }


    public function search(
        string $query,
        string $type = 'all'
    ): array {

        $results = $this->emptyResults();

        if ($this->shouldSearch($type, 'clients')) {
            $results['clients'] = $this->searchClients($query);
        }

        if ($this->shouldSearch($type, 'jobs')) {
            $results['jobs'] = $this->searchJobs($query);
        }

        if ($this->shouldSearch($type, 'candidates')) {
            $results['candidates'] = $this->searchCandidates($query);
        }

        if ($this->shouldSearch($type, 'pipeline')) {
            $results['pipeline'] = $this->searchPipeline($query);
        }

        if ($this->shouldSearch($type, 'prospects')) {
            $results['prospects'] = $this->searchProspects($query);
        }

        if ($this->shouldSearch($type, 'leads')) {
            $results['leads'] = $this->searchLeads($query);
        }

        if ($this->shouldSearch($type, 'placements')) {
            $results['placements'] = $this->searchPlacements($query);
        }

        if ($this->shouldSearch($type, 'invoices')) {
            $results['invoices'] = $this->searchInvoices($query);
        }

        if ($this->shouldSearch($type, 'notes')) {
            $results['notes'] = $this->searchNotes($query);
        }

        if ($this->shouldSearch($type, 'contacts')) {
            $results['contacts'] = $this->searchContacts($query);
        }

        return [
            'query' => $query,
            'type' => $type,

            'meta' => [
                'minimum_length' => self::MIN_LENGTH,
                'types' => self::TYPES,
                'filters' => self::FILTERS,
            ],

            'results' => $results,
        ];
    }

    private function emptyResults(): array
    {
        return [
            'clients' => [],
            'jobs' => [],
            'candidates' => [],
            'pipeline' => [],
            'prospects' => [],
            'leads' => [],
            'placements' => [],
            'invoices' => [],
            'notes' => [],
            'contacts' => [],
        ];
    }

    private function searchClients(string $query): array
    {
        return $this->transform(
            Client::query()
                ->with('industry')
                ->where('category', 'client')
                ->where(function ($q) use ($query) {

                    $q->where('name', 'like', "%{$query}%")
                        ->orWhere('company_name', 'like', "%{$query}%")
                        ->orWhere('email', 'like', "%{$query}%")
                        ->orWhere('phone', 'like', "%{$query}%")
                        ->orWhere('client_type', 'like', "%{$query}%")
                        ->orWhere('fee_type', 'like', "%{$query}%")
                        ->orWhere('rating', 'like', "%{$query}%")
                        ->orWhere('current_openings', 'like', "%{$query}%")
                        ->orWhere('agreement_type', 'like', "%{$query}%");
                })
                ->latest()
                ->limit(50)
                ->get()
                ->map(function (Client $client) {

                    return new GlobalSearchResultDto(
                        id: $client->id,
                        type: 'client',
                        title: $client->company_name,
                        subtitle: $client->name,
                        description: 'Client',
                        url: route('clients.show', $client)
                    );
                })
//                ->map(fn($dto) => $dto->toArray())
                ->values()
                ->toArray()
        );
    }

    private function searchJobs(string $query): array
    {
        return $this->transform(
            Engagement::query()
                ->with('client')
                ->where(function ($q) use ($query) {

                    $q->where('title', 'like', "%{$query}%")
                        ->orWhere('description', 'like', "%{$query}%")
                        ->orWhere('salary_range', 'like', "%{$query}%")
                        ->orWhere('location', 'like', "%{$query}%")
                        ->orWhere('priority', 'like', "%{$query}%")
                        ->orWhere('status', 'like', "%{$query}%")
                        ->orWhere('stage', 'like', "%{$query}%");
                })
                ->latest()
                ->limit(50)
                ->get()
                ->map(function (Engagement $job) {

                    return new GlobalSearchResultDto(
                        id: $job->id,
                        type: 'job',
                        title: $job->title,
                        subtitle: $job->client?->company_name,
                        description: $job->location,
                        url: route('jobs.show', $job)
                    );
                })
//                ->map(fn($dto) => $dto->toArray())
                ->values()
                ->toArray()
        );
    }

    private function searchCandidates(string $query): array
    {
        return $this->transform(
            Candidate::query()
                ->where(function ($q) use ($query) {

                    $q->where('first_name', 'like', "%{$query}%")
                        ->orWhere('last_name', 'like', "%{$query}%")
                        ->orWhere('email', 'like', "%{$query}%")
                        ->orWhere('phone', 'like', "%{$query}%")
                        ->orWhere('address', 'like', "%{$query}%")
                        ->orWhere('expected_salary', 'like', "%{$query}%");
                })
                ->latest()
                ->limit(50)
                ->get()
                ->map(function (Candidate $candidate) {

                    return new GlobalSearchResultDto(
                        id: $candidate->id,
                        type: 'candidate',
                        title: trim(
                            $candidate->first_name . ' ' . $candidate->last_name
                        ),
                        subtitle: $candidate->email,
                        description: $candidate->phone,
                        url: route('candidates.show', $candidate)
                    );
                })
    //            ->map(fn($dto) => $dto->toArray())
                ->values()
                ->toArray()
            );
    }

    private function searchPipeline(string $query): array
    {
        return $this->transform(
            JobCandidate::query()
                ->with([
                    'candidate',
                    'job',
                ])
                ->where(function ($q) use ($query) {

                    $q->where('stage', 'like', "%{$query}%")

                        ->orWhereHas('candidate', function ($candidate) use ($query) {

                            $candidate
                                ->where('first_name', 'like', "%{$query}%")
                                ->orWhere('last_name', 'like', "%{$query}%");
                        })

                        ->orWhereHas('job', function ($job) use ($query) {

                            $job->where(
                                'title',
                                'like',
                                "%{$query}%"
                            );
                        });
                })
                ->latest()
                ->limit(50)
                ->get()
                ->map(function (JobCandidate $pipeline) {

                    $candidateName = trim(
                        ($pipeline->candidate?->first_name ?? '') .
                        ' ' .
                        ($pipeline->candidate?->last_name ?? '')
                    );

                    return new GlobalSearchResultDto(
                        id: $pipeline->id,
                        type: 'pipeline',
                        title: $candidateName,
                        subtitle: $pipeline->job?->title,
                        description: $pipeline->stage,
                        url: route('jobs.show', $pipeline->job)
                    );
                })
        );
    }

    private function searchProspects(string $query): array
    {
        return $this->transform(
            Client::query()
                ->where('category', GlobalConstant::CLIENT_CATEGORY_PROSPECT)
                ->where(function ($q) use ($query) {

                    $q->where('name', 'like', "%{$query}%")
                        ->orWhere('company_name', 'like', "%{$query}%")
                        ->orWhere('email', 'like', "%{$query}%")
                        ->orWhere('phone', 'like', "%{$query}%")
                        ->orWhere('current_openings', 'like', "%{$query}%");
                })
                ->latest()
                ->limit(50)
                ->get()
                ->map(function (Client $prospect) {

                    return new GlobalSearchResultDto(
                        id: $prospect->id,
                        type: 'prospect',
                        title: $prospect->company_name,
                        subtitle: $prospect->name,
                        description: 'Prospect',
                        url: route('prospects.show', $prospect)
                    );
                })
    //            ->map(fn($dto) => $dto->toArray())
                ->values()
                ->toArray()
            );
    }

    private function searchLeads(string $query): array
    {
        return Lead::query()
            ->with([
                'industry',
                'source',
            ])
            ->where(function ($q) use ($query) {

                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('company_name', 'like', "%{$query}%")
                    ->orWhere('current_openings', 'like', "%{$query}%")
                    ->orWhere('mpc', 'like', "%{$query}%");
            })
            ->latest()
            ->limit(50)
            ->get()
            ->map(function ($lead) {

                return new GlobalSearchResultDto(
                    id: $lead->id,
                    type: 'lead',
                    title: $lead->company_name,
                    subtitle: $lead->name,
                    description: 'Lead',
                    url: route('leads.show', $lead)
                );
            })
            ->map(fn ($dto) => $dto->toArray())
            ->values()
            ->toArray();
    }

    private function searchPlacements(string $query): array
    {
        return $this->transform(
            Placement::query()
                ->with([
                    'candidate',
                    'client',
                    'job',
                ])
                ->where(function ($q) use ($query) {

                    $q->where('placement_invoice_status', 'like', "%{$query}%")

                        ->orWhere('placement_date', 'like', "%{$query}%")

                        ->orWhereHas('candidate', function ($candidate) use ($query) {

                            $candidate
                                ->where('first_name', 'like', "%{$query}%")
                                ->orWhere('last_name', 'like', "%{$query}%");
                        })

                        ->orWhereHas('client', function ($client) use ($query) {

                            $client->where(
                                'company_name',
                                'like',
                                "%{$query}%"
                            );
                        })

                        ->orWhereHas('job', function ($job) use ($query) {

                            $job->where(
                                'title',
                                'like',
                                "%{$query}%"
                            );
                        });
                })
                ->latest()
                ->limit(50)
                ->get()
                ->map(function (Placement $placement) {

                    $candidateName = trim(
                        ($placement->candidate?->first_name ?? '') .
                        ' ' .
                        ($placement->candidate?->last_name ?? '')
                    );

                    return new GlobalSearchResultDto(
                        id: $placement->id,
                        type: 'placement',
                        title: $candidateName,
                        subtitle: $placement->job?->title,
                        description: $placement->client?->company_name,
                        url: route('placements.show', $placement)
                    );
                })
        );
    }

    private function searchInvoices(string $query): array
    {
        return $this->transform(
            Invoice::query()
                ->with('client')
                ->where(function ($q) use ($query) {

                    $q->where(
                        'invoice_number',
                        'like',
                        "%{$query}%"
                    )

                        ->orWhere(
                            'status',
                            'like',
                            "%{$query}%"
                        )

                        ->orWhere(
                            'amount',
                            'like',
                            "%{$query}%"
                        )

                        ->orWhereHas('client', function ($client) use ($query) {

                            $client->where(
                                'company_name',
                                'like',
                                "%{$query}%"
                            );
                        });
                })
                ->latest()
                ->limit(50)
                ->get()
                ->map(function (Invoice $invoice) {

                    return new GlobalSearchResultDto(
                        id: $invoice->id,
                        type: 'invoice',
                        title: $invoice->invoice_number,
                        subtitle: $invoice->client?->company_name,
                        description: $invoice->status,
                        url: route('invoices.show', $invoice)
                    );
                })
        );
    }

    private function searchNotes(string $query): array
    {
        return Note::query()
            ->where('note', 'like', "%{$query}%")
            ->latest()
            ->limit(50)
            ->get()
            ->map(function (Note $note) {

                return new GlobalSearchResultDto(
                    id: $note->id,
                    type: 'note',
                    title: Str::limit($note->note, 60),
                    subtitle: class_basename($note->noteable_type),
                    description: 'Note',
                    url: $this->resolveNoteUrl($note)
                );
            })
            ->map(fn ($dto) => $dto->toArray())
            ->values()
            ->toArray();
    }

    private function searchContacts(string $query): array
    {
        return Contact::query()
            ->where(function ($q) use ($query) {

                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('type', 'like', "%{$query}%")
                    ->orWhere('contact', 'like', "%{$query}%");
            })
            ->latest()
            ->limit(50)
            ->get()
            ->map(function (Contact $contact) {

                return new GlobalSearchResultDto(
                    id: $contact->id,
                    type: 'contact',
                    title: $contact->name,
                    subtitle: $contact->contact,
                    description: $contact->type,
                    url: $this->resolveContactUrl($contact)
                );
            })
            ->map(fn ($dto) => $dto->toArray())
            ->values()
            ->toArray();
    }

    private function resolveNoteUrl(Note $note): string
    {
        $parent = $note->noteable;

        if (!$parent) {
            return '#';
        }

        return $this->resolveEntityUrl($parent);
    }

    private function resolveContactUrl(Contact $contact): string
    {
        $parent = $contact->contactable;

        if (!$parent) {
            return '#';
        }

        return $this->resolveEntityUrl($parent);
    }

    private function resolveEntityUrl(object $entity): string
    {
        return match (true) {

            $entity instanceof Client
            && $entity->category === GlobalConstant::CLIENT_CATEGORY_CLIENT
            => route('clients.show', $entity),

            $entity instanceof Client
            && $entity->category === GlobalConstant::CLIENT_CATEGORY_PROSPECT
            => route('prospects.show', $entity),

            $entity instanceof Client
            && $entity->category === GlobalConstant::CLIENT_CATEGORY_TARGET_ACCOUNT
            => route('target-accounts.show', $entity),

            $entity instanceof Candidate
            => route('candidates.show', $entity),

            $entity instanceof Engagement
            => route('jobs.show', $entity),

            $entity instanceof Placement
            => route('placements.show', $entity),

            default => '#',
        };
    }

    private function transform($items): array
    {
        return collect($items)
            ->map(fn ($dto) => $dto->toArray())
            ->values()
            ->toArray();
    }

    private function shouldSearch(
        string $requestedType,
        string $currentType
    ): bool {
        return $requestedType === 'all'
            || $requestedType === $currentType;
    }


}
