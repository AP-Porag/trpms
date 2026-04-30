import ContactComponent from '@/components/common/ContactComponent';
import NoteComponent from '@/components/common/NoteComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

const breadcrumbs = [{ title: 'Leads', href: '/leads' }, { title: 'View Leads' }];

export default function Show({ lead }: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lead Details" />

            <div className="grid grid-cols-2 gap-4 p-4 lg:grid-cols-2">
                {/* ================= CLIENT INFORMATION ================= */}
                <Card className="rounded-xl">
                    <CardHeader>
                        <CardTitle>Lead Information</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-semibold">Name</p>
                            <p className="text-sm text-gray-600">{lead?.name}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Company Name</p>
                            <p className="text-sm text-gray-600">{lead?.company_name}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Current Openings</p>
                            <p className="text-sm text-gray-600">{lead?.current_openings}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Source</p>
                            <p className="text-sm text-gray-600">{lead?.source?.name}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Industry</p>
                            <p className="text-sm text-gray-600">{lead?.industry?.name}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Status</p>
                            <p className="text-sm text-gray-600">{lead?.status == 1 ? 'Active' : 'Inactive'}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Created At</p>
                            <p className="text-sm text-gray-600">{new Date(lead?.created_at).toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* ================= NOTES ================= */}

                <NoteComponent noteableType="lead" noteableId={lead.id} notes={lead.notes} />

                {/* ================= Contact ================= */}

                <ContactComponent client={lead.id} contactableType="lead" contactableId={lead.id} contacts={lead.contacts} />
            </div>
        </AppLayout>
    );
}
