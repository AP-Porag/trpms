import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout.js';
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowRightCircle, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    {
        title: 'Prospects',
        href: '/prospects',
    },
];

export default function Index({ prospects, meta, filters: initialFilters }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        status: initialFilters.status || 'all',
        perPage: initialFilters.perPage || 5,
        page: meta.current_page || 1,
    });

    useEffect(() => {
        router.get(route('prospects.index'), filters, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    }, [filters.search, filters.status, filters.perPage, filters.page]);

    /*
    |--------------------------------------------------------------------------
    | Table Columns
    |--------------------------------------------------------------------------
    */

    const columns = [
        { key: 'name', label: 'Contact Name' },

        { key: 'company_name', label: 'Company' },

        {
            key: 'email',
            label: 'Email',
            render: (row) => <span className="block w-48 truncate">{row.email}</span>,
        },

        {
            key: 'phone',
            label: 'Phone',
            render: (row) => <span className="block w-40 truncate">{row.phone}</span>,
        },

        {
            key: 'created_at',
            label: 'Created',
            render: (row) => new Date(row.created_at).toLocaleDateString(),
        },

        {
            key: 'status',
            label: 'Status',
            render: (row) => {
                const statusStyles = {
                    1: 'bg-green-100 text-green-800',
                    0: 'bg-red-100 text-red-800',
                };

                return (
                    <span className={`rounded px-2 py-1 text-xs font-medium ${statusStyles[row.status] || 'bg-gray-100 text-gray-800'}`}>
                        {row.status == 1 ? 'Active' : 'Inactive'}
                    </span>
                );
            },
        },
    ];

    /*
    |--------------------------------------------------------------------------
    | Row Actions
    |--------------------------------------------------------------------------
    */

    const rowActions = (row) => ({
        view: false,

        edit: true,

        delete: true,

        convert: true,
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Prospects" />

            <div className="p-4">
                <div className="my-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Prospects</h1>

                    <Button onClick={() => router.visit(route('prospects.create'))} className="cursor-pointer bg-black text-white hover:bg-gray-800">
                        <Plus className="mr-2" />
                        Create Prospect
                    </Button>
                </div>

                <DataTable
                    data={prospects}
                    columns={columns}
                    meta={{
                        from: meta.from,
                        to: meta.to,
                        total: meta.total,
                        current_page: meta.current_page,
                        last_page: meta.last_page,
                        searchPlaceholderText: meta.searchPlaceholderText,
                    }}
                    actions={(row) => ({
                        view: true,
                        edit: true,
                        delete: true,

                        /*
                        |--------------------------------------------------------------------------
                        | Convert Prospect → Client
                        |--------------------------------------------------------------------------
                        */

                        convert: {
                            label: 'Convert to Client',
                            icon: ArrowRightCircle,
                            action: () => router.visit(route('clients.edit', row.id)),
                        },
                    })}
                    baseRoute="prospects"
                    filters={filters}
                    onFilterChange={setFilters}
                />
            </div>
        </AppLayout>
    );
}
