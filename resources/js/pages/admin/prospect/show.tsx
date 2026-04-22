import AddNoteModal from '@/components/notes/AddNoteModal';
import NotesTimeline from '@/components/notes/NotesTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [{ title: 'Prospects', href: '/prospects' }, { title: 'View Prospect' }];

export default function Show({ prospect }: any) {
    console.log(prospect);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Prospect Details" />

            <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-2">
                {/* ================= CLIENT INFORMATION ================= */}
                <Card className="rounded-xl">
                    <CardHeader>
                        <CardTitle>Prospect Information</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-semibold">Prospect Name</p>
                            <p className="text-sm text-gray-600">{prospect?.name}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Company</p>
                            <p className="text-sm text-gray-600">{prospect?.company_name}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Email</p>
                            <p className="text-sm text-gray-600">{prospect?.email}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Phone</p>
                            <p className="text-sm text-gray-600">{prospect?.phone}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Address</p>
                            <p className="text-sm text-gray-600">{prospect?.address}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Status</p>
                            <p className="text-sm text-gray-600">{prospect?.status == 1 ? 'Active' : 'Inactive'}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Created At</p>
                            <p className="text-sm text-gray-600">{new Date(prospect?.created_at).toLocaleString()}</p>
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
                        <AddNoteModal noteableType="client" noteableId={prospect.id} />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <NotesTimeline notes={prospect.notes} />
                        </CardContent>
                    </Card>
                </Card>
            </div>
        </AppLayout>
    );
}
