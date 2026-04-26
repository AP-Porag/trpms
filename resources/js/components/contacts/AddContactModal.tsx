import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { PlusCircle, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AddContactModal({ contactableType, contactableId }) {
    const [open, setOpen] = useState(false);

    const [rows, setRows] = useState([{ name: '', type: '', contact: '' }]);

    const [errors, setErrors] = useState<any>({});

    // ================= ADD ROW =================
    function addRow() {
        setRows([...rows, { name: '', type: '', contact: '' }]);
    }

    // ================= REMOVE ROW =================
    function removeRow(index: number) {
        if (rows.length === 1) return;

        const updated = rows.filter((_, i) => i !== index);
        setRows(updated);
    }

    // ================= HANDLE CHANGE =================
    function handleChange(index: number, field: string, value: string) {
        const updated = [...rows];
        updated[index][field] = value;
        setRows(updated);

        // clear error instantly
        if (errors[index]?.[field]) {
            setErrors((prev: any) => ({
                ...prev,
                [index]: {
                    ...prev[index],
                    [field]: null,
                },
            }));
        }
    }

    // ================= VALIDATION =================
    function validate() {
        let newErrors: any = {};

        rows.forEach((row, index) => {
            let rowErrors: any = {};

            if (!row.name) rowErrors.name = 'Name required';
            if (!row.type) rowErrors.type = 'Type required';
            if (!row.contact) rowErrors.contact = 'Contact required';

            if (Object.keys(rowErrors).length > 0) {
                newErrors[index] = rowErrors;
            }
        });

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    // ================= SUBMIT =================
    function submit() {
        if (!validate()) {
            toast.error('Please fill all required fields');
            return;
        }

        router.post(
            route('contacts.store'),
            {
                contacts: rows,
                contactable_type: contactableType,
                contactable_id: contactableId,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Contacts saved successfully');

                    setRows([{ name: '', type: '', contact: '' }]);
                    setErrors({});
                    setOpen(false);

                    router.reload({ only: ['prospect'] });
                },
                onError: () => {
                    toast.error('Failed to save contacts');
                },
            },
        );
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
                <PlusCircle size={16} />
                Add Contact
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl">
                        {/* HEADER */}
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Add Contacts</h3>

                            <div className="flex items-center gap-2">
                                {/* ADD MORE (MOVED HERE) */}
                                <Button variant="outline" size="sm" onClick={addRow}>
                                    Add More
                                </Button>

                                <button onClick={() => setOpen(false)}>
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* TABLE HEADER */}
                        <div className="mb-2 grid grid-cols-12 gap-3 text-sm font-semibold text-gray-600">
                            <div className="col-span-3">Name</div>
                            <div className="col-span-3">Type</div>
                            <div className="col-span-5">Contact</div>
                            <div className="col-span-1"></div>
                        </div>

                        {/* ROWS */}
                        <div className="space-y-3">
                            {rows.map((row, index) => (
                                <div key={index} className="grid grid-cols-12 gap-3">
                                    <div className="col-span-3">
                                        <Input placeholder="Name" value={row.name} onChange={(e) => handleChange(index, 'name', e.target.value)} />
                                        {errors[index]?.name && <p className="mt-1 text-xs text-red-500">{errors[index].name}</p>}
                                    </div>

                                    <div className="col-span-3">
                                        <Input placeholder="Type" value={row.type} onChange={(e) => handleChange(index, 'type', e.target.value)} />
                                        {errors[index]?.type && <p className="mt-1 text-xs text-red-500">{errors[index].type}</p>}
                                    </div>

                                    <div className="col-span-5">
                                        <Input
                                            placeholder="Contact"
                                            value={row.contact}
                                            onChange={(e) => handleChange(index, 'contact', e.target.value)}
                                        />
                                        {errors[index]?.contact && <p className="mt-1 text-xs text-red-500">{errors[index].contact}</p>}
                                    </div>

                                    {/* DELETE */}
                                    <div className="col-span-1 flex items-center justify-center">
                                        <button
                                            disabled={rows.length === 1}
                                            onClick={() => removeRow(index)}
                                            className={`rounded-lg p-2 ${rows.length === 1 ? 'cursor-not-allowed opacity-40' : 'hover:bg-red-100'}`}
                                        >
                                            <Trash2 size={16} className="text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* SAVE */}
                        <div className="mt-6 flex justify-end">
                            <Button onClick={submit}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
