import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { STATUS, JOB_FEE_TYPE } from '@/utils/constants';
import { formatDateUS, DATE_PRESETS } from '@/utils/helpers';
import JobCandidateKanban from './partials/jobCandidateKanban';
import AddCandidateToJobModal from './partials/addCandidateToJobModal';
import ActivityTimeline from '@/components/activity/ActivityTimeline.jsx';

const breadcrumbs = [
    { title: 'Jobs', href: '/jobs' },
    { title: 'View Job' },
];

export default function View({ job,pipeline }) {
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1]);
    const initialTab = params.get('tab') || 'overview';

    const [tab, setTab] = useState(initialTab);

    useEffect(() => {
        router.get(
            route('jobs.show', job.id),
            { tab },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    }, [tab]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Job – ${job.title}`} />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="space-y-6 rounded-xl border p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">{job.title}</h2>
                            <p className="text-muted-foreground text-sm">Job ID #{job.id}</p>
                        </div>

                        <Badge variant={job.status == STATUS.ACTIVE ? 'default' : 'secondary'}>
                            {job.status == STATUS.ACTIVE ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>

                    {/* Tabs */}
                    <Tabs
                        value={tab}
                        onValueChange={(value) => {
                            setTab(value);

                            router.get(
                                route('jobs.show', job.id),
                                { tab: value },
                                {
                                    preserveState: true,
                                    replace: true,
                                    preserveScroll: true,
                                },
                            );
                        }}
                    >
                        <TabsList>
                            <TabsTrigger value="overview" className="cursor-pointer">
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="candidates" className="cursor-pointer">
                                Candidates
                            </TabsTrigger>
                            <TabsTrigger value="activity" className="cursor-pointer">
                                Activity
                            </TabsTrigger>
                        </TabsList>

                        {/* ================= OVERVIEW ================= */}
                        <TabsContent value="overview">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {/* Job Info */}
                                <Card className="md:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Job Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between">
                                            <InfoRow label="Title" value={job.title} />
                                            <InfoRow label="Job Created" value={formatDateUS(job.created_at, DATE_PRESETS.SHORT)} />
                                        </div>

                                        <InfoRow label="Fee Type" value={job.fee_type === JOB_FEE_TYPE.PERCENTAGE ? 'Percentage' : 'Fixed'} />

                                        <InfoRow label="Fee Value" value={job.fee_value} />

                                        <InfoRow label="Status" value={job.status == STATUS.ACTIVE ? 'Active' : 'Inactive'} />

                                        <div>
                                            <p className="text-sm font-medium">Description</p>
                                            <div
                                                className="prose prose-sm mt-2 max-w-none"
                                                dangerouslySetInnerHTML={{
                                                    __html: job.description,
                                                }}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Client Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Client Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <InfoRow label="Client Name" value={job.client?.name} />
                                        <InfoRow label="Company" value={job.client?.company_name} />
                                        <InfoRow label="Email" value={job.client?.email} />
                                        <InfoRow label="Phone" value={job.client?.phone} />
                                        <InfoRow label="Address" value={job.client?.address} />
                                        <InfoRow label="Type" value={job.client?.client_type} />
                                        <InfoRow label="Fee Percentage" value={job.client?.fee_percentage} />
                                        <InfoRow label="Status" value={job.client?.status == STATUS.ACTIVE ? 'Active' : 'Inactive'} />
                                        <InfoRow label="Client Created" value={formatDateUS(job.client?.created_at, DATE_PRESETS.SHORT)} />
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* ================= CANDIDATES ================= */}
                        <TabsContent value="candidates">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Candidates</h3>

                                <AddCandidateToJobModal jobId={job.id} />
                            </div>
                            {pipeline ? (
                                <JobCandidateKanban pipeline={pipeline} />
                            ) : (
                                <p className="text-muted-foreground text-sm">Loading candidates…</p>
                            )}
                        </TabsContent>

                        {/* ================= ACTIVITY ================= */}
                        <TabsContent value="activity">
                            {/*<Card>*/}
                            {/*    <CardHeader>*/}
                            {/*        <CardTitle>Job Activity & History</CardTitle>*/}
                            {/*    </CardHeader>*/}
                            {/*    <CardContent>*/}
                            {/*        <p className="text-muted-foreground text-sm">*/}
                            {/*            Activity log and tabular reporting (DataTable view) will be available here.*/}
                            {/*        </p>*/}
                            {/*    </CardContent>*/}
                            {/*</Card>*/}
                            <ActivityTimeline subjectType="App\Models\JobCandidate" subjectId={job.id} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}

/* ---------------------------------- */
/* Small reusable UI helper           */
/* ---------------------------------- */
function InfoRow({ label, value }) {
    return (
        <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-sm text-muted-foreground">
                {value || '—'}
            </p>
        </div>
    );
}
