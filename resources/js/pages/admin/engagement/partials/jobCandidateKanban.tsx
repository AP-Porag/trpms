import { router } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import PlacementConfirmationModal from '@/components/placement/PlacementConfirmationModal';
import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Badge } from '@/components/ui/badge';
import { Card, CardHeader } from '@/components/ui/card';

import { formatDateUS } from '@/utils/helpers.js';
import { JOB_CANDIDATE_STAGES, JOB_CANDIDATE_STAGE_ORDER } from '@/utils/jobCandidateStages';

/* ========================================================= */
/* ROOT                                                      */
/* ========================================================= */

export default function JobCandidateKanban({ pipeline }) {
    const [localPipeline, setLocalPipeline] = useState(pipeline);
    const [activeCard, setActiveCard] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [placementCandidate, setPlacementCandidate] = useState(null);

    useEffect(() => {
        setLocalPipeline(pipeline);
    }, [pipeline]);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

    function handleDragStart(event) {
        setIsDragging(true);
        setActiveCard(event.active.data.current);
    }

    function openPlacementModal(jc) {
        setPlacementCandidate(jc);
    }

    function closePlacementModal() {
        setPlacementCandidate(null);
    }

    // function handleDragEnd(event) {
    //     setIsDragging(false);
    //     setActiveCard(null);
    //
    //     const { active, over } = event;
    //     if (!over) return;
    //
    //     const jc = active.data.current;
    //     const fromStage = jc.stage;
    //     const toStage = over.id;
    //
    //     if (fromStage === toStage) return;
    //
    //     const fromIndex = JOB_CANDIDATE_STAGE_ORDER.indexOf(fromStage);
    //     const toIndex = JOB_CANDIDATE_STAGE_ORDER.indexOf(toStage);
    //
    //     if (toIndex < fromIndex) {
    //         toast.info('Backward stage movement is not allowed.');
    //         return;
    //     }
    //
    //     if (toStage === 'interviewing') {
    //         toast.info('Use the menu to schedule interview.');
    //         return;
    //     }
    //
    //     // Optimistic UI
    //     setLocalPipeline((prev) => {
    //         const updated = structuredClone(prev);
    //         updated[fromStage] = updated[fromStage].filter((c) => c.id !== jc.id);
    //         updated[toStage].unshift({ ...jc, stage: toStage });
    //         return updated;
    //     });
    //
    //     if (toStage === 'placed') {
    //         toast.info('Use the menu to confirm placement.');
    //         return;
    //     }
    //
    //     changeStage(jc.id, toStage);
    // }

    function handleDragEnd(event) {
        setIsDragging(false);
        setActiveCard(null);

        const { active, over } = event;
        if (!over) return;

        const jc = active.data.current;
        const fromStage = jc.stage;
        const toStage = over.id;

        if (fromStage === toStage) return;

        const fromIndex = JOB_CANDIDATE_STAGE_ORDER.indexOf(fromStage);
        const toIndex = JOB_CANDIDATE_STAGE_ORDER.indexOf(toStage);

        if (toIndex < fromIndex) {
            toast.info('Backward stage movement is not allowed.');
            return;
        }

        if (toStage === 'interviewing') {
            toast.info('Use the menu to schedule interview.');
            return;
        }

        if (toStage === 'placed') {
            toast.info('Use the menu to confirm placement.');
            return;
        }

        // Optimistic UI (only for normal stages)
        setLocalPipeline((prev) => {
            const updated = structuredClone(prev);
            updated[fromStage] = updated[fromStage].filter((c) => c.id !== jc.id);
            updated[toStage].unshift({ ...jc, stage: toStage });
            return updated;
        });

        changeStage(jc.id, toStage);
    }

    return (
        <>
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
                    {JOB_CANDIDATE_STAGE_ORDER.map((stageKey) => (
                        <KanbanColumn
                            key={stageKey}
                            stageKey={stageKey}
                            stage={JOB_CANDIDATE_STAGES[stageKey]}
                            items={localPipeline?.[stageKey] ?? []}
                            isDragging={isDragging}
                            openPlacementModal={openPlacementModal}
                        />
                    ))}
                </div>

                {/*if want to change candidate card ui during drag & drop*/}
                {/*<DragOverlay>*/}
                {/*    {activeCard && (*/}
                {/*        <Card className="w-64 shadow-lg">*/}
                {/*            <CardHeader className="p-3">*/}
                {/*                <CardTitle className="text-sm">*/}
                {/*                    {activeCard.candidate.first_name} {activeCard.candidate.last_name}*/}
                {/*                </CardTitle>*/}
                {/*            </CardHeader>*/}
                {/*        </Card>*/}
                {/*    )}*/}
                {/*</DragOverlay>*/}
            </DndContext>
            <PlacementConfirmationModal open={!!placementCandidate} jc={placementCandidate} onClose={closePlacementModal} />
        </>
    );
}

