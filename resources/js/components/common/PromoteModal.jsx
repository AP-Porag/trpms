import React from "react";

export default function PromoteModal({
                                         open,
                                         onClose,
                                         onConfirm,
                                         title = "Promote Target Account",
                                         message = "This company will be promoted to Prospect. You can start engagement tracking afterwards.",
                                     }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
            <div className="relative w-full max-w-md p-4">
                <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">

                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-900"
                    >
                        ✕
                    </button>

                    <div className="p-6 text-center">

                        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>

                        <p className="mb-6 text-sm text-gray-500">
                            {message}
                        </p>

                        <button
                            onClick={onConfirm}
                            className="mr-3 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700"
                        >
                            Yes, Promote
                        </button>

                        <button
                            onClick={onClose}
                            className="rounded-lg border px-5 py-2.5 text-sm hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}
