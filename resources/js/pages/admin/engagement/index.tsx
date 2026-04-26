import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout.js';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    {
        title: 'Jobs',
        href: '/jobs/index',
    },
];

export default function Index({ jobs, meta, filters: initialFilters }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        status: initialFilters.status || '',
        perPage: initialFilters.perPage || 5,
        page: meta.current_page || 1,
    });

    useEffect(() => {
        // Push new filters to URL and reload data
        router.get(route('jobs.index'), filters, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    }, [filters.search, filters.status, filters.perPage, filters.page]);

    const columns = [
        { key: 'title', label: 'Title' },
        {
            key: 'fee_type',
            label: 'Fee Type',
            render: (row) => <span className="block w-10">{row.fee_type}</span>,
        },
        {
            key: 'fee_value',
            label: 'Fee Value',
            render: (row) => <span className="block w-10 truncate">{row.fee_value}</span>,
        },
        {
            key: 'days_in_process',
            label: 'Days in Process',
            render: (row) => {
                if (!row.created_at) return '-';

                const created = new Date(row.created_at);
                const today = new Date();

                const diffTime = today.getTime() - created.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                return <span className="block w-20 truncate">{diffDays} days</span>;
            },
        },
        {
            key: 'priotiry',
            label: 'Priotiry',
            render: (row) => <span className="block w-20 truncate capitalize">{row.priotiry}</span>,
        },
        {
            key: 'stage',
            label: 'Stage',
            render: (row) => <span className="block w-20 truncate capitalize">{row.stage}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            render: (row) => {
                const statusStyles = {
                    '1': 'bg-green-100 text-green-800',
                    '0': 'bg-red-100 text-red-800',
                };
                return (
                    <span className={`rounded px-2 py-1 text-xs font-medium ${statusStyles[row.status] || 'bg-gray-100 text-gray-800'}`}>
                        {row.status === '1' ? 'Active' : 'Inactive'}
                    </span>
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jobs" />
            <div className="p-4">
                <div className="my-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Jobs</h1>
                    <Button onClick={() => router.visit(route('jobs.create'))} className="cursor-pointer bg-black text-white hover:bg-gray-800">
                        <Plus className="mr-2" /> Create Job
                    </Button>
                </div>
                <DataTable
                    data={jobs}
                    columns={columns}
                    meta={{
                        from: meta.from,
                        to: meta.to,
                        total: meta.total,
                        current_page: meta.current_page,
                        last_page: meta.last_page,
                        searchPlaceholderText: meta.searchPlaceholderText,
                    }}
                    actions={{
                        view: true,
                        edit: true,
                        delete: true,
                        search_filter: true,
                        status_filter: true,
                        per_page_filter: true,
                    }}
                    baseRoute="jobs"
                    filters={filters}
                    onFilterChange={setFilters}
                />
            </div>
        </AppLayout>
    );
}