/* ========================================================= */
/* COLUMN                                                    */
/* ========================================================= */

function KanbanColumn({ stageKey, stage, items, isDragging, openPlacementModal }) {
    const { setNodeRef, isOver } = useDroppable({ id: stageKey });

    return (
        <div className="flex flex-col gap-3">
            {/* Column Header */}
            <div className={`flex items-center justify-between rounded-lg px-4 py-3 text-white ${stage.headerBg ?? 'bg-slate-800'}`}>
                <span className="text-sm font-semibold text-slate-800">{stage.label}</span>

                <Badge className="bg-white/20 text-slate-800">{items.length}</Badge>
            </div>

            {/* Column Body (UNCHANGED background) */}
            <div ref={setNodeRef} className={`rounded-lg border ${stage.color} ${isOver ? 'ring-primary ring-2' : ''}`}>
                {/*<div className={`max-h-[60vh] space-y-3 p-3 ${isDragging ? '' : 'overflow-y-auto'}`}>*/}
                {/*    {items.map((jc) => (*/}
                {/*        <CandidateCard key={jc.id} jc={jc} />*/}
                {/*    ))}*/}
                {/*</div>*/}

                <div className="space-y-3 p-3">
                    {items.map((jc) => (
                        <CandidateCard key={jc.id} jc={jc} openPlacementModal={openPlacementModal} />
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ========================================================= */
/* CARD                                                      */
/* ========================================================= */
function Avatar({ candidate }) {
    if (candidate.avatar_url) {
        return <img src={candidate.avatar_url} alt={candidate.first_name} className="h-10 w-10 rounded-full object-cover" />;
    }

    const initials = `${candidate.first_name?.[0] ?? ''}${candidate.last_name?.[0] ?? ''}`;

    return <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-[13px] font-semibold">{initials}</div>;
}

function StageDateLabel({ jc }) {
    if (jc.stage === 'interviewing' && jc.interview_scheduled_at) {
        return <span className="text-muted-foreground">Interview: {formatDateUS(jc.interview_scheduled_at)}</span>;
    }

    const map = {
        submitted: jc.submitted_at,
        interviewing: jc.interviewing_at,
        offered: jc.offered_at,
        placed: jc.placed_at,
        rejected: jc.rejected_at,
    };

    const date = map[jc.stage];
    if (!date) return null;

    return <span className="text-muted-foreground">Updated: {formatDateUS(date)}</span>;
}

function CandidateCard({ jc, openPlacementModal }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: jc.id,
        data: jc,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        //if want to change candidate card ui during drag & drop
        // opacity: isDragging ? 0 : 1,
        // pointerEvents: isDragging ? 'none' : 'auto',
    };

    const candidate = jc.candidate;

    return (
        <Card ref={setNodeRef} style={style} {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
            <CardHeader className="space-y-3 p-2">
                {/* Top Row */}
                <div className="flex items-start gap-2">
                    {/* Avatar */}
                    <div>
                    <Avatar candidate={candidate} />
                    </div>
                    {/* Name + Role */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[13px] font-semibold">
                                    {candidate.first_name} {candidate.last_name}
                                </p>
                                <p className="text-muted-foreground text-xs">{candidate.current_position ?? '—'}</p>
                            </div>

                            {/* Dropdown */}
                            <div onClick={(e) => e.stopPropagation()} className="text-muted-foreground hover:text-foreground">
                                <StageActionMenu jc={jc} openPlacementModal={openPlacementModal} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="text-muted-foreground gap-4 text-xs">
                    {candidate.email && (
                        <a href={`mailto:${candidate.email}`} className="hover:text-foreground gap-1] flex items-center">
                            ✉️ {candidate.email}
                        </a>
                    )}
                    {candidate.phone && (
                        <a href={`tel:${candidate.phone}`} className="hover:text-foreground flex items-center gap-1">
                            📞 {candidate.phone}
                        </a>
                    )}
                </div>

                {/* Footer */}
                <div className="items-center text-xs">
                    <StageDateLabel jc={jc} />
                    <div className="text-center">
                        <Badge className="text-xs translate-y-3">{JOB_CANDIDATE_STAGES[jc.stage].label}</Badge>
                    </div>

                </div>
            </CardHeader>
        </Card>
    );
}

/* ========================================================= */
/* ACTION MENU                                               */
/* ========================================================= */

function PlacementMenuAction({ jc, closeMenu, openPlacementModal }) {
    return (
        <DropdownMenuItem
            onSelect={(e) => {
                e.preventDefault();
                e.stopPropagation();

                closeMenu(); // close dropdown
                openPlacementModal(jc); // open modal
            }}
        >
            Move to Placed
        </DropdownMenuItem>
    );
}

function StageActionMenu({ jc, openPlacementModal }) {
    const [open, setOpen] = useState(false);

    // const availableStages = useMemo(() => Object.keys(JOB_CANDIDATE_STAGES).filter((s) => s !== jc.stage), [jc.stage]);
    const availableStages = useMemo(() => {
        const currentIndex = JOB_CANDIDATE_STAGE_ORDER.indexOf(jc.stage);

        // If placed → no forward movement
        if (['placed', 'rejected'].includes(jc.stage)) {
            return [];
        }

        // Only allow forward stages
        return JOB_CANDIDATE_STAGE_ORDER.slice(currentIndex + 1);
    }, [jc.stage]);
    return (
        <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen(true);
                    }}
                    className="hover:bg-muted text-foreground cursor-pointer rounded-md p-1"
                >
                    <ChevronDown className="h-4 w-4" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {availableStages.map((stage) => {
                    if (stage === 'interviewing') {
                        return <InterviewScheduleDialog key={stage} jc={jc} closeMenu={() => setOpen(false)} />;
                    }

                    if (stage === 'placed') {
                        return <PlacementMenuAction key={stage} jc={jc} closeMenu={() => setOpen(false)} openPlacementModal={openPlacementModal} />;
                    }

                    return <ConfirmStageChange key={stage} jc={jc} stage={stage} closeMenu={() => setOpen(false)} />;
                })}

                {/*<DropdownMenuSeparator />*/}

                {/*<RemoveCandidateAction jc={jc} closeMenu={() => setOpen(false)} />*/}

                {jc.stage === 'placed' && (
                    <>
                        <DropdownMenuSeparator />
                        <RemoveCandidateAction jc={jc} closeMenu={() => setOpen(false)} />
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

/* ========================================================= */
/* CONFIRM STAGE CHANGE                                      */
/* ========================================================= */

function ConfirmStageChange({ jc, stage, closeMenu }) {
    const label = JOB_CANDIDATE_STAGES[stage].label;

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    Move to {label}
                </DropdownMenuItem>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Stage Change</AlertDialogTitle>
                    <AlertDialogDescription>Move candidate to {label}?</AlertDialogDescription>
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

/* ========================================================= */
/* INTERVIEW DIALOG                                          */
/* ========================================================= */

function InterviewScheduleDialog({ jc, closeMenu }) {
    const [openInterviewScheduleDialog, setOpenInterviewScheduleDialog] = useState(false);
    const [dateTime, setDateTime] = useState('');

    return (
        <AlertDialog open={openInterviewScheduleDialog} onOpenChange={setOpenInterviewScheduleDialog}>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenInterviewScheduleDialog(true);
                    }}
                >
                    Move to Interviewing
                </DropdownMenuItem>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Schedule Interview</AlertDialogTitle>
                </AlertDialogHeader>

                <input
                    type="datetime-local"
                    className="w-full rounded border px-3 py-2"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                />

                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => {
                            setOpenInterviewScheduleDialog(false);
                            closeMenu();
                        }}
                    >
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={!dateTime}
                        onClick={() => {
                            changeStage(jc.id, 'interviewing', {
                                interview_scheduled_at: dateTime,
                            });
                            setOpenInterviewScheduleDialog(false);
                            closeMenu();
                        }}
                    >
                        Confirm
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

/* ========================================================= */
/* REMOVE CANDIDATE                                          */
/* ========================================================= */

function RemoveCandidateAction({ jc, closeMenu }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem
                    className="text-destructive"
                    onSelect={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    Remove from job
                </DropdownMenuItem>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove Candidate</AlertDialogTitle>
                    <AlertDialogDescription>This will remove the candidate from this job.</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={closeMenu}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            router.delete(route('job-candidates.destroy', jc.id), {
                                preserveScroll: true,
                                onSuccess: () => {
                                    toast.success('Candidate removed from job.');
                                    closeMenu();
                                    router.reload({
                                        only: ['pipeline'],
                                    });
                                },
                            });
                        }}
                    >
                        Remove
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

/* ========================================================= */
/* STAGE API                                                 */
/* ========================================================= */

function changeStage(id, stage, extra = {}) {
    router.post(
        route('job-candidates.change-stage', id),
        { stage, ...extra },
        {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Moved to ${JOB_CANDIDATE_STAGES[stage].label}`);
                router.reload({ only: ['pipeline'] });
            },
            onError: () => {
                toast.info('Stage change not allowed.');
                router.reload({ only: ['pipeline'] });
            },
        },
    );
}
