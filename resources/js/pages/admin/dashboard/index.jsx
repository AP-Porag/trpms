import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import SearchableClientSelect from '@/components/common/SearchableClientSelect.jsx';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import {
    Briefcase,
    Building2,
    DollarSign,
    FileText,
    TrendingUp,
    UserPlus,
    Users,
} from 'lucide-react';

const breadcrumbs = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Index({
                                  kpis,
                                  charts,
                                  tables,
                                  quick_actions,
                                  filters,
                                  clients,
                              }) {
    /* ================= FILTER HANDLERS ================= */
    const applyFilters = (newFilters) => {
        router.get(route('dashboard'), newFilters, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    /* ================= DATA FORMAT ================= */
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const normalizeMonthlyData = (items = []) => {
        const map = new Map(items.map((item) => [Number(item.month), Number(item.total)]));
        return monthNames.map((name, index) => ({
            name,
            total: map.get(index + 1) || 0,
        }));
    };

    const revenueData = normalizeMonthlyData(charts.monthly_revenue);
    const placementData = normalizeMonthlyData(charts.placements_trend);

    const actualRevenue = Number(charts?.revenue_vs_goal?.actual || 0);
    const goalRevenue = Number(charts?.revenue_vs_goal?.goal || 0);
    const remainingRevenue = Math.max(goalRevenue - actualRevenue, 0);
    const progressPercentage =
        goalRevenue > 0 ? Math.min((actualRevenue / goalRevenue) * 100, 100) : 0;

    const revenueGoalData = goalRevenue > 0
        ? [
            { name: 'Achieved', value: actualRevenue > goalRevenue ? goalRevenue : actualRevenue },
            { name: 'Remaining', value: remainingRevenue },
        ]
        : [
            { name: 'Achieved', value: actualRevenue || 1 },
        ];

    const pieColors = goalRevenue > 0
        ? ['#10b981', '#e5e7eb']
        : ['#10b981'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="space-y-6 rounded-xl border bg-background p-5">
                    {/* ================= HEADER ================= */}
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Dashboard</h2>
                            <p className="text-muted-foreground text-sm">
                                Track key business metrics, revenue trends, placements, and recent activity.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                            <ActionButton
                                href={quick_actions.add_client}
                                label="Add Client"
                                icon={<Building2 className="h-4 w-4" />}
                                className="bg-blue-600 text-white hover:bg-blue-700"
                            />
                            <ActionButton
                                href={quick_actions.add_job}
                                label="Add Job"
                                icon={<Briefcase className="h-4 w-4" />}
                                className="bg-violet-600 text-white hover:bg-violet-700"
                            />
                            <ActionButton
                                href={quick_actions.add_candidate}
                                label="Add Candidate"
                                icon={<UserPlus className="h-4 w-4" />}
                                className="bg-emerald-600 text-white hover:bg-emerald-700"
                            />
                            <ActionButton
                                href={quick_actions.create_invoice}
                                label="Create Invoice"
                                icon={<FileText className="h-4 w-4" />}
                                className="bg-amber-500 text-white hover:bg-amber-600"
                            />
                        </div>
                    </div>

                    {/* ================= FILTERS ================= */}
                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            type="number"
                            value={filters.year}
                            onChange={(e) =>
                                applyFilters({
                                    ...filters,
                                    year: e.target.value,
                                })
                            }
                            className="w-32 rounded border px-3 py-2 text-sm"
                            placeholder="Year"
                        />

                        <SearchableClientSelect
                            clients={clients}
                            value={filters.client_id?.toString() || ''}
                            onChange={(value) =>
                                applyFilters({
                                    ...filters,
                                    client_id: value || '',
                                })
                            }
                        />
                    </div>

                    {/* ================= KPI CARDS ================= */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        <KpiCard
                            title="Active Clients"
                            value={kpis.active_clients}
                            icon={<Building2 className="h-5 w-5" />}
                            cardClassName="border-blue-200 bg-gradient-to-br from-blue-50 to-white"
                            iconClassName="bg-blue-100 text-blue-600"
                        />
                        <KpiCard
                            title="Active Jobs"
                            value={kpis.active_jobs}
                            icon={<Briefcase className="h-5 w-5" />}
                            cardClassName="border-violet-200 bg-gradient-to-br from-violet-50 to-white"
                            iconClassName="bg-violet-100 text-violet-600"
                        />
                        <KpiCard
                            title="Pipeline"
                            value={kpis.candidates_in_pipeline}
                            icon={<Users className="h-5 w-5" />}
                            cardClassName="border-cyan-200 bg-gradient-to-br from-cyan-50 to-white"
                            iconClassName="bg-cyan-100 text-cyan-600"
                        />
                        <KpiCard
                            title="Placements"
                            value={kpis.placements_this_month}
                            icon={<TrendingUp className="h-5 w-5" />}
                            cardClassName="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
                            iconClassName="bg-emerald-100 text-emerald-600"
                        />
                        <KpiCard
                            title="Revenue"
                            value={`$${formatNumber(kpis.revenue_this_month)}`}
                            icon={<DollarSign className="h-5 w-5" />}
                            cardClassName="border-amber-200 bg-gradient-to-br from-amber-50 to-white"
                            iconClassName="bg-amber-100 text-amber-600"
                        />
                    </div>

                    {/* ================= REVENUE TREND ================= */}
                    <ChartCard
                        title="Revenue Trend"
                        description="Monthly paid revenue overview for the selected year."
                    >
                        <div className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={revenueData}
                                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} width={60} />
                                    <Tooltip formatter={(value) => [`$${formatNumber(value)}`, 'Revenue']} />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    {/* ================= PLACEMENTS TREND ================= */}
                    <ChartCard
                        title="Placements Trend"
                        description="Monthly placement count for the selected year."
                    >
                        <div className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={placementData}
                                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={40} />
                                    <Tooltip formatter={(value) => [value, 'Placements']} />
                                    <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="#8b5cf6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    {/* ================= REVENUE GOAL + ACTIVE JOBS ================= */}
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <ChartCard
                            title="Revenue vs Goal"
                            description="Progress against your yearly revenue goal."
                        >
                            <div className="flex min-h-[320px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="h-[240px] w-full lg:w-[52%]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={revenueGoalData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={4}
                                                dataKey="value"
                                            >
                                                {revenueGoalData.map((entry, index) => (
                                                    <Cell key={index} fill={pieColors[index % pieColors.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `$${formatNumber(value)}`} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="flex w-full flex-col gap-4 lg:w-[48%]">
                                    <div>
                                        <p className="text-muted-foreground text-sm">Actual Revenue</p>
                                        <p className="text-2xl font-bold">
                                            ${formatNumber(actualRevenue)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground text-sm">Goal Revenue</p>
                                        <p className="text-lg font-semibold">
                                            ${formatNumber(goalRevenue)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-muted-foreground mb-2 text-sm">Completion</p>
                                        <div className="h-2.5 w-full rounded-full bg-gray-200">
                                            <div
                                                className="h-2.5 rounded-full bg-emerald-500 transition-all"
                                                style={{ width: `${progressPercentage}%` }}
                                            />
                                        </div>
                                        <p className="mt-2 text-sm font-medium text-emerald-600">
                                            {progressPercentage.toFixed(1)}% achieved
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ChartCard>

                        <DataTable
                            title="Active Jobs"
                            description="Currently active jobs with client information."
                            data={tables.active_jobs}
                            columns={[
                                { label: 'Job', key: 'title' },
                                { label: 'Client', key: 'client.name' },
                            ]}
                        />
                    </div>

                    {/* ================= RECENT PLACEMENTS + PENDING INVOICES ================= */}
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <DataTable
                            title="Recent Placements"
                            description="Latest placed candidates for the selected year."
                            data={tables.recent_placements}
                            columns={[
                                { label: 'Candidate', key: 'candidate.first_name' },
                                { label: 'Client', key: 'job.client.name' },
                            ]}
                        />

                        <DataTable
                            title="Pending Invoices"
                            description="Outstanding invoices awaiting payment."
                            data={tables.pending_invoices}
                            columns={[
                                { label: 'Client', key: 'client.name' },
                                { label: 'Amount', key: 'amount', format: 'currency' },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/* ================= COMPONENTS ================= */

function KpiCard({
                     title,
                     value,
                     icon,
                     cardClassName = '',
                     iconClassName = '',
                 }) {
    return (
        <Card className={`rounded-xl border shadow-sm ${cardClassName}`}>
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-muted-foreground text-sm font-medium">{title}</p>
                        <div className="mt-2 text-2xl font-bold">{value}</div>
                    </div>

                    <div className={`rounded-xl p-3 ${iconClassName}`}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ChartCard({ title, description, children }) {
    return (
        <Card className="rounded-xl border shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                {description ? (
                    <p className="text-muted-foreground text-sm">{description}</p>
                ) : null}
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

function DataTable({ title, description, data, columns }) {
    return (
        <Card className="rounded-xl border shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                {description ? (
                    <p className="text-muted-foreground text-sm">{description}</p>
                ) : null}
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={col.key}>{col.label}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data?.length ? (
                            data.map((row, i) => (
                                <TableRow key={i}>
                                    {columns.map((col) => (
                                        <TableCell key={col.key}>
                                            {formatCellValue(getValue(row, col.key), col.format)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-muted-foreground py-8 text-center"
                                >
                                    No data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function ActionButton({ href, label, icon, className = '' }) {
    return (
        <Button asChild className={`cursor-pointer shadow-sm ${className}`}>
            <a href={href} className="inline-flex items-center gap-2">
                {icon}
                <span>{label}</span>
            </a>
        </Button>
    );
}

/* ================= HELPER ================= */

function getValue(obj, path) {
    return path.split('.').reduce((o, p) => o?.[p], obj) ?? '-';
}

function formatNumber(value) {
    return Number(value || 0).toLocaleString();
}

function formatCellValue(value, format) {
    if (format === 'currency' && value !== '-') {
        return `$${formatNumber(value)}`;
    }

    return value;
}
