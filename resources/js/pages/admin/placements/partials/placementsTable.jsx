import DataTable from '@/components/common/DataTable';
import { formatDateUS } from '@/utils/helpers';
import { router } from '@inertiajs/react';
import { FileText, MessageSquare } from 'lucide-react';

export default function PlacementsTable({ placements, meta, filters }) {
    console.log(placements);
    const columns = [
        {
            key: 'placement_date',
            label: 'Placement Date',
            sortable: true,
            render: (row) => formatDateUS(row.placement_date),
        },
        {
            key: 'candidate',
            label: 'Candidate',
            render: (row) => `${row.candidate?.first_name} ${row.candidate?.last_name}`,
        },
        {
            key: 'client',
            label: 'Client',
            render: (row) => row.client?.name,
        },
        // {
        //     key: 'job',
        //     label: 'Job',
        //     render: (row) => row.job?.title,
        // },
        {
            key: 'salary',
            label: 'Salary',
            sortable: true,
            render: (row) => (row.salary ? `$${Number(row.salary).toLocaleString()}` : '—'),
        },
        {
            key: 'fee_percentage',
            label: 'Fee %',
            render: (row) => (row.fee_percentage ? `${row.fee_percentage}%` : '—'),
        },
        {
            key: 'placement_fee',
            label: 'Placement Fee',
            sortable: true,
            render: (row) => (row.placement_fee ? `$${Number(row.placement_fee).toLocaleString()}` : '—'),
        },
        {
            key: 'start_date',
            label: 'Start Date',
            render: (row) => (row.start_date ? formatDateUS(row.start_date) : '—'),
        },
        // {
        //     key: 'guarantee_end_date',
        //     label: 'Guarantee End',
        //     render: (row) => (row.guarantee_end_date ? formatDateUS(row.guarantee_end_date) : '—'),
        // },
        // {
        //     key: 'recruiter',
        //     label: 'Recruiter',
        //     render: (row) => row.recruiter?.name ?? '—',
        // },
    ];

    const handleFilterChange = (newFilters) => {
        router.get(route('placements.index'), newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <DataTable
            data={placements}
            columns={columns}
            meta={{
                from: meta.from,
                to: meta.to,
                total: meta.total,
                current_page: meta.current_page,
                last_page: meta.last_page,
                searchPlaceholderText: 'Search candidate, client, job...',
            }}
            actions={{
                view: true,
                status_filter: false,
                create_invoice: {
                    label: 'Create Invoice',
                    icon: FileText,
                    action: () =>
                        router.visit(
                            route('invoices.create', {
                                placement_id: row.id,
                            }),
                        ),
                },

                // add_note: {
                //     label: 'Add Note',
                //     icon: MessageSquare,
                //     action: () => router.visit(route('placements.show', row.id)),
                // },
            }}
            baseRoute="placements"
            filters={filters}
            onFilterChange={handleFilterChange}
        />
    );
}
