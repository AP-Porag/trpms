import AddNoteModal from '@/components/notes/AddNoteModal';
import NotesTimeline from '@/components/notes/NotesTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs = [{ title: 'Clients', href: '/clients' }, { title: 'View Client' }];

export default function Show({ client }: any) {
    const [openAgreement, setOpenAgreement] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const openPdf = (index: number) => {
        setSelectedIndex(index);
        setOpenAgreement(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Client Details" />

            <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-2">
                {/* ================= CLIENT INFORMATION ================= */}
                <Card className="rounded-xl">
                    <CardHeader>
                        <CardTitle>Client Information</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-semibold">Client Name</p>
                            <p className="text-sm text-gray-600">{client?.name}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Company</p>
                            <p className="text-sm text-gray-600">{client?.company_name}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Email</p>
                            <p className="text-sm text-gray-600">{client?.email}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Phone</p>
                            <p className="text-sm text-gray-600">{client?.phone}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Address</p>
                            <p className="text-sm text-gray-600">{client?.address}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Type</p>
                            <p className="text-sm text-gray-600">{client?.client_type}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Fee Value</p>
                            <p className="text-sm text-gray-600">${client?.fee_value ?? '—'}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Status</p>
                            <p className="text-sm text-gray-600">{client?.status == 1 ? 'Active' : 'Inactive'}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Created At</p>
                            <p className="text-sm text-gray-600">{new Date(client?.created_at).toLocaleString()}</p>
                        </div>

                        {/* ================= AGREEMENTS LIST ================= */}
                        <div className="pt-2">
                            {client?.agreements?.length > 0 ? (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold">Agreements</p>

                                    {client.agreements.map((agreement) => (
                                        <button
                                            key={agreement.id}
                                            onClick={() => {
                                                setSelectedIndex(client.agreements.findIndex((r) => r.id === agreement.id));
                                                setOpenAgreement(true);
                                            }}
                                            className="flex items-center gap-2"
                                        >
                                            <FileText className="bg h-4 w-4" />
                                            {agreement.original_name ?? 'View Agreement'}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No resume uploaded</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* ================= NOTES ================= */}
                <Card className="rounded-xl p-2">
                    <CardHeader>
                        <CardTitle>Client Notes</CardTitle>
                    </CardHeader>

                    <div className="mb-3 flex justify-between">
                        <div></div>
                        <AddNoteModal noteableType="client" noteableId={client.id} />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <NotesTimeline notes={client.notes} />
                        </CardContent>
                    </Card>
                </Card>
            </div>

            {/* ================= PDF MODAL (MULTIPLE SUPPORT) ================= */}
            {openAgreement && client?.agreements?.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="relative h-[90vh] w-[90vw] rounded-lg bg-white p-2">
                        {/* CLOSE */}
                        <button onClick={() => setOpenAgreement(false)} className="absolute top-2 right-3 rounded bg-gray-200 px-3 py-1 text-sm">
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
                                disabled={selectedIndex === client.agreements.length - 1}
                                onClick={() => setSelectedIndex((prev) => prev + 1)}
                                className="rounded bg-gray-200 px-2 py-1 text-sm disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>

                        {/* FILE NAME */}
                        <div className="text-center text-sm font-semibold">{client.agreements[selectedIndex]?.original_name}</div>

                        {/* PDF VIEW */}
                        <iframe src={`/storage/${client.agreements[selectedIndex]?.file_path}`} className="h-full w-full rounded" />
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
