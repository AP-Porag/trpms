import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Printer, Download, ArrowLeft } from 'lucide-react';
import AppLogo from '@/components/app-logo.tsx';

export default function View({ invoice }) {

    const printInvoice = () => {
        window.print();
    };

    const goBack = () => {
        router.visit(route('invoices.index'));
    };

    const statusColor = {
        draft: "bg-gray-200 text-gray-700",
        issued: "bg-blue-100 text-blue-700",
        paid: "bg-green-100 text-green-700",
        canceled: "bg-red-100 text-red-700"
    };

    return (
        <AppLayout>
            <Head title={`Invoice ${invoice.invoice_number}`} />

            {/* PRINT STYLE */}

            <style>
                {`
                @media print {

                    body * {
                        visibility: hidden;
                    }

                    #invoice-print-area,
                    #invoice-print-area * {
                        visibility: visible;
                    }

                    #invoice-print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }

                    .no-print {
                        display: none;
                    }

                }
                `}
            </style>

            <div className="p-6">
                {/* ACTION BAR */}

                <div className="no-print mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Invoice View</h1>

                    <div className="flex gap-3">
                        <Button variant="outline" className="cursor-pointer" onClick={goBack}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>

                        <Button variant="outline" className="cursor-pointer" onClick={printInvoice}>
                            <Printer className="mr-2 h-4 w-4" />
                            Print
                        </Button>

                        <Button className="bg-black text-white" onClick={printInvoice}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </div>
                </div>

                {/* PRINTABLE INVOICE */}

                <div id="invoice-print-area" className="mx-auto max-w-5xl rounded-xl bg-white p-10 shadow">
                    {/* HEADER */}

                    <div className="mb-6 flex items-start justify-between border-b pb-6">
                        <div className="flex items-center gap-3">
                            {/*<img*/}
                            {/*    src="/logo.png"*/}
                            {/*    alt="Company Logo"*/}
                            {/*    className="h-10"*/}
                            {/*/>*/}
                            <AppLogo />

                            <div>
                                <h2 className="text-xl font-bold">Blueprint Talent</h2>

                                <p className="text-sm text-gray-500">Recruitment & Placement Services</p>
                            </div>
                        </div>

                        <div className="text-right">
                            <h2 className="text-2xl font-bold">INVOICE</h2>

                            <p className="text-gray-500">#{invoice.invoice_number}</p>
                        </div>
                    </div>

                    {/* CLIENT + INVOICE INFO */}

                    <div className="mb-10 grid grid-cols-2 gap-6">
                        {/* CLIENT INFO */}

                        <div>
                            <h3 className="mb-2 font-semibold">Bill To</h3>

                            <p className="font-medium">{invoice.client?.name ?? invoice.client?.company_name}</p>
                        </div>

                        {/* INVOICE INFO */}

                        <div className="space-y-1 text-right">
                            <div>
                                <span className="text-gray-500">Status:</span>
                                <span className={`ml-2 rounded px-2 py-1 text-xs font-semibold ${statusColor[invoice.status]}`}>
                                    {invoice.status}
                                </span>
                            </div>

                            <div>
                                <span className="text-gray-500">Sent Date:</span>
                                <span className="ml-2">{invoice.sent_date}</span>
                            </div>

                            {invoice.paid_date && (
                                <div>
                                    <span className="text-gray-500">Paid Date:</span>
                                    <span className="ml-2">{invoice.paid_date}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* PLACEMENT TABLE */}

                    <div className="mb-10">
                        <table className="min-w-full table-auto border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-4 py-2 text-left">Candidate</th>

                                    <th className="border px-4 py-2 text-left">Job</th>

                                    <th className="border px-4 py-2 text-left">Salary</th>

                                    <th className="border px-4 py-2 text-left">Fee %</th>

                                    <th className="border px-4 py-2 text-right">Amount</th>
                                </tr>
                            </thead>

                            <tbody>
                                {invoice.placements.map((placement) => (
                                    <tr key={placement.id}>
                                        <td className="border px-4 py-2">
                                            {placement.candidate?.first_name} {placement.candidate?.last_name}
                                        </td>

                                        <td className="border px-4 py-2">{placement.job?.title}</td>

                                        <td className="border px-4 py-2">${placement.salary}</td>

                                        <td className="border px-4 py-2">{placement.fee_percentage}%</td>

                                        <td className="border px-4 py-2 text-right font-semibold">${placement.placement_fee}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* TOTAL */}

                    <div className="flex justify-end">
                        <div className="w-64">
                            <div className="flex justify-between border-t pt-4 text-lg font-bold">
                                <span>Total Amount</span>

                                <span>${invoice.amount}</span>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}

                    <div className="mt-16 border-t pt-6 text-sm text-gray-500">
                        <p>Thank you for your business.</p>

                        <p className="mt-1">If you have any questions regarding this invoice, please contact our accounts department.</p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
