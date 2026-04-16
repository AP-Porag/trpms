<?php

namespace App\Services\Notification;

use App\Models\Notification;
use App\Models\JobCandidate;
use App\Models\Placement;
use App\Models\Invoice;
use App\Models\Agreement;
use App\Models\Engagement;
use App\Models\RevenueGoal;
use App\Utils\GlobalConstant;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    public function syncNotifications(): void
    {
        \Log::info('Event Sync Started');
        $this->jobCreated();
        $this->pipelineNotifications();
        $this->interviewReminder();
        $this->placementNotifications();
        $this->invoiceNotifications();
        $this->agreementNotifications();
        $this->revenueNotifications();
        \Log::info('Event Sync Completed');
    }

    /*
    |--------------------------------------------------------------------------
    | CORE CREATE METHOD
    |--------------------------------------------------------------------------
    */

    private function createNotification(array $data): void
    {
        $exists = Notification::where([
            'type' => $data['type'],
            'entity_type' => $data['entity_type'],
            'entity_id' => $data['entity_id'],
        ])->exists();

        if ($exists) {
            return;
        }

        Notification::create($data);

        Log::info('Notification created', [
            'type' => $data['type'],
            'entity_id' => $data['entity_id'],
        ]);
    }

    private function replaceVariables(string $template, array $data): string
    {
        foreach ($data as $key => $value) {
            $template = str_replace("{{$key}}", $value, $template);
        }
        return $template;
    }

    /*
    |--------------------------------------------------------------------------
    | JOB CREATED
    |--------------------------------------------------------------------------
    */

    private function jobCreated(): void
    {
        Engagement::chunk(100, function ($jobs) {
            foreach ($jobs as $job) {
                $this->createNotification([
                    'type' => GlobalConstant::NOTIFICATION_TYPE_JOB_CREATED,
                    'entity_type' => GlobalConstant::EVENT_ENTITY_JOB,
                    'entity_id' => $job->id,
                    'title' => GlobalConstant::NOTIFICATION_TITLE_JOB_CREATED,
                    'description' => $this->replaceVariables(
                        GlobalConstant::NOTIFICATION_DESC_JOB_CREATED,
                        ['job' => $job->title]
                    ),
                    'icon_letter' => GlobalConstant::NOTIFICATION_ICON_JOB,
                    'route_name' => 'engagements.show',
                    'route_param' => $job->id,
                    'created_at' => $job->created_at,
                ]);
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | PIPELINE
    |--------------------------------------------------------------------------
    */

    private function pipelineNotifications(): void
    {
        JobCandidate::with(['candidate', 'job'])->chunk(100, function ($rows) {
            foreach ($rows as $jc) {
                $data = [
                    'candidate' => $jc->candidate?->first_name,
                    'job' => $jc->job?->title,
                ];

                if ($jc->interview_scheduled_at) {
                    $this->createNotification([
                        'type' => GlobalConstant::NOTIFICATION_TYPE_INTERVIEW,
                        'entity_type' => GlobalConstant::EVENT_ENTITY_JOB_CANDIDATE,
                        'entity_id' => $jc->id,
                        'title' => GlobalConstant::NOTIFICATION_TITLE_INTERVIEW,
                        'description' => $this->replaceVariables(
                            GlobalConstant::NOTIFICATION_DESC_INTERVIEW,
                            $data
                        ),
                        'icon_letter' => GlobalConstant::NOTIFICATION_ICON_INTERVIEW,
                        'route_name' => 'job-candidates.show',
                        'route_param' => $jc->id,
                        'created_at' => $jc->interview_scheduled_at,
                    ]);
                }

                if ($jc->offered_at) {
                    $this->createNotification([
                        'type' => GlobalConstant::NOTIFICATION_TYPE_OFFER,
                        'entity_type' => GlobalConstant::EVENT_ENTITY_JOB_CANDIDATE,
                        'entity_id' => $jc->id,
                        'title' => GlobalConstant::NOTIFICATION_TITLE_OFFER,
                        'description' => $this->replaceVariables(
                            GlobalConstant::NOTIFICATION_DESC_OFFER,
                            $data
                        ),
                        'icon_letter' => GlobalConstant::NOTIFICATION_ICON_INTERVIEW,
                        'route_name' => 'job-candidates.show',
                        'route_param' => $jc->id,
                        'created_at' => $jc->offered_at,
                    ]);
                }

                if ($jc->placed_at) {
                    $this->createNotification([
                        'type' => GlobalConstant::NOTIFICATION_TYPE_PLACED,
                        'entity_type' => GlobalConstant::EVENT_ENTITY_JOB_CANDIDATE,
                        'entity_id' => $jc->id,
                        'title' => GlobalConstant::NOTIFICATION_TITLE_PLACED,
                        'description' => $this->replaceVariables(
                            GlobalConstant::NOTIFICATION_DESC_PLACED,
                            $data
                        ),
                        'icon_letter' => GlobalConstant::NOTIFICATION_ICON_PLACEMENT,
                        'route_name' => 'placements.show',
                        'route_param' => $jc->placement?->id,
                        'created_at' => $jc->placed_at,
                    ]);
                }

                if ($jc->rejected_at) {
                    $this->createNotification([
                        'type' => GlobalConstant::NOTIFICATION_TYPE_REJECTED,
                        'entity_type' => GlobalConstant::EVENT_ENTITY_JOB_CANDIDATE,
                        'entity_id' => $jc->id,
                        'title' => GlobalConstant::NOTIFICATION_TITLE_REJECTED,
                        'description' => $this->replaceVariables(
                            GlobalConstant::NOTIFICATION_DESC_REJECTED,
                            $data
                        ),
                        'icon_letter' => GlobalConstant::NOTIFICATION_ICON_ALERT,
                        'route_name' => 'job-candidates.show',
                        'route_param' => $jc->id,
                        'created_at' => $jc->rejected_at,
                    ]);
                }
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | INTERVIEW REMINDER (1 HOUR BEFORE)
    |--------------------------------------------------------------------------
    */

    private function interviewReminder(): void
    {
        $target = now()->addHour();

        JobCandidate::whereBetween('interview_scheduled_at', [
            $target->copy()->subMinutes(5),
            $target->copy()->addMinutes(5),
        ])
            ->with(['candidate', 'job'])
            ->get()
            ->each(function ($jc) {

                $this->createNotification([
                    'type' => GlobalConstant::NOTIFICATION_TYPE_INTERVIEW_REMINDER,
                    'entity_type' => GlobalConstant::EVENT_ENTITY_JOB_CANDIDATE,
                    'entity_id' => $jc->id,
                    'title' => GlobalConstant::NOTIFICATION_TITLE_INTERVIEW_REMINDER,
                    'description' => $this->replaceVariables(
                        GlobalConstant::NOTIFICATION_DESC_INTERVIEW_REMINDER,
                        [
                            'candidate' => $jc->candidate?->first_name,
                            'job' => $jc->job?->title,
                        ]
                    ),
                    'icon_letter' => GlobalConstant::NOTIFICATION_ICON_ALERT,
                    'route_name' => 'job-candidates.show',
                    'route_param' => $jc->id,
                    'created_at' => now(),
                ]);
            });
    }

    /*
    |--------------------------------------------------------------------------
    | PLACEMENT
    |--------------------------------------------------------------------------
    */

    private function placementNotifications(): void
    {
        Placement::with('candidate')->chunk(100, function ($rows) {
            foreach ($rows as $p) {

                if ($p->start_date) {
                    $this->createNotification([
                        'type' => GlobalConstant::NOTIFICATION_TYPE_PLACEMENT_START,
                        'entity_type' => GlobalConstant::EVENT_ENTITY_PLACEMENT,
                        'entity_id' => $p->id,
                        'title' => GlobalConstant::NOTIFICATION_TITLE_PLACEMENT_START,
                        'description' => GlobalConstant::NOTIFICATION_DESC_PLACEMENT_START,
                        'icon_letter' => GlobalConstant::NOTIFICATION_ICON_PLACEMENT,
                        'route_name' => 'placements.show',
                        'route_param' => $p->id,
                        'created_at' => $p->start_date,
                    ]);
                }

                if ($p->guarantee_end_date) {
                    $this->createNotification([
                        'type' => GlobalConstant::NOTIFICATION_TYPE_GUARANTEE_END,
                        'entity_type' => GlobalConstant::EVENT_ENTITY_PLACEMENT,
                        'entity_id' => $p->id,
                        'title' => GlobalConstant::NOTIFICATION_TITLE_GUARANTEE_END,
                        'description' => GlobalConstant::NOTIFICATION_DESC_GUARANTEE_END,
                        'icon_letter' => GlobalConstant::NOTIFICATION_ICON_PLACEMENT,
                        'route_name' => 'placements.show',
                        'route_param' => $p->id,
                        'created_at' => $p->guarantee_end_date,
                    ]);
                }
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | INVOICE
    |--------------------------------------------------------------------------
    */

    private function invoiceNotifications(): void
    {
        Invoice::chunk(100, function ($rows) {
            foreach ($rows as $inv) {

                if ($inv->sent_date) {
                    $this->createNotification([
                        'type' => GlobalConstant::NOTIFICATION_TYPE_INVOICE_SENT,
                        'entity_type' => GlobalConstant::EVENT_ENTITY_INVOICE,
                        'entity_id' => $inv->id,
                        'title' => GlobalConstant::NOTIFICATION_TITLE_INVOICE_SENT,
                        'description' => GlobalConstant::NOTIFICATION_DESC_INVOICE_SENT,
                        'icon_letter' => GlobalConstant::NOTIFICATION_ICON_INVOICE,
                        'route_name' => 'invoices.show',
                        'route_param' => $inv->id,
                        'created_at' => $inv->sent_date,
                    ]);
                }

                if ($inv->paid_date) {
                    $this->createNotification([
                        'type' => GlobalConstant::NOTIFICATION_TYPE_INVOICE_PAID,
                        'entity_type' => GlobalConstant::EVENT_ENTITY_INVOICE,
                        'entity_id' => $inv->id,
                        'title' => GlobalConstant::NOTIFICATION_TITLE_INVOICE_PAID,
                        'description' => GlobalConstant::NOTIFICATION_DESC_INVOICE_PAID,
                        'icon_letter' => GlobalConstant::NOTIFICATION_ICON_INVOICE,
                        'route_name' => 'invoices.show',
                        'route_param' => $inv->id,
                        'created_at' => $inv->paid_date,
                    ]);
                }

                // 🔴 OVERDUE
                if ($inv->sent_date && !$inv->paid_date && now()->diffInDays($inv->sent_date) > 7) {
                    $this->createNotification([
                        'type' => GlobalConstant::NOTIFICATION_TYPE_INVOICE_OVERDUE,
                        'entity_type' => GlobalConstant::EVENT_ENTITY_INVOICE,
                        'entity_id' => $inv->id,
                        'title' => GlobalConstant::NOTIFICATION_TITLE_INVOICE_OVERDUE,
                        'description' => GlobalConstant::NOTIFICATION_DESC_INVOICE_OVERDUE,
                        'icon_letter' => GlobalConstant::NOTIFICATION_ICON_ALERT,
                        'route_name' => 'invoices.show',
                        'route_param' => $inv->id,
                        'created_at' => now(),
                    ]);
                }
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | AGREEMENT
    |--------------------------------------------------------------------------
    */

    private function agreementNotifications(): void
    {
        Agreement::with('client')->chunk(100, function ($rows) {
            foreach ($rows as $a) {

                if ($a->signed_date) {
                    $this->createNotification([
                        'type' => GlobalConstant::NOTIFICATION_TYPE_AGREEMENT_SIGNED,
                        'entity_type' => GlobalConstant::EVENT_ENTITY_AGREEMENT,
                        'entity_id' => $a->id,
                        'title' => GlobalConstant::NOTIFICATION_TITLE_AGREEMENT_SIGNED,
                        'description' => GlobalConstant::NOTIFICATION_DESC_AGREEMENT_SIGNED,
                        'icon_letter' => GlobalConstant::NOTIFICATION_ICON_AGREEMENT,
                        'route_name' => 'agreements.show',
                        'route_param' => $a->id,
                        'created_at' => $a->signed_date,
                    ]);
                }
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | REVENUE
    |--------------------------------------------------------------------------
    */

    private function revenueNotifications(): void
    {
        RevenueGoal::chunk(100, function ($rows) {
            foreach ($rows as $goal) {

                // Dummy logic (you will improve later)
                if ($goal->yearly_goal < 1000) {
                    $this->createNotification([
                        'type' => GlobalConstant::NOTIFICATION_TYPE_REVENUE_GOAL_FAILED,
                        'entity_type' => 'revenue_goal',
                        'entity_id' => $goal->id,
                        'title' => GlobalConstant::NOTIFICATION_TITLE_REVENUE_GOAL_FAILED,
                        'description' => GlobalConstant::NOTIFICATION_DESC_REVENUE_GOAL_FAILED,
                        'icon_letter' => GlobalConstant::NOTIFICATION_ICON_REVENUE,
                        'route_name' => 'revenue.goals.index',
                        'route_param' => null,
                        'created_at' => now(),
                    ]);
                }
            }
        });
    }
}
