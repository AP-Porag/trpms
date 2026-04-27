import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    {
        title: 'Revenue Goals',
        href: '/revenue/goals',
    },
];

export default function Index({ goal, breakdowns }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const [showModal, setShowModal] = useState(false);

    const [year, setYear] = useState(goal?.year || new Date().getFullYear());
    const [yearlyGoal, setYearlyGoal] = useState(goal?.yearly_goal || '');

    const [aCompanies, setACompanies] = useState(breakdowns?.[0]?.company_count || '');
    const [aPercent, setAPercent] = useState(breakdowns?.[0]?.percent || '');

    const [bCompanies, setBCompanies] = useState(breakdowns?.[1]?.company_count || '');
    const [bPercent, setBPercent] = useState(breakdowns?.[1]?.percent || '');

    const [cCompanies, setCCompanies] = useState(breakdowns?.[2]?.company_count || '');
    const [cPercent, setCPercent] = useState(breakdowns?.[2]?.percent || '');

    const percentTotal = Number(aPercent || 0) + Number(bPercent || 0) + Number(cPercent || 0);

    const submitGoal = (e) => {
        e.preventDefault();

        if (!year || !yearlyGoal) {
            toast.error('Year and yearly goal are required');
            return;
        }

        if (Number(yearlyGoal) <= 0) {
            toast.error('Yearly goal must be greater than 0');
            return;
        }

        if (!aCompanies || !bCompanies || !cCompanies) {
            toast.error('Company count is required for A, B and C ranks');
            return;
        }

        if (!aPercent || !bPercent || !cPercent) {
            toast.error('Revenue percentages are required');
            return;
        }

        const percentTotal =
            Number(aPercent) +
            Number(bPercent) +
            Number(cPercent);

        if (percentTotal !== 100) {
            toast.error('Revenue percentages must equal 100%');
            return;
        }

        if (percentTotal !== 100) {
            toast.error('Revenue percentages must equal 100%');
            return;
        }

        router.post(
            route('revenue-goals.store'),
            {
                year: Number(year),
                yearly_goal: Number(yearlyGoal),

                breakdowns: [
                    {
                        rank: 'A',
                        company_count: Number(aCompanies),
                        percent: Number(aPercent),
                    },
                    {
                        rank: 'B',
                        company_count: Number(bCompanies),
                        percent: Number(bPercent),
                    },
                    {
                        rank: 'C',
                        company_count: Number(cCompanies),
                        percent: Number(cPercent),
                    },
                ],
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    setShowModal(false);
                },

                onError: () => {
                    toast.error('Failed to save revenue goal');
                },
            },
        );
    };

    const getHelperText = (count, percent) => {
        if (!count || !percent) {
            return 'Example: 5 clients contributing 50% of your total revenue goal.';
        }

        return `These ${count} client${count == 1 ? '' : 's'} will contribute ${percent}% of your total revenue goal.`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Revenue Goals" />

            <div className="p-4">
                <div className="my-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Revenue Goal Calculator</h1>

                    <Button onClick={() => setShowModal(true)} className="cursor-pointer bg-black text-white hover:bg-gray-800">
                        <Plus className="mr-2" />
                        Set / Update Goal
                    </Button>
                </div>

                {/* Goal Summary */}

                {goal && (
                    <div className="mb-6 rounded-lg bg-white p-6 shadow">
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm text-gray-500">Year</p>
                                <p className="text-xl font-semibold">{goal.year}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Yearly Revenue Goal</p>
                                <p className="text-xl font-semibold">${Number(goal.yearly_goal).toLocaleString()}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">Active</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Breakdown Table */}

                {breakdowns?.length > 0 && (
                    <div className="overflow-hidden rounded-lg bg-gray-200 shadow">
                        <div className="m-4 text-sm text-gray-600">
                            Define how your yearly revenue will be distributed across client ranks.
                            <br />A = High-value clients, B = Mid-value clients, C = Low-value clients.
                        </div>
                        <table className="w-full bg-white text-sm">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left">Rank</th>
                                    <th className="px-4 py-3 text-left">Clients</th>
                                    <th className="px-4 py-3 text-left">Revenue %</th>
                                    <th className="px-4 py-3 text-left">Low</th>
                                    <th className="px-4 py-3 text-left">Target</th>
                                    <th className="px-4 py-3 text-left">High</th>
                                    <th className="px-4 py-3 text-left">Weekly Low</th>
                                    <th className="px-4 py-3 text-left">Weekly Target</th>
                                    <th className="px-4 py-3 text-left">Weekly High</th>
                                </tr>
                            </thead>

                            <tbody>
                                {breakdowns.map((row) => (
                                    <tr key={row.rank} className="border-b">
                                        <td className="px-4 py-3 font-medium">{row.label}</td>

                                        <td className="px-4 py-3">{row.company_count}</td>

                                        <td className="px-4 py-3">{row.percent}%</td>

                                        <td className="px-4 py-3">${Number(row.low).toLocaleString()}</td>

                                        <td className="px-4 py-3">${Number(row.target).toLocaleString()}</td>

                                        <td className="px-4 py-3">${Number(row.high).toLocaleString()}</td>

                                        <td className="px-4 py-3">${Number(row.weekly_low).toLocaleString()}</td>

                                        <td className="px-4 py-3">${Number(row.weekly_target).toLocaleString()}</td>

                                        <td className="px-4 py-3">${Number(row.weekly_high).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50 font-semibold">
                                <tr>
                                    <td className="px-4 py-3" colSpan="3">
                                        Total Projected Revenue
                                    </td>

                                    <td className="px-4 py-3">${breakdowns.reduce((sum, r) => sum + Number(r.low), 0).toLocaleString()}</td>

                                    <td className="px-4 py-3">${breakdowns.reduce((sum, r) => sum + Number(r.target), 0).toLocaleString()}</td>

                                    <td className="px-4 py-3">${breakdowns.reduce((sum, r) => sum + Number(r.high), 0).toLocaleString()}</td>

                                    <td colSpan="3"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}

                {/* Modal */}

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-[600px] rounded-lg bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-lg font-semibold">Revenue Goal Setup</h2>

                            <form onSubmit={submitGoal}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Year</label>
                                        <input
                                            type="number"
                                            className="w-full rounded border p-2"
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Yearly Goal</label>
                                        <input
                                            type="number"
                                            className="w-full rounded border p-2"
                                            value={yearlyGoal}
                                            onChange={(e) => setYearlyGoal(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <hr className="my-4" />

                                <h3 className="mb-2 font-medium">Client Rating Breakdown</h3>

                                <div className="space-y-3">
                                    <p className="text-sm">Number of Clients</p>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm">A – High Value Clients</label>
                                            {/*<input*/}
                                            {/*    type="number"*/}
                                            {/*    min="1"*/}
                                            {/*    className="w-full rounded border p-2"*/}
                                            {/*    value={aCompanies}*/}
                                            {/*    onChange={(e) => setACompanies(e.target.value)}*/}
                                            {/*/>*/}
                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="e.g. 5"
                                                className="w-full rounded border p-2"
                                                value={aCompanies}
                                                onChange={(e) => setACompanies(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm">Revenue %</label>
                                            {/*<input*/}
                                            {/*    className="w-full rounded border p-2"*/}
                                            {/*    value={aPercent}*/}
                                            {/*    onChange={(e) => setAPercent(e.target.value)}*/}
                                            {/*/>*/}
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="e.g. 50"
                                                className="w-full rounded border p-2"
                                                value={aPercent}
                                                onChange={(e) => setAPercent(e.target.value)}
                                            />
                                        </div>

                                        {/*<div className="flex items-end text-sm text-gray-500">~80% per company of revenue goal</div>*/}
                                        <div className="flex items-end text-xs text-gray-500">{getHelperText(aCompanies, aPercent)}</div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm">B – Mid Value Clients</label>
                                            {/*<input*/}
                                            {/*    type="number"*/}
                                            {/*    min="1"*/}
                                            {/*    className="w-full rounded border p-2"*/}
                                            {/*    value={bCompanies}*/}
                                            {/*    onChange={(e) => setBCompanies(e.target.value)}*/}
                                            {/*/>*/}
                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="e.g. 5"
                                                className="w-full rounded border p-2"
                                                value={bCompanies}
                                                onChange={(e) => setBCompanies(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm">Revenue %</label>
                                            {/*<input*/}
                                            {/*    className="w-full rounded border p-2"*/}
                                            {/*    value={bPercent}*/}
                                            {/*    onChange={(e) => setBPercent(e.target.value)}*/}
                                            {/*/>*/}
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="e.g. 30"
                                                className="w-full rounded border p-2"
                                                value={bPercent}
                                                onChange={(e) => setBPercent(e.target.value)}
                                            />
                                        </div>

                                        {/*<div className="flex items-end text-sm text-gray-500">5-10% per company of revenue goal</div>*/}
                                        <div className="flex items-end text-xs text-gray-500">{getHelperText(bCompanies, bPercent)}</div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm">C – Low Value Clients</label>
                                            {/*<input*/}
                                            {/*    type="number"*/}
                                            {/*    min="1"*/}
                                            {/*    className="w-full rounded border p-2"*/}
                                            {/*    value={cCompanies}*/}
                                            {/*    onChange={(e) => setCCompanies(e.target.value)}*/}
                                            {/*/>*/}
                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="e.g. 10"
                                                className="w-full rounded border p-2"
                                                value={cCompanies}
                                                onChange={(e) => setCCompanies(e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm">Revenue %</label>
                                            {/*<input*/}
                                            {/*    className="w-full rounded border p-2"*/}
                                            {/*    value={cPercent}*/}
                                            {/*    onChange={(e) => setCPercent(e.target.value)}*/}
                                            {/*/>*/}
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="e.g. 20"
                                                className="w-full rounded border p-2"
                                                value={cPercent}
                                                onChange={(e) => setCPercent(e.target.value)}
                                            />
                                        </div>

                                        {/*<div className="flex items-end text-sm text-gray-500">1-5% per company of revenue goal</div>*/}
                                        <div className="flex items-end text-xs text-gray-500">{getHelperText(cCompanies, cPercent)}</div>
                                    </div>
                                </div>

                                {/* ✅ LIVE PERCENT VALIDATION */}

                                <div className="mt-2 text-sm">
                                    <span className={percentTotal === 100 ? 'text-green-600' : 'text-red-600'}>Total: {percentTotal}%</span>

                                    {percentTotal !== 100 && <span className="ml-2 text-red-500">(Must equal 100%)</span>}
                                </div>

                                <div className="mt-6 flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </Button>

                                    <Button
                                        type="submit"
                                        disabled={percentTotal !== 100 || !yearlyGoal || !aCompanies || !bCompanies || !cCompanies}
                                        className="bg-black text-white disabled:opacity-50"
                                    >
                                        Save Goal
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
