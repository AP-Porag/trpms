import { router } from '@inertiajs/react';
import { createPortal } from 'react-dom';

export default function AutoInvoiceModal({ open, placementId, onClose }) {
    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-lg font-semibold">Placement confirmed successfully.You may now generate an invoice.</h2>

                <p className="mb-6 text-sm text-gray-600">Do you want to create an invoice for this placement?</p>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="rounded border px-4 py-2 text-sm">
                        No
                    </button>

                    <button
                        onClick={() => {
                            router.visit(`/invoices/create?placement=${placementId}`);
                        }}
                        className="rounded bg-black px-4 py-2 text-sm text-white"
                    >
                        Create Invoice
                    </button>
                </div>
            </div>
        </div>,

        document.body,
    );
}
