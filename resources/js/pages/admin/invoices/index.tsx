import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, FileText, DollarSign, AlertCircle, XCircle, CheckCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { INVOICE_STATUS } from '@/utils/constants';

const breadcrumbs = [
    {
        title: 'Invoices',
        href: '/admin/invoices',
    },
];

export default function Index({
                                  invoices,
                                  meta,
                                  filters: initialFilters,
                                  clients,
                                  months,
                                  summary,
                              }) {

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash]);

    /* ===============================
       FILTER STATE
    =============================== */

    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        client_id: initialFilters.client_id || '',
        status: initialFilters.status || '',
        date_from: initialFilters.date_from || '',
        date_to: initialFilters.date_to || '',
        month: initialFilters.month || '',
        perPage: initialFilters.perPage || 10,
        page: meta.current_page || 1,
    });

    useEffect(() => {
        router.get(route('invoices.index'), filters, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    }, [filters]);

    const updateFilter = (name, value) => {
        setFilters({
            ...filters,
            [name]: value,
            page: 1
        });
    };

    /* ===============================
       STATUS MODAL
    =============================== */

    const [statusModal, setStatusModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [status, setStatus] = useState('');
    const [issuedDate, setIssuedDate] = useState('');
    const [paidDate, setPaidDate] = useState('');

    const openStatusModal = (invoice) => {
        setSelectedInvoice(invoice);
        setStatus(invoice.status);
        setIssuedDate(invoice.sent_date || '');
        setPaidDate(invoice.paid_date || '');
        setStatusModal(true);
    };

    const updateStatus = () => {

        let paid = paidDate;

        if (status === INVOICE_STATUS.PAID && !paidDate) {
            paid = new Date().toISOString().slice(0,10);
        }

        router.post(route('invoices.update-status', selectedInvoice.id), {
            status,
            sent_date: issuedDate,
            paid_date: status === INVOICE_STATUS.PAID ? paid : null
        },{
            onSuccess: () => {
                // toast.success("Invoice status updated");
                setStatusModal(false);
            }
        });
    };

    /* ===============================
       CANCEL MODAL
    =============================== */

    const [cancelModal, setCancelModal] = useState(false);
    const [cancelId, setCancelId] = useState(null);

    const confirmCancel = () => {

        router.delete(route('invoices.destroy', cancelId), {
            onSuccess: () => {
                toast.success('Invoice canceled');
                setCancelModal(false);
            }
        });

    };

    /* ===============================
       TABLE COLUMNS
    =============================== */

    const columns = [

        {
            key: 'invoice_number',
            label: 'Invoice #'
        },

        {
            key: 'client',
            label: 'Client',
            render: (row) => row.client?.name ?? row.client?.company_name
        },

        {
            key: 'sent_date',
            label: 'Date'
        },

        {
            key: 'total_collected',
            label: 'Total Collected',
            render: (row) => `$${row.total_collected ?? 0}`
        },

        {
            key: 'amount',
            label: 'Final Amount',
            render: (row) => `$${row.amount}`
        },

        // {
        //     key: 'payable_to',
        //     label: 'Payable To',
        //     render: () => "Securre"
        // },

        {
            key: 'status',
            label: 'Status',
            render: (row) => {

                const color =
                    row.status === INVOICE_STATUS.PAID
                        ? 'bg-green-100 text-green-700'
                        : row.status === INVOICE_STATUS.ISSUED
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700';

                return (
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
                        {row.status}
                    </span>
                );
            }
        }

    ];

    /* ===============================
       ROW ACTIONS
    =============================== */

    const actions = (row) => {

        return {
            view: true,
            status_filter: false,

            change_status: row.status !== INVOICE_STATUS.PAID && row.status !== INVOICE_STATUS.CANCELED
                ? {
                label: 'Change Status',
                icon: CheckCheck,
                action: () => openStatusModal(row),
            }:false,

            cancel:
                row.status !== INVOICE_STATUS.PAID && row.status !== INVOICE_STATUS.CANCELED
                    ? {
                          label: 'Cancel',
                          icon: XCircle,
                          action: () => {
                              setCancelId(row.id);
                              setCancelModal(true);
                          },
                      }
                    : false,
        };

    };

    /* ===============================
       COMPONENT
    =============================== */

    return (
        <AppLayout breadcrumbs={breadcrumbs}>

            <Head title="Invoices"/>

            <div className="p-4">

                {/* PAGE HEADER */}

                <div className="my-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Invoices</h1>

                    <Button
                        onClick={() => router.visit(route('invoices.create'))}
                        className="cursor-pointer bg-black text-white hover:bg-gray-800"
                    >
                        <Plus className="mr-2"/>
                        Create Invoice
                    </Button>
                </div>

                {/* SUMMARY CARDS */}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

                    <div className="rounded-xl bg-white p-4 shadow flex items-center gap-4">
                        <FileText className="text-blue-500"/>
                        <div>
                            <p className="text-sm text-gray-500">Total Invoices</p>
                            <p className="text-xl font-bold">{summary.totalInvoices}</p>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow flex items-center gap-4">
                        <DollarSign className="text-green-600"/>
                        <div>
                            <p className="text-sm text-gray-500">Total Collected</p>
                            <p className="text-xl font-bold">${summary.totalCollected}</p>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow flex items-center gap-4">
                        <DollarSign className="text-blue-600"/>
                        <div>
                            <p className="text-sm text-gray-500">Final Amount</p>
                            <p className="text-xl font-bold">${summary.totalFinalAmount}</p>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-4 shadow flex items-center gap-4">
                        <AlertCircle className="text-red-500"/>
                        <div>
                            <p className="text-sm text-gray-500">Outstanding</p>
                            <p className="text-xl font-bold">${summary.totalOutstanding}</p>
                        </div>
                    </div>

                </div>

                {/* FILTER SECTION */}

                <div className="bg-white p-4 rounded-xl shadow mb-6">

                    <div className="grid md:grid-cols-5 gap-4">

                        {/* DATE FROM */}

                        <div>
                            <label className="text-sm font-medium">Date From</label>
                            <input
                                type="date"
                                value={filters.date_from}
                                onChange={(e)=>updateFilter('date_from',e.target.value)}
                                className="w-full border rounded p-2 mt-1"
                            />
                        </div>

                        {/* DATE TO */}

                        <div>
                            <label className="text-sm font-medium">Date To</label>
                            <input
                                type="date"
                                value={filters.date_to}
                                onChange={(e)=>updateFilter('date_to',e.target.value)}
                                className="w-full border rounded p-2 mt-1"
                            />
                        </div>

                        {/* CLIENT */}

                        <div>
                            <label className="text-sm font-medium">Client</label>

                            <select
                                value={filters.client_id}
                                onChange={(e)=>updateFilter('client_id',e.target.value)}
                                className="w-full border rounded p-2 mt-1"
                            >

                                <option value="">All Clients</option>

                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name ?? client.company_name}
                                    </option>
                                ))}

                            </select>
                        </div>

                        {/* STATUS */}

                        <div>
                            <label className="text-sm font-medium">Status</label>

                            <select
                                value={filters.status}
                                onChange={(e)=>updateFilter('status',e.target.value)}
                                className="w-full border rounded p-2 mt-1"
                            >

                                <option value="">All Status</option>

                                <option value={INVOICE_STATUS.ISSUED}>Issued</option>
                                <option value={INVOICE_STATUS.PAID}>Paid</option>
                                {/*<option value={INVOICE_STATUS.CANCELED}>Canceled</option>*/}

                            </select>
                        </div>

                        {/* MONTH */}

                        <div>
                            <label className="text-sm font-medium">Month</label>

                            <input
                                type="month"
                                value={filters.month}
                                onChange={(e)=>updateFilter('month',e.target.value)}
                                className="w-full border rounded p-2 mt-1"
                            />
                        </div>

                    </div>

                </div>

                {/* TABLE */}

                <DataTable
                    data={invoices}
                    columns={columns}
                    meta={{
                        from: meta.from,
                        to: meta.to,
                        total: meta.total,
                        current_page: meta.current_page,
                        last_page: meta.last_page,
                        searchPlaceholderText: meta.searchPlaceholderText,
                    }}
                    actions={actions}
                    baseRoute="invoices"
                    filters={filters}
                    onFilterChange={setFilters}
                />

            </div>

            {/* STATUS MODAL */}

            {statusModal && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white w-[450px] rounded-xl shadow-xl p-6">

                        <h2 className="text-lg font-semibold mb-4">
                            Change Invoice Status
                        </h2>

                        <div className="space-y-4">

                            <div>
                                <label className="text-sm font-medium">Status</label>

                                <select
                                    className="w-full border rounded p-2 mt-1"
                                    value={status}
                                    onChange={(e)=>setStatus(e.target.value)}
                                >
                                    <option value={INVOICE_STATUS.ISSUED}>Issued</option>
                                    <option value={INVOICE_STATUS.PAID}>Paid</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Issued Date</label>

                                <input
                                    type="date"
                                    className="w-full border rounded p-2 mt-1"
                                    value={issuedDate}
                                    onChange={(e)=>setIssuedDate(e.target.value)}
                                />
                            </div>

                            {status === INVOICE_STATUS.PAID && (

                                <div>
                                    <label className="text-sm font-medium">Paid Date</label>

                                    <input
                                        type="date"
                                        className="w-full border rounded p-2 mt-1"
                                        value={paidDate}
                                        onChange={(e)=>setPaidDate(e.target.value)}
                                    />
                                </div>

                            )}

                        </div>

                        <div className="flex justify-end gap-2 mt-6">

                            <Button
                                variant="outline"
                                onClick={()=>setStatusModal(false)}
                            >
                                Cancel
                            </Button>

                            <Button
                                onClick={updateStatus}
                                className="bg-black text-white"
                            >
                                Save Changes
                            </Button>

                        </div>

                    </div>

                </div>

            )}

            {/* CANCEL MODAL */}

            {cancelModal && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl shadow-xl w-[400px] p-6">

                        <h2 className="text-lg font-semibold mb-3">
                            Cancel Invoice
                        </h2>

                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to cancel this invoice?
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-2">

                            <Button
                                variant="outline"
                                onClick={()=>setCancelModal(false)}
                            >
                                Close
                            </Button>

                            <Button
                                className="bg-red-600 text-white"
                                onClick={confirmCancel}
                            >
                                Confirm Cancel
                            </Button>

                        </div>

                    </div>

                </div>

            )}

        </AppLayout>
    );
}
