import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import AppLayout from '@/layouts/app-layout.js';
import { toast } from 'sonner';

const breadcrumbs = [
    {
        title: 'Jobs',
        href: '/jobs/index',
    },
];

export default function Index({ jobs,meta, filters: initialFilters }) {

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
            render: (row) => <span className="block w-48 truncate">{row.fee_type}</span>,
        },
        {
            key: 'fee_value',
            label: 'Fee Value',
            render: (row) => <span className="block w-48 truncate">{row.fee_value}</span>,
        },
        // {
        //     key: 'Job_type',
        //     label: 'Type',
        //     render: (row) => <span className="block w-48 truncate capitalize">{row.Job_type}</span>,
        // },
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
                    <h1 className="text-2xl font-bold">jobs</h1>
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
