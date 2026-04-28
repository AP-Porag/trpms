import ContactComponent from '@/components/common/ContactComponent';
import NoteComponent from '@/components/common/NoteComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { DATE_PRESETS, formatDateUS } from '@/utils/helpers';
import { Head } from '@inertiajs/react';

const breadcrumbs = [{ title: 'Target', href: '/targets' }, { title: 'View Target' }];
const formatUSD = (amount: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);

export default function Show({ targetAccount }: any) {
    console.log(targetAccount);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Prospect Details" />

            <div className="grid grid-cols-1 gap-10 p-4 lg:grid-cols-2 lg:gap-4">
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
                            <p className="text-sm font-semibold">Potential Revenew</p>
                            <p className="text-sm text-gray-600">{formatUSD(targetAccount?.revenue_potential ?? '—')}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Rating</p>
                            <p className="text-sm text-gray-600">{targetAccount?.rating?.toUpperCase() ?? '—'}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Use Agencies</p>
                            <p className="text-sm text-gray-600">{targetAccount?.is_use_agency == 1 ? 'Yes' : 'No'}</p>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Status</p>
                            <p className="text-sm text-gray-600">{targetAccount?.status == 1 ? 'Active' : 'Inactive'}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Departments</p>
                            <div className="mt-1 flex flex-wrap gap-2">
                                {targetAccount?.departments?.map((dept) => (
                                    <span key={dept.id} className="inline-flex items-center rounded-sm bg-gray-200 px-2 py-1 text-xs font-medium">
                                        {dept.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-semibold">Created At</p>
                            <p className="text-sm text-gray-600">{formatDateUS(targetAccount.created_at, DATE_PRESETS.SHORT)}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* ================= NOTES ================= */}

                <NoteComponent noteableType="client" noteableId={targetAccount.id} notes={targetAccount.notes} />

                {/* ================= Contact ================= */}

                <ContactComponent contactableType="client" contactableId={targetAccount.id} contacts={targetAccount.contacts} />
            </div>
        </AppLayout>
    );
}
