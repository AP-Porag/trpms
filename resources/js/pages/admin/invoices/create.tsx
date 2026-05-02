import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import axios from 'axios';

const breadcrumbs = [
    { title: 'Invoices', href: '/admin/invoices' },
    { title: 'Create Invoice', href: '/admin/invoices/create' },
];

export default function Create({ clients }) {

    const [clientId, setClientId] = useState('');
    const [placements, setPlacements] = useState([]);
    const [clientSummary, setClientSummary] = useState(null);
    const [selectedPlacements, setSelectedPlacements] = useState([]);

    //select client
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const filteredClients = useMemo(() => {
        if (!search) return clients;

        return clients.filter((c) => (c.name ?? c.company_name).toLowerCase().includes(search.toLowerCase()));
    }, [search, clients]);

    const selectedClient = clients.find((c) => c.id == clientId);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.client-select')) {
                setOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    /* =========================================
       LOAD CLIENT DATA
    ========================================= */

    const handleClientChange = async (id) => {

        setClientId(id);
        setSelectedPlacements([]);

        if (!id) {
            setPlacements([]);
            setClientSummary(null);
            return;
        }

        try {

            const response = await axios.get(
                route('invoices.client-placements', id)
            );

            setPlacements(response.data.placements);
            setClientSummary(response.data.clientSummary);

        } catch (error) {

            toast.error("Failed to load client placements");

        }

    };

    /* =========================================
       TOGGLE PLACEMENT
    ========================================= */

    const togglePlacement = (placement) => {

        if (placement.placement_invoice_status !== 'not_invoiced') return;

        if (selectedPlacements.includes(placement.id)) {

            setSelectedPlacements(
                selectedPlacements.filter(id => id !== placement.id)
            );

        } else {

            setSelectedPlacements([...selectedPlacements, placement.id]);

        }

    };

    /* =========================================
       SELECT ALL
    ========================================= */

    const selectablePlacements = placements.filter(
        p => p.placement_invoice_status === 'not_invoiced'
    );

    const allSelected =
        selectablePlacements.length > 0 &&
        selectablePlacements.every(p => selectedPlacements.includes(p.id));

    const toggleSelectAll = () => {

        if (allSelected) {

            setSelectedPlacements([]);

        } else {

            setSelectedPlacements(selectablePlacements.map(p => p.id));

        }

    };

    /* =========================================
       CALCULATIONS
    ========================================= */

    const totalSelected = selectedPlacements.length;

    const finalAmount = placements
        .filter(p => selectedPlacements.includes(p.id))
        .reduce((sum, p) => sum + Number(p.placement_fee), 0);

    /* =========================================
       CREATE INVOICE
    ========================================= */

    const generateInvoice = () => {

        if (selectedPlacements.length === 0) return;

        router.post(
            route('invoices.store'),
            {
                client_id: clientId,
                placements: selectedPlacements
            },
            // {
            //     onSuccess: (page) => {
            //
            //         toast.success("Invoice generated successfully");
            //
            //         router.visit(
            //             route('invoices.show', page.props.invoice_id)
            //         );
            //
            //     }
            // }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Invoice" />

            <div className="space-y-6 p-4">
                {/* HEADER */}

                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create Invoice</h1>

                    <Button variant="outline" className="cursor-pointer" onClick={() => router.visit(route('invoices.index'))}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </div>

                {/* CLIENT SELECT */}

                {/*<div className="bg-white p-4 rounded-xl shadow">*/}

                {/*    <label className="text-sm font-medium">*/}
                {/*        Select Client*/}
                {/*    </label>*/}

                {/*    <select*/}
                {/*        value={clientId}*/}
                {/*        onChange={(e)=>handleClientChange(e.target.value)}*/}
                {/*        className="w-full border rounded p-2 mt-1"*/}
                {/*    >*/}

                {/*        <option value="">Please select</option>*/}

                {/*        {clients.map(client => (*/}

                {/*            <option key={client.id} value={client.id}>*/}
                {/*                {client.name ?? client.company_name}*/}
                {/*            </option>*/}

                {/*        ))}*/}

                {/*    </select>*/}

                {/*</div>*/}

                <div className="client-select relative rounded-xl bg-white p-4 shadow">
                    <label className="text-sm font-medium">Select Client</label>

                    {/* SELECT BOX */}
                    <div onClick={() => setOpen(!open)} className="mt-1 flex w-full cursor-pointer items-center justify-between rounded border p-2">
                        <span className="text-sm">
                            {selectedClient ? (selectedClient.name ?? selectedClient.company_name) : 'Search and select client'}
                        </span>

                        <ChevronDown size={16} />
                    </div>

                    {/* DROPDOWN */}
                    {open && (
                        <div className="absolute left-0 z-50 mt-2 w-full rounded border bg-white shadow-lg">
                            {/* SEARCH INPUT */}
                            <input
                                type="text"
                                placeholder="Search client..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full border-b p-2 outline-none"
                            />

                            {/* LIST */}
                            <div className="max-h-60 overflow-y-auto">
                                {filteredClients.length === 0 && <div className="p-3 text-sm text-gray-500">No clients found</div>}

                                {filteredClients.map((client) => (
                                    <div
                                        key={client.id}
                                        onClick={() => {
                                            handleClientChange(client.id);
                                            setOpen(false);
                                            setSearch('');
                                        }}
                                        className="cursor-pointer p-2 text-sm hover:bg-gray-100"
                                    >
                                        {client.name ?? client.company_name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* CLIENT SUMMARY */}

                {!clientId && (
                    <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow">
                        Select a client to load their placements and financial summary. After selecting the client, you will be able to choose one or
                        more placements to generate an invoice.
                    </div>
                )}

                {clientSummary && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl bg-blue-50 p-4 shadow">
                            <p className="text-sm text-gray-500">Client Name</p>
                            <p className="text-lg font-semibold">{clientSummary.name}</p>
                        </div>

                        <div className="rounded-xl bg-green-50 p-4 shadow">
                            <p className="text-sm text-gray-500">Payment Count</p>
                            <p className="text-lg font-semibold">{clientSummary.payment_count}</p>
                        </div>

                        <div className="rounded-xl bg-indigo-50 p-4 shadow">
                            <p className="text-sm text-gray-500">Total Collected</p>
                            <p className="text-lg font-semibold text-indigo-600">${clientSummary.total_collected}</p>
                        </div>

                        <div className="rounded-xl bg-red-50 p-4 shadow">
                            <p className="text-sm text-gray-500">Total Balance</p>
                            <p className="text-lg font-semibold text-red-600">${clientSummary.total_balance}</p>
                        </div>
                    </div>
                )}

                {/* PLACEMENTS + INVOICE SUMMARY */}

                {clientId && (
                    <div className="grid gap-6">
                        {/* PLACEMENTS */}

                        <div className="overflow-x-hidden rounded-xl bg-white p-4 shadow sm:col-span-3">
                            <h2 className="mb-4 text-lg font-semibold">Placements</h2>

                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead className="border-b text-left">
                                        <tr>
                                            <th className="px-4 py-2">
                                                <input
                                                    type="checkbox"
                                                    onChange={toggleSelectAll}
                                                    checked={allSelected}
                                                    disabled={selectablePlacements.length === 0}
                                                />
                                            </th>

                                            <th className="px-4 py-2">Placement ID</th>
                                            <th className="px-4 py-2">Candidate</th>
                                            <th className="px-4 py-2">Job</th>
                                            <th className="px-4 py-2">Salary</th>
                                            <th className="px-4 py-2">Fee</th>
                                            <th className="px-4 py-2">Placement Fee</th>
                                            <th className="px-4 py-2">Placement Date</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {placements.map((placement) => {
                                            const disabled = placement.placement_invoice_status !== 'not_invoiced';

                                            return (
                                                <tr key={placement.id} className={`border-b hover:bg-gray-50 ${disabled ? 'bg-blue-50' : ''}`}>
                                                    <td className="px-4 py-2">
                                                        <input
                                                            type="checkbox"
                                                            disabled={disabled}
                                                            checked={selectedPlacements.includes(placement.id)}
                                                            onChange={() => togglePlacement(placement)}
                                                        />
                                                    </td>

                                                    <td className="px-4 py-2">{placement.id}</td>

                                                    <td className="px-4 py-2">
                                                        {placement.candidate?.first_name} {placement.candidate?.last_name}
                                                    </td>

                                                    <td className="px-4 py-2">{placement.job?.title}</td>

                                                    <td className="px-4 py-2">${placement.salary}</td>

                                                    <td className="px-4 py-2">
                                                        {/*{placement.fee_percentage}%*/}
                                                        {placement.fee_type === 'percentage'
                                                            ? `${placement.fee_percentage}%`
                                                            : `Fixed ($${Number(placement.placement_fee).toLocaleString()})`}
                                                    </td>

                                                    <td className="px-4 py-2 font-semibold">${placement.placement_fee}</td>

                                                    <td className="px-4 py-2">{placement.placement_date}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* INVOICE SUMMARY */}

                        <div className="rounded-xl bg-white p-6 shadow">
                            <h2 className="mb-4 text-lg font-semibold">Invoice Summary</h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Total Selected</p>

                                    <p className="text-xl font-semibold">{totalSelected}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Final Invoice Amount</p>

                                    <p className="text-2xl font-bold">${finalAmount}</p>
                                </div>
                            </div>

                            <Button
                                disabled={selectedPlacements.length === 0}
                                onClick={generateInvoice}
                                className="mt-6 w-full bg-black text-white disabled:opacity-50"
                            >
                                Generate Invoice
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );

}
