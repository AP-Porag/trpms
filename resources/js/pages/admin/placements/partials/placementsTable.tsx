import DataTable from '@/components/common/DataTable';
import { formatDateUS } from '@/utils/helpers';
import { router } from '@inertiajs/react';

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
            label: 'Candidate Placed',
            render: (row) => `${row.candidate?.first_name} ${row.candidate?.last_name}`,
        },
        // {
        //     key: 'placement_date',
        //     label: 'Time to Close',
        //     render: (row) => `${row.placement_date}-${row.job.created_at}`,
        // },
        {
            key: 'placement_date',
            label: 'Time to Close',
            render: (row) => {
                if (!row.placement_date || !row.job?.created_at) return '-';

                const placement = new Date(row.placement_date);
                const created = new Date(row.job.created_at);

                const diffTime = placement.getTime() - created.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                return <span className="block w-48 truncate">{diffDays} days</span>;
            },
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
            label: 'Fee',
            // render: (row) => (row.fee_percentage ? `${row.fee_percentage}%` : 'Fixed'),
            render: (row) => {
                if (row.fee_type === 'percentage') {
                    return `${row.fee_percentage}%`;
                }

                return `Fixed ($${Number(row.placement_fee).toLocaleString()})`;
            }
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
                // create_invoice: {
                //     label: 'Create Invoice',
                //     icon: FileText,
                //     action: () =>
                //         router.visit(
                //             route('invoices.create', {
                //                 id: row.client_id,
                //             }),
                //         ),
                // },

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
