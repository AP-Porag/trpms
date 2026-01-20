import {
    ArrowRight,
    UserPlus,
    Calendar,
    CheckCircle,
    XCircle,
    Trash,
    FileText,
    DollarSign,
} from 'lucide-react';

export const ACTIVITY_EVENT_CONFIG = {
    candidate_added_to_job: {
        label: 'Candidate added',
        color: 'bg-blue-100 text-blue-700',
        icon: UserPlus,
    },
    stage_changed: {
        label: 'Stage changed',
        color: 'bg-purple-100 text-purple-700',
        icon: ArrowRight,
    },
    interview_scheduled: {
        label: 'Interview scheduled',
        color: 'bg-amber-100 text-amber-700',
        icon: Calendar,
    },
    candidate_placed: {
        label: 'Candidate placed',
        color: 'bg-green-100 text-green-700',
        icon: CheckCircle,
    },
    candidate_rejected: {
        label: 'Candidate rejected',
        color: 'bg-red-100 text-red-700',
        icon: XCircle,
    },
    candidate_removed: {
        label: 'Candidate removed',
        color: 'bg-slate-100 text-slate-700',
        icon: Trash,
    },

    // Future
    invoice_created: {
        label: 'Invoice created',
        color: 'bg-indigo-100 text-indigo-700',
        icon: FileText,
    },
    invoice_paid: {
        label: 'Invoice paid',
        color: 'bg-emerald-100 text-emerald-700',
        icon: DollarSign,
    },
};
