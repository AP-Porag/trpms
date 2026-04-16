import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
const breadcrumbs = [{ title: 'Clients', href: '/clients' }, { title: 'View Client' }];

export default function Show({ client }: any) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Client Details" />

            <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2">
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
                            <p className="text-sm text-gray-600">{client?.fee_value ?? '—'}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Status</p>
                            <p className="text-sm text-gray-600">{client?.status == 1 ? 'Active' : 'Inactive'}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Created At</p>
                            <p className="text-sm text-gray-600">{new Date(client?.created_at).toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
