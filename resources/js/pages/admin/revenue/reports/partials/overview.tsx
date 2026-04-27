import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DonutChart from '@/pages/admin/revenue/reports/partials/DonutChart';

export default function Overview({ overview }) {

    if (!overview) return null;

    const { summary, monthly, quarterly, by_client, by_industry, by_department } = overview;

    const currency = (val) => `$${Number(val).toLocaleString()}`;

    return (
        <div className="space-y-6">
            {/* ================= TOP CARDS ================= */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
                    <CardHeader>
                        <CardTitle>Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">{currency(summary.total)}</CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md">
                    <CardHeader>
                        <CardTitle>This Month</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">{currency(summary.this_month)}</CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md">
                    <CardHeader>
                        <CardTitle>This Year</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">{currency(summary.this_year)}</CardContent>
                </Card>
            </div>

            {/* ================= MONTHLY LINE CHART ================= */}
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthly}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(val) => currency(val)} />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                isAnimationActive
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* ================= QUARTERLY BAR ================= */}
            <Card>
                <CardHeader>
                    <CardTitle>Quarterly Revenue</CardTitle>
                </CardHeader>
                <CardContent className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={quarterly}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="quarter" />
                            <YAxis />
                            <Tooltip formatter={(val) => currency(val)} />
                            <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} isAnimationActive />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* ================= CLIENT BAR ================= */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue by Client</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={by_client}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="client" />
                            <YAxis />
                            <Tooltip formatter={(val) => currency(val)} />
                            <Bar dataKey="revenue" fill="#22c55e" radius={[6, 6, 0, 0]} isAnimationActive />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* ================= INDUSTRY ================= */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue by Industry</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={by_industry}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="industry" />
                            <YAxis />
                            <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
                            <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* ================= PIE CHARTS ================= */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* INDUSTRY */}
                <div className="rounded-xl border p-5 shadow-sm transition hover:shadow-md">
                    <DonutChart data={by_industry} dataKey="revenue" nameKey="industry" title="Revenue by Industry" />
                </div>

                {/* DEPARTMENT */}
                <div className="rounded-xl border p-5 shadow-sm transition hover:shadow-md">
                    <DonutChart data={by_department} dataKey="revenue" nameKey="department" title="Revenue by Department" />
                </div>
            </div>
        </div>
    );
}
