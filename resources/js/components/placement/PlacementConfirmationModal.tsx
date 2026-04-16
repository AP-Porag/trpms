import { router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

export default function PlacementConfirmationModal({ open, onClose, jc }) {
    const [salary, setSalary] = useState('');
    const [offerDate, setOfferDate] = useState('');
    const [startDate, setStartDate] = useState('');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const job = jc?.job ?? {};
    const client = job?.client ?? {};
    const candidate = jc?.candidate ?? {};

    const feePercent = job?.fee_type === 'percentage' ? Number(job?.fee_value ?? 0) : 0;
    const [guaranteeEndDate, setGuaranteeEndDate] = useState('');
    const [placementDate, setPlacementDate] = useState('');

    const placementFee = useMemo(() => {
        if (!salary || !feePercent) return 0;
        return (salary * feePercent) / 100;
    }, [salary, feePercent]);

    useEffect(() => {
        function escHandler(e) {
            if (e.key === 'Escape') onClose();
        }

        if (open) document.addEventListener('keydown', escHandler);

        return () => document.removeEventListener('keydown', escHandler);
    }, [open]);

    if (!open) return null;

    function validate() {
        const e = {};

        if (!salary || salary <= 0) e.salary = 'Salary is required';

        if (!offerDate) e.offerDate = 'Offer accepted date required';

        if (!startDate) e.startDate = 'Start date required';

        setErrors(e);

        return Object.keys(e).length === 0;
    }

    function confirmPlacement() {

        if (!validate()) return;

        setLoading(true);

        router.post(
            route('placements.store'),
            {
                job_candidate_id: jc.id,
                salary,
                fee_percentage: feePercent,
                placement_fee: placementFee,
                offer_accepted_at: offerDate,
                start_date: startDate,
                placement_date: placementDate,
                guarantee_end_date: guaranteeEndDate,
                notes,
            },
            {
                preserveScroll: true,

                onSuccess: () => {
                    setLoading(false);

                    toast.success('Placement confirmed successfully.');

                    onClose();

                    router.reload({ only: ['pipeline'] });
                },

                onError: (error: any) => {
                    setLoading(false);
                    console.log(error);
                    toast.error('Placement could not be created.');
                },
            },
        );
    }

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
            <div className="w-full max-w-xl rounded-xl bg-white shadow-xl" onMouseDown={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-lg font-semibold">Confirm Placement</h2>

                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
                        ✕
                    </button>
                </div>
                <div className="h-[80vh] overflow-y-auto">
                    {/* Body */}
                    <div className="space-y-5 p-6 text-sm">
                        <div className="space-y-1">
                            <div>
                                <span className="font-medium">Candidate:</span> {candidate.first_name} {candidate.last_name}
                            </div>

                            <div>
                                <span className="font-medium">Client:</span> {client?.name ?? '—'}
                            </div>

                            <div>
                                <span className="font-medium">Job:</span> {job?.title ?? '—'}
                            </div>
                        </div>

                        {/* Salary */}
                        <div>
                            <label className="mb-1 block font-medium">Salary Offered</label>

                            {/*<input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full rounded border px-3 py-2" />*/}
                            <input
                                className="w-full rounded border px-3 py-2"
                                type="number"
                                inputMode="numeric"
                                step="1000"
                                min="0"
                                value={salary}
                                onWheel={(e) => e.preventDefault()}
                                onChange={(e) => setSalary(e.target.value)}
                            />

                            {errors.salary && <p className="mt-1 text-xs text-red-500">{errors.salary}</p>}
                        </div>

                        {/* Fee Preview */}
                        <div className="rounded bg-gray-50 p-3">
                            <div>
                                Placement Fee %:
                                <span className="ml-2 font-medium">{feePercent}%</span>
                            </div>

                            <div>
                                Placement Fee:
                                <span className="ml-2 font-semibold text-green-600">${Number(placementFee).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block font-medium">Offer Accepted</label>

                                <input
                                    type="date"
                                    value={offerDate}
                                    onChange={(e) => setOfferDate(e.target.value)}
                                    className="w-full rounded border px-3 py-2"
                                />

                                {errors.offerDate && <p className="mt-1 text-xs text-red-500">{errors.offerDate}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block font-medium">Start Date</label>

                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full rounded border px-3 py-2"
                                />

                                {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Placement Date</label>

                                <input
                                    type="date"
                                    value={placementDate}
                                    onChange={(e) => setPlacementDate(e.target.value)}
                                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium">Guarantee End Date</label>

                                <input
                                    type="date"
                                    value={guaranteeEndDate}
                                    onChange={(e) => setGuaranteeEndDate(e.target.value)}
                                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="mb-1 block font-medium">Notes</label>

                            <textarea rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded border px-3 py-2" />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 border-t px-6 py-4">
                        <button onClick={onClose} className="rounded border px-4 py-2 text-sm">
                            Cancel
                        </button>

                        <button disabled={loading} onClick={confirmPlacement} className="rounded bg-black px-4 py-2 text-sm text-white">
                            {loading ? 'Saving...' : 'Confirm Placement'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,

        document.body,
    );
}
