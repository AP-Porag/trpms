import PdfViewer from '@/components/common/PdfViewer';
import AddNoteModal from '@/components/notes/AddNoteModal';
import NotesTimeline from '@/components/notes/NotesTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs = [{ title: 'Clients', href: '/clients' }, { title: 'View Client' }];

export default function Show({ client }: any) {
    const [openAgreement, setOpenAgreement] = useState(false);

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

                        {/* ================= AGREEMENT BUTTON (ONLY ADDITION) ================= */}
                        <div className="pt-2">
                            <button onClick={() => setOpenAgreement(true)} className="text-sm font-semibold text-blue-600 underline">
                                View Agreement
                            </button>
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

            {/* ================= PDF MODAL ================= */}
            {openAgreement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="relative h-[90vh] w-[90vw] rounded-lg bg-white p-2">
                        {/* Close Button */}
                        <button onClick={() => setOpenAgreement(false)} className="absolute top-2 right-3 rounded bg-gray-200 px-3 py-1 text-sm">
                            Close
                        </button>

                        {/* PDF Viewer */}
                        <PdfViewer src={client?.agreement_url} />
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

// import AddNoteModal from '@/components/notes/AddNoteModal';
// import NotesTimeline from '@/components/notes/NotesTimeline';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import AppLayout from '@/layouts/app-layout';
// import { Head } from '@inertiajs/react';
// import { useState } from 'react';
// const breadcrumbs = [{ title: 'Clients', href: '/clients' }, { title: 'View Client' }];

// interface Props {
//     agreementUrl: string;
// }

// export default function Show({ client }: any) {
//     const [openAgreement, setOpenAgreement] = useState(false);
//     return (
//         <AppLayout breadcrumbs={breadcrumbs}>
//             <Head title="Client Details" />

//             <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-2">
//                 {/* ================= CLIENT INFORMATION ================= */}
//                 <Card className="rounded-xl">
//                     <CardHeader>
//                         <CardTitle>Client Information</CardTitle>
//                     </CardHeader>

//                     <CardContent className="space-y-4">
//                         <div>
//                             <p className="text-sm font-semibold">Client Name</p>
//                             <p className="text-sm text-gray-600">{client?.name}</p>
//                         </div>

//                         <div>
//                             <p className="text-sm font-semibold">Company</p>
//                             <p className="text-sm text-gray-600">{client?.company_name}</p>
//                         </div>

//                         <div>
//                             <p className="text-sm font-semibold">Email</p>
//                             <p className="text-sm text-gray-600">{client?.email}</p>
//                         </div>

//                         <div>
//                             <p className="text-sm font-semibold">Phone</p>
//                             <p className="text-sm text-gray-600">{client?.phone}</p>
//                         </div>

//                         <div>
//                             <p className="text-sm font-semibold">Address</p>
//                             <p className="text-sm text-gray-600">{client?.address}</p>
//                         </div>

//                         <div>
//                             <p className="text-sm font-semibold">Type</p>
//                             <p className="text-sm text-gray-600">{client?.client_type}</p>
//                         </div>

//                         <div>
//                             <p className="text-sm font-semibold">Fee Value</p>
//                             <p className="text-sm text-gray-600">${client?.fee_value ?? '—'}</p>
//                         </div>

//                         {/* <div>
//                             <p className="text-sm font-semibold">Departments</p>
//                             <p className="text-sm text-gray-600">{client?.departments}</p>
//                         </div> */}

//                         <div>
//                             <p className="text-sm font-semibold">Status</p>
//                             <p className="text-sm text-gray-600">{client?.status == 1 ? 'Active' : 'Inactive'}</p>
//                         </div>

//                         <div>
//                             <p className="text-sm font-semibold">Created At</p>
//                             <p className="text-sm text-gray-600">{new Date(client?.created_at).toLocaleString()}</p>
//                         </div>
//                     </CardContent>
//                 </Card>
//                 <Card className="rounded-xl p-2">
//                     <CardHeader>
//                         <CardTitle>Client Notes</CardTitle>
//                     </CardHeader>

//                     <div className="mb-3 flex justify-between">
//                         <div className=""></div>
//                         <AddNoteModal noteableType="client" noteableId={client.id} />
//                     </div>

//                     {/* NOTES */}

//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Notes</CardTitle>
//                         </CardHeader>

//                         <CardContent>
//                             <NotesTimeline notes={client.notes} />
//                         </CardContent>
//                     </Card>
//                 </Card>
//             </div>
//         </AppLayout>
//     );
// }
