import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout.js';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs = [
    {
        title: 'Departments',
        href: '/administration/departments',
    },
];

export default function Index({ departments, meta, filters: initialFilters }) {
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');

    const [filters, setFilters] = useState({
        search: initialFilters.search || '',
        perPage: initialFilters.perPage || 5,
        page: meta.current_page || 1,
    });

    useEffect(() => {
        router.get(route('departments.index'), filters, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    }, [filters.search, filters.perPage, filters.page]);

    const columns = [{ key: 'name', label: 'Department' }];

    const submitDepartment = (e) => {
        e.preventDefault();

        if (!name || name.trim() === '') {
            toast.error('Department name is required');
            return;
        }

        if (name.length < 3) {
            toast.error('Department name must be at least 3 characters');
            return;
        }

        router.post(route('departments.store'), { name }, {
            onSuccess: () => {
                setShowModal(false);
                setName('');
            },
            onError: (errors) => {
                if (errors.name) {
                    toast.error(errors.name);
                }
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />

            <div className="p-4">
                <div className="my-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Departments</h1>

                    <Button onClick={() => setShowModal(true)} className="cursor-pointer bg-black text-white hover:bg-gray-800">
                        <Plus className="mr-2" />
                        Add Department
                    </Button>
                </div>

                <DataTable
                    data={departments}
                    columns={columns}
                    meta={{
                        from: meta.from,
                        to: meta.to,
                        total: meta.total,
                        current_page: meta.current_page,
                        last_page: meta.last_page,
                        searchPlaceholderText: meta.searchPlaceholderText,
                    }}
                    actions={{
                        view: false,
                        edit: false,
                        delete: true,
                        search_filter: true,
                        status_filter: false,
                        per_page_filter: true,
                    }}
                    baseRoute="departments"
                    filters={filters}
                    onFilterChange={setFilters}
                />

                {/* Create Industry Modal */}

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="w-[400px] rounded-lg bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-lg font-semibold">Create Department</h2>

                            <form onSubmit={submitDepartment}>
                                <div className="mb-4">
                                    <label className="mb-1 block text-sm font-medium">Department Name</label>

                                    <input
                                        type="text"
                                        className="w-full rounded border p-2"
                                        value={name}
                                        autoFocus
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter department name"
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </Button>

                                    <Button type="submit" disabled={!name.trim()} className="bg-black text-white disabled:opacity-50">
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
