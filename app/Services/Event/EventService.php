<?php

namespace App\Services\Event;

use App\Models\Event;
use App\Models\JobCandidate;
use App\Models\Placement;
use App\Models\Invoice;
use App\Models\Agreement;
use App\Models\Engagement;
use App\Utils\GlobalConstant;
use Carbon\Carbon;

class EventService
{
    public function syncEvents(): void
    {
        \Log::info('Event Sync Started');
        $this->syncJobEvents();
        $this->syncPipelineEvents();
        $this->syncPlacementEvents();
        $this->syncInvoiceEvents();
        $this->syncAgreementEvents();
        \Log::info('Event Sync Completed');
    }

    /*
    |--------------------------------------------------------------------------
    | JOB EVENTS (Engagement)
    |--------------------------------------------------------------------------
    */

    private function syncJobEvents(): void
    {
        $jobs = Engagement::all();

        foreach ($jobs as $job) {

            $this->createOrUpdateEvent(
                GlobalConstant::EVENT_TYPE_JOB_CREATED,
                GlobalConstant::EVENT_ENTITY_JOB,
                $job->id,
                GlobalConstant::EVENT_TITLE_JOB_CREATED,
                $this->replaceVariables(
                    GlobalConstant::EVENT_DESC_JOB_CREATED,
                    ['job' => $job->title]
                ),
                $job->created_at,
                GlobalConstant::EVENT_COLOR_JOB
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | PIPELINE EVENTS
    |--------------------------------------------------------------------------
    */

    private function syncPipelineEvents(): void
    {
        $jobCandidates = JobCandidate::with(['candidate', 'job'])->get();

        foreach ($jobCandidates as $jc) {

            $candidate = $jc->candidate->first_name ?? 'Candidate';
            $job = $jc->job->title ?? 'Job';

            if ($jc->interview_scheduled_at) {
                $this->createOrUpdateEvent(
                    GlobalConstant::EVENT_TYPE_INTERVIEW,
                    GlobalConstant::EVENT_ENTITY_JOB_CANDIDATE,
                    $jc->id,
                    GlobalConstant::EVENT_TITLE_INTERVIEW,
                    $this->replaceVariables(
                        GlobalConstant::EVENT_DESC_INTERVIEW,
                        compact('candidate', 'job')
                    ),
                    $jc->interview_scheduled_at,
                    GlobalConstant::EVENT_COLOR_INTERVIEW
                );
            }

            if ($jc->offered_at) {
                $this->createOrUpdateEvent(
                    GlobalConstant::EVENT_TYPE_OFFER,
                    GlobalConstant::EVENT_ENTITY_JOB_CANDIDATE,
                    $jc->id,
                    GlobalConstant::EVENT_TITLE_OFFER,
                    $this->replaceVariables(
                        GlobalConstant::EVENT_DESC_OFFER,
                        compact('candidate', 'job')
                    ),
                    $jc->offered_at,
                    GlobalConstant::EVENT_COLOR_INTERVIEW
                );
            }

            if ($jc->placed_at) {
                $this->createOrUpdateEvent(
                    GlobalConstant::EVENT_TYPE_PLACED,
                    GlobalConstant::EVENT_ENTITY_JOB_CANDIDATE,
                    $jc->id,
                    GlobalConstant::EVENT_TITLE_PLACED,
                    $this->replaceVariables(
                        GlobalConstant::EVENT_DESC_PLACED,
                        compact('candidate', 'job')
                    ),
                    $jc->placed_at,
                    GlobalConstant::EVENT_COLOR_PLACEMENT
                );
            }

            if ($jc->rejected_at) {
                $this->createOrUpdateEvent(
                    GlobalConstant::EVENT_TYPE_REJECTED,
                    GlobalConstant::EVENT_ENTITY_JOB_CANDIDATE,
                    $jc->id,
                    GlobalConstant::EVENT_TITLE_REJECTED,
                    $this->replaceVariables(
                        GlobalConstant::EVENT_DESC_REJECTED,
                        compact('candidate', 'job')
                    ),
                    $jc->rejected_at,
                    GlobalConstant::EVENT_COLOR_REJECTED
                );
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | PLACEMENT EVENTS
    |--------------------------------------------------------------------------
    */

    private function syncPlacementEvents(): void
    {
        $placements = Placement::with(['candidate', 'job'])->get();

        foreach ($placements as $placement) {

            $candidate = $placement->candidate->first_name ?? 'Candidate';
            $job = $placement->job->title ?? 'Job';

            if ($placement->start_date) {
                $this->createOrUpdateEvent(
                    GlobalConstant::EVENT_TYPE_PLACEMENT_START,
                    GlobalConstant::EVENT_ENTITY_PLACEMENT,
                    $placement->id,
                    GlobalConstant::EVENT_TITLE_PLACEMENT_START,
                    $this->replaceVariables(
                        GlobalConstant::EVENT_DESC_PLACEMENT_START,
                        compact('candidate', 'job')
                    ),
                    $placement->start_date,
                    GlobalConstant::EVENT_COLOR_PLACEMENT
                );
            }

            if ($placement->guarantee_end_date) {
                $this->createOrUpdateEvent(
                    GlobalConstant::EVENT_TYPE_GUARANTEE_END,
                    GlobalConstant::EVENT_ENTITY_PLACEMENT,
                    $placement->id,
                    GlobalConstant::EVENT_TITLE_GUARANTEE_END,
                    $this->replaceVariables(
                        GlobalConstant::EVENT_DESC_GUARANTEE_END,
                        compact('candidate')
                    ),
                    $placement->guarantee_end_date,
                    GlobalConstant::EVENT_COLOR_PLACEMENT
                );
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | INVOICE EVENTS
    |--------------------------------------------------------------------------
    */

    private function syncInvoiceEvents(): void
    {
        $invoices = Invoice::all();

        foreach ($invoices as $invoice) {

            $amount = number_format($invoice->amount, 2);

            if ($invoice->sent_date) {
                $this->createOrUpdateEvent(
                    GlobalConstant::EVENT_TYPE_INVOICE_SENT,
                    GlobalConstant::EVENT_ENTITY_INVOICE,
                    $invoice->id,
                    GlobalConstant::EVENT_TITLE_INVOICE_SENT,
                    $this->replaceVariables(
                        GlobalConstant::EVENT_DESC_INVOICE_SENT,
                        [
                            'invoice' => $invoice->invoice_number,
                            'amount' => $amount
                        ]
                    ),
                    $invoice->sent_date,
                    GlobalConstant::EVENT_COLOR_INVOICE
                );
            }

            if ($invoice->paid_date) {
                $this->createOrUpdateEvent(
                    GlobalConstant::EVENT_TYPE_INVOICE_PAID,
                    GlobalConstant::EVENT_ENTITY_INVOICE,
                    $invoice->id,
                    GlobalConstant::EVENT_TITLE_INVOICE_PAID,
                    $this->replaceVariables(
                        GlobalConstant::EVENT_DESC_INVOICE_PAID,
                        [
                            'invoice' => $invoice->invoice_number,
                            'amount' => $amount
                        ]
                    ),
                    $invoice->paid_date,
                    GlobalConstant::EVENT_COLOR_INVOICE
                );
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | AGREEMENT EVENTS
    |--------------------------------------------------------------------------
    */

    private function syncAgreementEvents(): void
    {
        $agreements = Agreement::all();

        foreach ($agreements as $agreement) {

            if ($agreement->signed_date) {
                $this->createOrUpdateEvent(
                    GlobalConstant::EVENT_TYPE_AGREEMENT_SIGNED,
                    GlobalConstant::EVENT_ENTITY_AGREEMENT,
                    $agreement->id,
                    GlobalConstant::EVENT_TITLE_AGREEMENT_SIGNED,
                    $this->replaceVariables(
                        GlobalConstant::EVENT_DESC_AGREEMENT_SIGNED,
                        ['client' => $agreement->client_id]
                    ),
                    $agreement->signed_date,
                    GlobalConstant::EVENT_COLOR_AGREEMENT
                );
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | CORE UPSERT
    |--------------------------------------------------------------------------
    */

    private function createOrUpdateEvent(
        string $type,
        string $entityType,
        int $entityId,
        string $title,
        string $description,
               $date,
        string $color
    ): void {
        try {
            Event::updateOrCreate(
                [
                    'type' => $type,
                    'entity_type' => $entityType,
                    'entity_id' => $entityId,
                ],
                [
                    'title' => $title,
                    'description' => $description,
                    'start_at' => Carbon::parse($date),
                    'color' => $color,
                    'status' => $this->resolveStatus($date),
                ]
            );

            \Log::info("Event created/updated", [
                'type' => $type,
                'entity_id' => $entityId
            ]);
        }catch (\Exception $e){

            \Log::error("Event failed", [
                'error' => $e->getMessage()
            ]);

        }
    }

    private function resolveStatus($date): string
    {
        return Carbon::parse($date)->isFuture()
            ? GlobalConstant::EVENT_STATUS_UPCOMING
            : GlobalConstant::EVENT_STATUS_COMPLETED;
    }

    private function replaceVariables(string $template, array $data): string
    {
        foreach ($data as $key => $value) {
            $template = str_replace("{{$key}}", $value, $template);
        }

        return $template;
    }
}
