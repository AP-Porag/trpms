import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
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

            <div className="p-4 space-y-6">

                {/* HEADER */}

                <div className="flex items-center justify-between">

                    <h1 className="text-2xl font-bold">Create Invoice</h1>

                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => router.visit(route('invoices.index'))}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back
                    </Button>

                </div>

                {/* CLIENT SELECT */}

                <div className="bg-white p-4 rounded-xl shadow">

                    <label className="text-sm font-medium">
                        Select Client
                    </label>

                    <select
                        value={clientId}
                        onChange={(e)=>handleClientChange(e.target.value)}
                        className="w-full border rounded p-2 mt-1"
                    >

                        <option value="">Please select</option>

                        {clients.map(client => (

                            <option key={client.id} value={client.id}>
                                {client.name ?? client.company_name}
                            </option>

                        ))}

                    </select>

                </div>

                {/* CLIENT SUMMARY */}

                {!clientId && (

                    <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">

                        Select a client to load their placements and financial summary.
                        After selecting the client, you will be able to choose one or more
                        placements to generate an invoice.

                    </div>

                )}

                {clientSummary && (

                    <div className="grid md:grid-cols-4 gap-4">

                        <div className="bg-blue-50 rounded-xl shadow p-4">

                            <p className="text-sm text-gray-500">Client Name</p>
                            <p className="text-lg font-semibold">
                                {clientSummary.name}
                            </p>

                        </div>

                        <div className="bg-green-50 rounded-xl shadow p-4">

                            <p className="text-sm text-gray-500">Payment Count</p>
                            <p className="text-lg font-semibold">
                                {clientSummary.payment_count}
                            </p>

                        </div>

                        <div className="bg-indigo-50 rounded-xl shadow p-4">

                            <p className="text-sm text-gray-500">Total Collected</p>
                            <p className="text-lg font-semibold text-indigo-600">
                                ${clientSummary.total_collected}
                            </p>

                        </div>

                        <div className="bg-red-50 rounded-xl shadow p-4">

                            <p className="text-sm text-gray-500">Total Balance</p>
                            <p className="text-lg font-semibold text-red-600">
                                ${clientSummary.total_balance}
                            </p>

                        </div>

                    </div>

                )}

                {/* PLACEMENTS + INVOICE SUMMARY */}

                {clientId && (

                    <div className="grid md:grid-cols-3 gap-6">

                        {/* PLACEMENTS */}

                        <div className="md:col-span-2 bg-white rounded-xl shadow p-4">

                            <h2 className="text-lg font-semibold mb-4">
                                Placements
                            </h2>

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
                                    <th className="px-4 py-2">Fee %</th>
                                    <th className="px-4 py-2">Placement Fee</th>
                                    <th className="px-4 py-2">Placement Date</th>

                                </tr>

                                </thead>

                                <tbody>

                                {placements.map((placement)=>{

                                    const disabled =
                                        placement.placement_invoice_status !== 'not_invoiced';

                                    return(

                                        <tr
                                            key={placement.id}
                                            className={`border-b hover:bg-gray-50 ${
                                                disabled ? 'bg-blue-50' : ''
                                            }`}
                                        >

                                            <td className="px-4 py-2">

                                                <input
                                                    type="checkbox"
                                                    disabled={disabled}
                                                    checked={selectedPlacements.includes(placement.id)}
                                                    onChange={()=>togglePlacement(placement)}
                                                />

                                            </td>

                                            <td className="px-4 py-2">{placement.id}</td>

                                            <td className="px-4 py-2">
                                                {placement.candidate?.first_name} {placement.candidate?.last_name}
                                            </td>

                                            <td className="px-4 py-2">
                                                {placement.job?.title}
                                            </td>

                                            <td className="px-4 py-2">
                                                ${placement.salary}
                                            </td>

                                            <td className="px-4 py-2">
                                                {placement.fee_percentage}%
                                            </td>

                                            <td className="px-4 py-2 font-semibold">
                                                ${placement.placement_fee}
                                            </td>

                                            <td className="px-4 py-2">
                                                {placement.placement_date}
                                            </td>

                                        </tr>

                                    )

                                })}

                                </tbody>

                            </table>

                        </div>

                        {/* INVOICE SUMMARY */}

                        <div className="bg-white rounded-xl shadow p-6">

                            <h2 className="text-lg font-semibold mb-4">
                                Invoice Summary
                            </h2>

                            <div className="space-y-4">

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Total Selected
                                    </p>

                                    <p className="text-xl font-semibold">
                                        {totalSelected}
                                    </p>

                                </div>

                                <div>

                                    <p className="text-sm text-gray-500">
                                        Final Invoice Amount
                                    </p>

                                    <p className="text-2xl font-bold">
                                        ${finalAmount}
                                    </p>

                                </div>

                            </div>

                            <Button
                                disabled={selectedPlacements.length === 0}
                                onClick={generateInvoice}
                                className="w-full mt-6 bg-black text-white disabled:opacity-50"
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
