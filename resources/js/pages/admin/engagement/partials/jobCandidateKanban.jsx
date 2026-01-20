import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MoreHorizontal, Mail, Phone, ChevronDown } from 'lucide-react';
import { router } from '@inertiajs/react';

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';


import {
    JOB_CANDIDATE_STAGES,
    JOB_CANDIDATE_STAGE_ORDER,
} from '@/utils/jobCandidateStages';

import { formatDateUS, DATE_PRESETS } from '@/utils/helpers';
import React, { useMemo, useState } from 'react';

export default function JobCandidateKanban({ pipeline }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            {JOB_CANDIDATE_STAGE_ORDER.map((stageKey) => {
                const stage = JOB_CANDIDATE_STAGES[stageKey];
                const items = pipeline?.[stageKey] ?? [];

                return (
                    <KanbanColumn
                        key={stageKey}
                        stage={stage}
                        items={items}
                    />
                );
            })}
        </div>

    );
}

/* ============================= */
/* Column                        */
/* ============================= */
function KanbanColumn({ stage, items }) {
    return (
        <div className={`rounded-lg border ${stage.color} flex flex-col`}>
            {/* Header */}
            <div className="flex items-center justify-between border-b p-3">
                <h3 className="text-sm font-semibold">{stage.label}</h3>
                <Badge className={stage.badge}>{items.length}</Badge>
            </div>

            {/* Scrollable cards */}
            <div className="max-h-[60vh] space-y-3 overflow-y-auto p-3">
                {items.length === 0 && <EmptyState />}
                {items.map((jc) => (
                    <CandidateCard key={jc.id} jc={jc} stage={stage} />
                ))}
            </div>
        </div>
    );
}



/* ============================= */
/* Candidate Card                */
/* ============================= */
function CandidateCard({ jc, stage }) {
    const { candidate } = jc;

    return (
        <Card className="border shadow-sm transition hover:shadow-md">
            <CardHeader className="flex flex-row justify-between p-3 pb-2">
                <div>
                    <CardTitle className="text-sm font-semibold">
                        {candidate.first_name} {candidate.last_name}
                    </CardTitle>
                    <p className="text-muted-foreground text-xs">{candidate.email}</p>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                    <StageActionMenu jc={jc} />
                </div>
            </CardHeader>

            <CardContent className="space-y-2 p-3 pt-0">
                <div className="text-muted-foreground flex justify-between gap-3 text-xs">
                    {candidate.email && (
                        <span className="flex items-center gap-1">
                            <a href={`mailto:${candidate.email}`}>
                                <Mail className="h-4 w-4 hover:text-green-800" />
                            </a>
                        </span>
                    )}
                    <span className={`rounded px-2 py-0.5 text-xs ${stage.badge}`}>{stage.label}</span>
                    {candidate.phone && (
                        <span className="flex items-center gap-1">
                            <a href={`tel:${candidate.phone}`}>
                                <Phone className="h-4 w-4 hover:text-green-800" />
                            </a>
                        </span>
                    )}
                </div>

                <StageDate jc={jc} />
            </CardContent>
        </Card>
    );
}


/* ============================= */
/* Stage Date Helper             */
/* ============================= */
function StageDate({ jc }) {
    const map = {
        submitted: jc.submitted_at,
        interviewing: jc.interviewing_at,
        offered: jc.offered_at,
        placed: jc.placed_at,
        rejected: jc.rejected_at,
    };

    const date = map[jc.stage];

    if (!date) return null;

    return (
        <span className="text-muted-foreground text-xs">
            {JOB_CANDIDATE_STAGES[jc.stage].label} on {formatDateUS(date, DATE_PRESETS.SHORT)}
        </span>
    );
}

/* ============================= */
/* Empty State                   */
/* ============================= */
function EmptyState() {
    return (
        <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
            No candidates
        </div>
    );
}
function changeStage(jobCandidateId, stage, extraPayload = {}) {
    router.post(
        route('job-candidates.change-stage', jobCandidateId),
        {
            stage,
            ...extraPayload,
        },
        {
            preserveScroll: true,
            onSuccess: () => {
                // ✅ Reload ONLY pipeline data
                router.reload({ only: ['pipeline'] });
            },
        },
    );
}
function StageActionMenu({ jc }) {
    const [open, setOpen] = useState(false);

    const availableStages = useMemo(
        () =>
            Object.keys(JOB_CANDIDATE_STAGES).filter(
                (stage) => stage !== jc.stage
            ),
        [jc.stage]
    );

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen(true);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <ChevronDown className="h-4 w-4" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                {availableStages.map((stage) => {
                    // 👇 SPECIAL CASE
                    if (stage === 'interviewing') {
                        return (
                            <InterviewScheduleDialog
                                key={stage}
                                jc={jc}
                                closeMenu={() => setOpen(false)}
                            />
                        );
                    }

                    // 👇 NORMAL CASE
                    return (
                        <ConfirmStageChange
                            key={stage}
                            jc={jc}
                            stage={stage}
                            closeMenu={() => setOpen(false)}
                        />
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}



function ConfirmStageChange({ jc, stage, closeMenu }) {
    const stageLabel = JOB_CANDIDATE_STAGES[stage].label;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    Move to {stageLabel}
                </DropdownMenuItem>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Stage Change</AlertDialogTitle>
                    <AlertDialogDescription>
                        Move candidate to <strong>{stageLabel}</strong>?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={closeMenu}>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                        onClick={() => {
                            closeMenu();
                            changeStage(jc.id, stage);
                        }}
                    >
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}



function InterviewScheduleDialog({ jc, closeMenu }) {
    const [open, setOpen] = useState(false);
    const [dateTime, setDateTime] = useState('');

    const submit = () => {
        changeStage(jc.id, 'interviewing', {
            interview_scheduled_at: dateTime,
        });

        setOpen(false);
        closeMenu();
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpen(true);
                    }}
                >
                    Move to Interviewing
                </DropdownMenuItem>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Schedule Interview</AlertDialogTitle>
                    <AlertDialogDescription>Select interview date and time.</AlertDialogDescription>
                </AlertDialogHeader>

                <div className="py-2">
                    <input
                        type="datetime-local"
                        className="w-full rounded border px-3 py-2"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                    />
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => {
                            setOpen(false);
                            closeMenu();
                        }}
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction onClick={submit} disabled={!dateTime}>
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}



