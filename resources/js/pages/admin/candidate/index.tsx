import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import AppLayout from '@/layouts/app-layout.js';
import { toast } from 'sonner';

const breadcrumbs = [
    {
        title: 'Candidates',
        href: '/Candidates/index',
    },
];

export default function Index({ candidates, meta, filters: initialFilters }) {
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
        router.get(route('candidates.index'), filters, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    }, [filters.search, filters.status, filters.perPage, filters.page]);

    const columns = [
        {
            key: 'first_name',
            label: 'Name',
            render: (row) => (
                <span className="block w-48 truncate">
                    {row.first_name} {row.last_name}
                </span>
            ),
        },
        {
            key: 'email',
            label: 'Email',
            render: (row) => <span className="block w-48 truncate">{row.email}</span>,
        },
        {
            key: 'phone',
            label: 'Phone',
            render: (row) => <span className="block w-48 truncate">{row.phone}</span>,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Candidates" />
            <div className="p-4">
                <div className="my-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Candidates</h1>
                    <Button onClick={() => router.visit(route('candidates.create'))} className="cursor-pointer bg-black text-white hover:bg-gray-800">
                        <Plus className="mr-2" /> Create Candidate
                    </Button>
                </div>
                <DataTable
                    data={candidates}
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
                        search_filter:true,
                        status_filter:false,
                        per_page_filter:true,
                    }}
                    baseRoute="candidates"
                    filters={filters}
                    onFilterChange={setFilters}
                />
            </div>
        </AppLayout>
    );
}
