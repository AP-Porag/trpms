import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';

import Overview from './partials/overview';
import GoalVsTarget from './partials/goalVsTarget';
import SearchableClientSelect from '@/components/common/SearchableClientSelect';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const breadcrumbs = [
    { title: 'Revenue Reports', href: '/revenue-reports' },
];

export default function Index({ filters: initialFilters }) {

    const { url } = usePage();
    const { overview, goal, filters } = usePage().props;
    const { clients } = usePage().props;

    // ================= FILTER STATE =================
    const [localFilters, setLocalFilters] = useState({
        year: initialFilters.year || new Date().getFullYear(),
        client_id: initialFilters.client_id || '',
    });

    // ================= TAB STATE =================
    const params = new URLSearchParams(url.split('?')[1]);
    const initialTab = params.get('tab') || 'goal'; // default = Goal vs Target

    const [tab, setTab] = useState(initialTab);

    // ================= HANDLE TAB CHANGE =================
    useEffect(() => {
        router.get(
            route('revenue-reports.index'),
            {
                ...localFilters,
                tab,
            },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    }, [tab]);

    // ================= HANDLE FILTER CHANGE =================
    const applyFilters = (newFilters) => {
        setLocalFilters(newFilters);

        router.get(
            route('revenue-reports.index'),
            {
                ...newFilters,
                tab,
            },
            {
                preserveState: true,
                replace: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Revenue Reports" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="space-y-6 rounded-xl border p-5">
                    {/* ================= HEADER ================= */}
                    <div>
                        <h2 className="text-xl font-semibold">Revenue Reports</h2>
                        <p className="text-muted-foreground text-sm">Track revenue performance and compare against your yearly goals.</p>
                    </div>

                    {/* ================= FILTERS ================= */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* YEAR INPUT */}
                        <input
                            type="number"
                            value={localFilters.year}
                            onChange={(e) =>
                                applyFilters({
                                    ...localFilters,
                                    year: e.target.value,
                                })
                            }
                            className="w-32 rounded border px-3 py-2 text-sm"
                            placeholder="Year"
                        />

                        {/* SEARCHABLE CLIENT */}
                        <SearchableClientSelect
                            clients={clients}
                            value={localFilters.client_id?.toString() || ''}
                            onChange={(value) =>
                                applyFilters({
                                    ...localFilters,
                                    client_id: value,
                                })
                            }
                        />
                    </div>

                    {/* ================= TABS ================= */}
                    <Tabs
                        value={tab}
                        onValueChange={(value) => {
                            setTab(value);

                            router.get(
                                route('revenue-reports.index'),
                                {
                                    ...localFilters,
                                    tab: value,
                                },
                                {
                                    preserveState: true,
                                    replace: true,
                                    preserveScroll: true,
                                },
                            );
                        }}
                    >
                        <TabsList>
                            <TabsTrigger value="goal" className="cursor-pointer">
                                Goal vs Target
                            </TabsTrigger>

                            <TabsTrigger value="overview" className="cursor-pointer">
                                Overview
                            </TabsTrigger>
                        </TabsList>

                        {/* ================= GOAL VS TARGET ================= */}
                        <TabsContent value="goal">
                            <GoalVsTarget goal={goal} />
                        </TabsContent>

                        {/* ================= OVERVIEW ================= */}
                        <TabsContent value="overview">
                            <Overview overview={overview} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
