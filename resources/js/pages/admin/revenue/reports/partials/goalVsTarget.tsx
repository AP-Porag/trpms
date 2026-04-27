import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RunRateGauge from '@/pages/admin/revenue/reports/partials/RunRateGauge';

export default function GoalVsTarget({ goal }) {
    if (!goal?.has_goal) {
        return (
            <div className="rounded-lg border p-10 text-center">
                <p className="text-muted-foreground">No revenue goal set for this year.</p>
            </div>
        );
    }

    const { summary, range, run_rate, monthly, by_client } = goal;

    const currency = (val) => `$${Number(val).toLocaleString()}`;
    const progress = Math.min(summary.percentage, 100);

    const monthlyData = monthly.map((m) => ({
        month: m.month,
        Target: m.target,
        Actual: m.actual,
    }));

    const getStatusColor = () => {
        if (run_rate.status === 'ahead') return '#22c55e'; // green
        if (run_rate.status === 'on_track') return '#f59e0b'; // yellow
        return '#ef4444'; // red
    };

    const diffLabel = () => {
        if (run_rate.status === 'ahead') {
            return `Ahead by ${currency(run_rate.difference)}`;
        }
        if (run_rate.status === 'behind') {
            return `Behind by ${currency(Math.abs(run_rate.difference))}`;
        }
        return 'On Track';
    };

    return (
        <div className="space-y-6">
            {/* ================= HERO ================= */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md">
                    <CardHeader>
                        <CardTitle>Goal</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">{currency(summary.goal)}</CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md">
                    <CardHeader>
                        <CardTitle>Actual</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">{currency(summary.actual)}</CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md">
                    <CardHeader>
                        <CardTitle>Achieved</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">{summary.percentage}%</CardContent>
                </Card>
            </div>

            {/* ================= PROGRESS ================= */}
            <Card>
                <CardHeader>
                    <CardTitle>Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted h-4 w-full overflow-hidden rounded-full">
                        <div
                            className="h-4 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* ================= RANGE ================= */}
            <Card>
                <CardHeader>
                    <CardTitle>Target Range</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between text-sm">
                    <span>Low: {currency(range.low)}</span>
                    <span className="font-semibold">Target: {currency(range.target)}</span>
                    <span>High: {currency(range.high)}</span>
                </CardContent>
            </Card>

            {/* ================= RUN RATE ================= */}
            {/*<Card>*/}
            {/*    <CardHeader>*/}
            {/*        <CardTitle>Run Rate Insight</CardTitle>*/}
            {/*    </CardHeader>*/}
            {/*    <CardContent className="h-64">*/}
            {/*        <ResponsiveContainer width="100%" height="100%">*/}
            {/*            <BarChart*/}
            {/*                data={[*/}
            {/*                    {*/}
            {/*                        name: 'Revenue',*/}
            {/*                        Expected: run_rate.expected,*/}
            {/*                        Actual: run_rate.actual,*/}
            {/*                    },*/}
            {/*                ]}*/}
            {/*            >*/}
            {/*                <CartesianGrid strokeDasharray="3 3" />*/}
            {/*                <XAxis dataKey="name" />*/}
            {/*                <YAxis />*/}
            {/*                <Tooltip formatter={(val) => currency(val)} />*/}
            {/*                <Bar dataKey="Expected" fill="#94a3b8" />*/}
            {/*                <Bar dataKey="Actual" fill={run_rate.status === 'ahead' ? '#22c55e' : '#ef4444'} />*/}
            {/*            </BarChart>*/}
            {/*        </ResponsiveContainer>*/}
            {/*    </CardContent>*/}
            {/*</Card>*/}

            <Card>
                <CardHeader>
                    <CardTitle>Revenue Pace (Expected vs Actual)</CardTitle>

                    <p className="text-muted-foreground text-xs">
                        Based on today’s date, this shows how much revenue you should have earned by now versus what you’ve actually earned.
                    </p>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* 🔢 Numbers */}
                    <div className="flex justify-between text-sm">
                        <span>Expected: {currency(run_rate.expected)}</span>
                        <span>Actual: {currency(run_rate.actual)}</span>
                    </div>

                    {/* 📊 Chart */}
                    <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                                    {
                                        name: 'Revenue',
                                        Expected: run_rate.expected,
                                        Actual: run_rate.actual,
                                    },
                                ]}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(val) => currency(val)} />

                                <Bar dataKey="Expected" fill="#94a3b8" radius={[6, 6, 0, 0]} />

                                <Bar dataKey="Actual" fill={getStatusColor()} radius={[6, 6, 0, 0]} animationDuration={800} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 🚦 Status */}
                    <div className="text-center">
                        <p className="text-sm font-semibold" style={{ color: getStatusColor() }}>
                            {diffLabel()}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/*<RunRateGauge run_rate={run_rate} summary={summary} />*/}

            {/* ================= MONTHLY ================= */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Target vs Actual</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(val) => currency(val)} />
                            <Bar dataKey="Target" fill="#cbd5f5" />
                            <Bar dataKey="Actual" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* ================= CLIENT ================= */}
            <Card>
                <CardHeader>
                    <CardTitle>Client Contribution</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={by_client}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="client" />
                            <YAxis />
                            <Tooltip formatter={(val) => currency(val)} />
                            <Bar dataKey="revenue" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
