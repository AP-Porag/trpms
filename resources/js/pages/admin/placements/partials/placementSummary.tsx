import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

/* -----------------------------
 Helpers
----------------------------- */

function currency(value) {
    if (!value) return '$0';
    return '$' + Number(value).toLocaleString();
}

function formatLabel(value, period) {
    if (period === 'annual') return value;

    if (period === 'quarterly') return 'Q' + value;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return months[value - 1] || value;
}

/* -----------------------------
 Component
----------------------------- */

export default function PlacementSummary({ summary }) {
    const { placementsThisMonth, revenueThisMonth, averageFee, topClient, placementsOverTime, revenueOverTime, topClients, topRecruiters, period } =
        summary;

    /* -----------------------------
       Chart Data
    ----------------------------- */

    const placementsChart = (placementsOverTime || []).map((row) => ({
        name: formatLabel(row.label, period),
        placements: row.total,
    }));

    const revenueChart = (revenueOverTime || []).map((row) => ({
        name: formatLabel(row.label, period),
        revenue: row.revenue,
    }));

    const topClientsChart = (topClients || []).map((row) => ({
        name: row.client?.name,
        revenue: row.revenue,
    }));

    const recruiterChart = (topRecruiters || []).map((row) => ({
        name: row.recruiter?.name,
        revenue: row.revenue,
    }));

    return (
        <div className="space-y-6">
            {/* ================= HEADER ================= */}

            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Placement Analytics</h3>

                <div className="flex gap-2">
                    {['monthly', 'quarterly', 'annual'].map((p) => (
                        <Button
                            key={p}
                            size="sm"
                            variant={period === p ? 'default' : 'outline'}
                            onClick={() =>
                                router.get(
                                    route('placements.index'),
                                    {
                                        tab: 'summary',
                                        period: p,
                                    },
                                    {
                                        preserveState: true,
                                        replace: true,
                                        preserveScroll: true,
                                    },
                                )
                            }
                        >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* ================= KPI CARDS ================= */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-blue-500 bg-blue-50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm text-blue-700">Placements This Month</CardTitle>
                    </CardHeader>

                    <CardContent className="text-3xl font-bold text-blue-900">{placementsThisMonth}</CardContent>
                </Card>

                <Card className="border-l-4 border-green-500 bg-green-50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm text-green-700">Revenue Generated</CardTitle>
                    </CardHeader>

                    <CardContent className="text-3xl font-bold text-green-900">{currency(revenueThisMonth)}</CardContent>
                </Card>

                <Card className="border-l-4 border-purple-500 bg-purple-50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm text-purple-700">Average Placement Fee</CardTitle>
                    </CardHeader>

                    <CardContent className="text-3xl font-bold text-purple-900">{currency(averageFee)}</CardContent>
                </Card>

                <Card className="border-l-4 border-orange-500 bg-orange-50 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-sm text-orange-700">Top Client</CardTitle>
                    </CardHeader>

                    <CardContent className="text-lg font-semibold text-orange-900">
                        {topClient?.client?.name || '—'}

                        <div className="text-muted-foreground text-sm">{currency(topClient?.revenue)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* ================= MAIN CHARTS ================= */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Placements */}

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Placements Over Time</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={placementsChart}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />

                                <Bar dataKey="placements" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Revenue */}

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Revenue Over Time</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueChart}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />

                                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* ================= BOTTOM CHARTS ================= */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Top Clients */}

                <Card>
                    <CardHeader>
                        <CardTitle>Top Clients by Revenue</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topClientsChart} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis type="number" />

                                <YAxis type="category" dataKey="name" width={140} />

                                <Tooltip />

                                <Bar dataKey="revenue" fill="#f97316" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recruiter Performance */}

                <Card>
                    <CardHeader>
                        <CardTitle>Top Recruiters by Revenue</CardTitle>
                    </CardHeader>

                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={recruiterChart} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis type="number" />

                                <YAxis type="category" dataKey="name" width={140} />

                                <Tooltip />

                                <Bar dataKey="revenue" fill="#6366f1" radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
