import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import NotesTimeline from '@/components/notes/NotesTimeline';
import AddNoteModal from '@/components/notes/AddNoteModal';

const breadcrumbs = [{ title: 'Candidates', href: '/candidates' }, { title: 'View Candidate' }];

export default function Show({ candidate }: any) {
    const formatUSD = (amount: number) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Candidate Details" />

            <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-2">
                {/* ================= CANDIDATE INFO ================= */}
                <Card className="rounded-xl">
                    <CardHeader>
                        <CardTitle>Candidate Information</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-semibold">Full Name</p>
                            <p className="text-sm text-gray-600">
                                {candidate?.first_name} {candidate?.last_name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Email</p>
                            <p className="text-sm text-gray-600">{candidate?.email}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Phone</p>
                            <p className="text-sm text-gray-600">{candidate?.phone}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Address</p>
                            <p className="text-sm text-gray-600">{candidate?.address}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Expected Salary</p>
                            <p className="text-sm text-gray-600">{formatUSD(candidate?.expected_salary)}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Created At</p>
                            <p className="text-sm text-gray-600">{candidate?.created_at ? new Date(candidate.created_at).toLocaleString() : '—'}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-xl p-2">
                    <CardHeader>
                        <CardTitle>Candidate Notes</CardTitle>
                    </CardHeader>

                    <div className="mb-3 flex justify-between">
                        <div className=""></div>
                        <AddNoteModal noteableType="candidate" noteableId={candidate.id} />
                    </div>

                    {/* NOTES */}

                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <NotesTimeline notes={candidate.notes} />
                        </CardContent>
                    </Card>
                </Card>

                {/* ================= RESUME INFO ================= */}
                {/* <Card className="rounded-xl">
                    <CardHeader>
                        <CardTitle>Resume</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {candidate?.resume ? (
                            <a href={candidate.resume} target="_blank" className="flex items-center gap-2 text-blue-600 hover:underline">
                                <FileText className="h-4 w-4" />
                                View Resume
                            </a>
                        ) : (
                            <p className="text-sm text-gray-500">No resume uploaded</p>
                        )}
                    </CardContent>
                </Card> */}
            </div>
        </AppLayout>
    );
}
