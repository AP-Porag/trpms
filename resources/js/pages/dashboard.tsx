// import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
// import { BarChart3, Info, LayoutDashboard, Table, Zap } from 'lucide-react';
import { LayoutDashboard, BarChart3, Table, Zap, Info } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            {/*<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">*/}
            {/*    <div className="grid auto-rows-min gap-4 md:grid-cols-3">*/}
            {/*        <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">*/}
            {/*            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />*/}
            {/*        </div>*/}
            {/*        <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">*/}
            {/*            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />*/}
            {/*        </div>*/}
            {/*        <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">*/}
            {/*            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">*/}
            {/*        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*bg-gray-50*/}
            <div className="bg-gray-50px-6 min-h-[75vh] bg-gray-50 py-10">
                <div className="mx-auto max-w-6xl">
                    {/* Header */}
                    <div className="mb-10">
                        <div className="mb-3 flex items-center gap-3">
                            <LayoutDashboard className="h-7 w-7 text-indigo-600" />
                            <h1 className="text-2xl font-semibold text-gray-900">Dashboard – Under Development</h1>
                        </div>

                        <p className="max-w-3xl text-gray-600">
                            The dashboard will act as a high‑level command center for the recruitment system.
                            <span className="text-red-500">
                                It is intentionally planned after completing all core modules so that every metric, chart, and insight is based on
                                real, stable data.
                            </span>
                        </p>
                    </div>

                    {/* Why later */}
                    <div className="mb-10 rounded-2xl bg-white p-6 shadow">
                        <div className="flex items-start gap-3">
                            <Info className="mt-1 h-6 w-6 text-blue-600" />
                            <div>
                                <h2 className="mb-2 text-lg font-semibold text-gray-800">Why the Dashboard is built last</h2>
                                <ul className="list-inside list-disc space-y-1 text-gray-600">
                                    <li>Dashboard metrics depend on Jobs, Candidates, Placements, and Revenue</li>
                                    <li>Building it earlier would result in misleading or fake data</li>
                                    <li>Final KPIs must reflect real business workflows</li>
                                    <li>Ensures long‑term accuracy and trust in reports</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Planned Sections */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* KPIs */}
                        <div className="rounded-2xl bg-white p-6 shadow">
                            <div className="mb-4 flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-emerald-600" />
                                <h3 className="text-lg font-semibold text-gray-800">Key Metrics (KPIs)</h3>
                            </div>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Active Clients</li>
                                <li>• Active Jobs</li>
                                <li>• Candidates in Pipeline</li>
                                <li>• Placements This Month</li>
                                <li>• Revenue This Month</li>
                            </ul>
                        </div>

                        {/* Charts */}
                        <div className="rounded-2xl bg-white p-6 shadow">
                            <div className="mb-4 flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-indigo-600" />
                                <h3 className="text-lg font-semibold text-gray-800">Charts & Trends</h3>
                            </div>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Monthly Revenue Trend</li>
                                <li>• Placements Over Time</li>
                                <li>• Revenue vs Target / Goal</li>
                            </ul>
                        </div>

                        {/* Tables */}
                        <div className="rounded-2xl bg-white p-6 shadow">
                            <div className="mb-4 flex items-center gap-2">
                                <Table className="h-5 w-5 text-orange-600" />
                                <h3 className="text-lg font-semibold text-gray-800">Quick Tables</h3>
                            </div>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Recent Placements</li>
                                <li>• Pending Invoices</li>
                                <li>• Active Jobs by Client</li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="rounded-2xl bg-white p-6 shadow">
                            <div className="mb-4 flex items-center gap-2">
                                <Zap className="h-5 w-5 text-purple-600" />
                                <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
                            </div>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Add Client</li>
                                <li>• Add Job</li>
                                <li>• Add Candidate</li>
                                <li>• Create Invoice</li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 text-center text-sm text-gray-500">
                        The dashboard will be activated once all dependent modules are finalized, ensuring reliable insights and decision‑ready data.
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
