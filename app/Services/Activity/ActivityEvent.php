<?php

namespace App\Services\Activity;

final class ActivityEvent
{
    // JobCandidate lifecycle
    public const CANDIDATE_CREATED   = 'candidate_created';
    public const CANDIDATE_UPDATED   = 'candidate_updated';
    public const CANDIDATE_ADDED_TO_JOB   = 'candidate_added_to_job';
    public const STAGE_CHANGED            = 'stage_changed';
    public const INTERVIEW_SCHEDULED      = 'interview_scheduled';
    public const CANDIDATE_REMOVED        = 'candidate_removed';
    public const CANDIDATE_PLACED         = 'candidate_placed';
    public const CANDIDATE_REJECTED       = 'candidate_rejected';

    // Job lifecycle (future)
    public const JOB_CREATED              = 'job_created';
    public const JOB_UPDATED              = 'job_updated';

    // Invoice lifecycle (future)
    public const INVOICE_CREATED          = 'invoice_created';
    public const INVOICE_SENT_TO_CLIENT          = 'invoice_sent_to_client';
    public const INVOICE_PAID             = 'invoice_paid';

    // Revenue lifecycle (future)
    public const COMMISSION_CALCULATED = 'commission_calculated';
    public const COMMISSION_APPROVED   = 'commission_approved';
    public const COMMISSION_PAID       = 'commission_paid';
    public const REVENUE_ADJUSTED      = 'revenue_adjusted';
    public const COMMISSION_GENERATED     = 'commission_generated';
}

