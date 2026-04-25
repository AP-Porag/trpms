import AddNoteModal from '@/components/notes/AddNoteModal';
import NotesTimeline from '@/components/notes/NotesTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { useState } from 'react';
import NoteComponent from '@/components/common/NoteComponent';

const breadcrumbs = [{ title: 'Candidates', href: '/candidates' }, { title: 'View Candidate' }];

export default function Show({ candidate }: any) {
    const [openResume, setOpenResume] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    console.log(candidate);
    const formatUSD = (amount: number) =>
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Candidate Details" />

            <div className="grid grid-cols-1 lg:gap-4 gap-10 p-4 lg:grid-cols-2">
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
                        {/* ================= RESUME INFO ================= */}
                        <div className="pt-2">
                            {candidate?.resumes?.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold">Resumes</p>

                                    {candidate.resumes.map((resume) => (
                                        <button
                                            key={resume.id}
                                            onClick={() => {
                                                setSelectedIndex(candidate.resumes.findIndex((r) => r.id === resume.id));
                                                setOpenResume(true);
                                            }}
                                            className="flex items-center gap-2"
                                        >
                                            <FileText className="bg h-4 w-4" />
                                            {resume.original_name ?? 'View Resume'}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No resume uploaded</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                    {/* NOTES */}

                <NoteComponent noteableType="candidate" noteableId={candidate.id} notes={candidate.notes}/>
                

                {/* ================= RESUME MODAL (MULTIPLE SUPPORT) ================= */}
                {openResume && candidate?.resumes?.length > 0 && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                        <div className="relative h-[90vh] w-[90vw] rounded-lg bg-white p-2">
                            {/* CLOSE */}
                            <button onClick={() => setOpenResume(false)} className="absolute top-2 right-3 rounded bg-gray-200 px-3 py-1 text-sm">
                                Close
                            </button>

                            {/* NAVIGATION */}
                            <div className="absolute top-2 left-3 flex gap-2">
                                <button
                                    disabled={selectedIndex === 0}
                                    onClick={() => setSelectedIndex((prev) => prev - 1)}
                                    className="rounded bg-gray-200 px-2 py-1 text-sm disabled:opacity-40"
                                >
                                    Prev
                                </button>

                                <button
                                    disabled={selectedIndex === candidate.resumes.length - 1}
                                    onClick={() => setSelectedIndex((prev) => prev + 1)}
                                    className="rounded bg-gray-200 px-2 py-1 text-sm disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>

                            {/* FILE NAME */}
                            <div className="text-center text-sm font-semibold">{candidate.resumes[selectedIndex]?.original_name}</div>

                            {/* PDF VIEW */}
                            <iframe src={`/storage/${candidate.resumes[selectedIndex]?.file_path}`} className="h-full w-full rounded" />
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
