import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

import AddNoteModal from '@/components/notes/AddNoteModal';
import NotesTimeline from '@/components/notes/NotesTimeline';

export default function View({ placement }) {
    return (
        <AppLayout>
            <Head title="Placement Details" />

            <div className="flex flex-1 flex-col gap-6 rounded-xl p-4">
                {/* HEADER */}

                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Placement Details</h2>

                    <AddNoteModal noteableType="placement" noteableId={placement.id} />
                </div>

                {/* DETAILS */}

                <Card>
                    <CardHeader>
                        <CardTitle>Placement Information</CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-2 gap-6">
                        <Info label="Candidate">
                            {placement.candidate.first_name} {placement.candidate.last_name}
                        </Info>

                        <Info label="Client">{placement.client.name}</Info>

                        <Info label="Job">{placement.job.title}</Info>

                        <Info label="Salary">${placement.salary}</Info>

                        <Info label="Fee %">{placement.fee_percentage}%</Info>

                        <Info label="Placement Fee">${placement.placement_fee}</Info>

                        <Info label="Offer Date">{placement.offer_accepted_at}</Info>

                        <Info label="Start Date">{placement.start_date}</Info>

                        <Info label="Guarantee End">{placement.guarantee_end_date}</Info>

                        <Info label="Recruiter">{placement.recruiter?.name}</Info>
                    </CardContent>
                </Card>

                {/* NOTES */}

                <Card>
                    <CardHeader>
                        <CardTitle>Notes</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <NotesTimeline notes={placement.notes} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function Info({ label, children }) {
    return (
        <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-muted-foreground text-sm">{children || '—'}</p>
        </div>
    );
}
