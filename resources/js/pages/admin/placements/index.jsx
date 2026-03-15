import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import PlacementsTable from './partials/placementsTable';
import PlacementSummary from "./partials/placementSummary";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs = [
    { title: 'Placements', href: '/placements' },
];

export default function Index({ placements, meta, filters: initialFilters }) {

    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        perPage: initialFilters.perPage || 5,
        page: meta.current_page || 1,
    });

    const { url } = usePage();
    const { summary } = usePage().props;
    const params = new URLSearchParams(url.split('?')[1]);
    const initialTab = params.get('tab') || 'all';

    const [tab, setTab] = useState(initialTab);

    useEffect(() => {
        router.get(
            route('placements.index'),
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
            <Head title="Placements" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="space-y-6 rounded-xl border p-5">
                    {/* Header */}
                    <div>
                        <h2 className="text-xl font-semibold">Placements</h2>
                        <p className="text-muted-foreground text-sm">Track successful candidate placements and performance.</p>
                    </div>

                    {/* Tabs */}
                    <Tabs
                        value={tab}
                        onValueChange={(value) => {
                            setTab(value);

                            router.get(
                                route('placements.index'),
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
                            <TabsTrigger value="all" className="cursor-pointer">
                                All Placements
                            </TabsTrigger>

                            <TabsTrigger value="summary" className="cursor-pointer">
                                Placement Summary
                            </TabsTrigger>
                        </TabsList>

                        {/* ================= ALL PLACEMENTS ================= */}
                        <TabsContent value="all">
                            <PlacementsTable placements={placements} meta={meta} filters={filters} />
                        </TabsContent>

                        {/* ================= SUMMARY ================= */}
                        <TabsContent value="summary">
                            <PlacementSummary summary={summary} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
