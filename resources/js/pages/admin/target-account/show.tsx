
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import NoteComponent from '@/components/common/NoteComponent';
import { DATE_PRESETS, formatDateUS } from '@/utils/helpers';

const breadcrumbs = [{ title: 'Target', href: '/targets' }, { title: 'View Target' }];

export default function Show({ targetAccount }: any) {
    console.log(targetAccount);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Prospect Details" />

            <div className="grid grid-cols-1 gap-10 lg:gap-4 p-4 lg:grid-cols-2">
                {/* ================= CLIENT INFORMATION ================= */}
                <Card className="rounded-xl">
                    <CardHeader>
                        <CardTitle>Target Information</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-semibold">Name</p>
                            <p className="text-sm text-gray-600">{targetAccount?.name}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Company</p>
                            <p className="text-sm text-gray-600">{targetAccount?.company_name}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Email</p>
                            <p className="text-sm text-gray-600">{targetAccount?.email}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Phone</p>
                            <p className="text-sm text-gray-600">{targetAccount?.phone}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Address</p>
                            <p className="text-sm text-gray-600">{targetAccount?.address}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Status</p>
                            <p className="text-sm text-gray-600">{targetAccount?.status == 1 ? 'Active' : 'Inactive'}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Created At</p>
                            <p className="text-sm text-gray-600">{formatDateUS(targetAccount.created_at, DATE_PRESETS.SHORT)}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* ================= NOTES ================= */}
                
            <NoteComponent noteableType="client" noteableId={targetAccount.id} notes={targetAccount.notes}/>

            </div>
        </AppLayout>
    );
}
