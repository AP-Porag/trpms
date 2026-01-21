import { Clock, Wrench, Info } from "lucide-react";
import { usePage } from "@inertiajs/react";

/**
 * UnderDevelopment.jsx
 *
 * Global placeholder page for unfinished modules.
 * Module name is derived dynamically from sidebar navigation (via Inertia props).
 * No hardcoding per module.
 */

export default function UnderDevelopment() {
    const { module } = usePage().props;

    const moduleName = module ?? "This module";

    return (
        <div className="min-h-[75vh] flex items-center justify-center px-6 bg-gray-50">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-10">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                        <Wrench className="w-10 h-10 text-indigo-600" />
                    </div>

                    <h1 className="text-2xl font-semibold text-gray-800">
                        {moduleName} is under development
                    </h1>

                    <p className="mt-3 text-gray-600 max-w-md">
                        This section is part of the ongoing system rollout. The core
                        recruitment workflow is already stable, and this module will be
                        enabled once it meets production standards.
                    </p>
                </div>

                {/* Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-100">
                        <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-800">Current status</p>
                            <p className="text-sm text-gray-600">
                                In active development & internal testing
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-100">
                        <Info className="w-5 h-5 text-emerald-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-800">What you can do</p>
                            <p className="text-sm text-gray-600">
                                Continue using Jobs, Candidates, and Pipeline modules
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t pt-6 text-center">
                    <p className="text-xs text-gray-500">
                        If this module is required urgently, please contact an administrator
                        or project owner for prioritization.
                    </p>
                </div>
            </div>
        </div>
    );
}
