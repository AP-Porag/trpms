import DatePicker from '@/components/forms/DatePicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { FileText, RotateCw, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const breadcrumbs = [{ title: 'Edit Client', href: '#' }];

const clientSchema = (hasExistingAgreements) =>
    z.object({
        name: z.string().min(3),
        company_name: z.string().min(3),
        email: z.string().email(),
        phone: z.string().min(5),
        address: z.string().optional(),
        client_type: z.enum(['retainer', 'contingency']),
        fee_percentage: z.string().min(1),
        status: z.enum(['1', '0']),
        agreement_type: z.string().optional(),
        signed_date: z.string().optional(),
        agreements: z.any().optional(),
    })
        .superRefine((data, ctx) => {
            const hasType = !!data.agreement_type;
            const hasDate = !!data.signed_date;

            const hasNewFiles =
                Array.isArray(data.agreements) && data.agreements.length > 0;

            const hasFiles = hasNewFiles || hasExistingAgreements;

            const any = hasType || hasDate || hasFiles;
            const all = hasType && hasDate && hasFiles;

            if (any && !all) {
                if (!hasType) {
                    ctx.addIssue({
                        path: ['agreement_type'],
                        message: 'Agreement type is required',
                    });
                }
                if (!hasDate) {
                    ctx.addIssue({
                        path: ['signed_date'],
                        message: 'Signed date is required',
                    });
                }
                if (!hasFiles) {
                    ctx.addIssue({
                        path: ['agreements'],
                        message: 'At least one agreement file is required',
                    });
                }
            }
        });



export default function Edit({ client, agreements }) {

    const hasExistingAgreements = agreements && agreements.length > 0;
    const {
        register,
        control,
        handleSubmit,
        setValue,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(clientSchema(hasExistingAgreements)),
        defaultValues: {
            ...client,
            agreement_type: agreements?.[0]?.agreement_type ?? '',
            signed_date: agreements?.[0]?.signed_date ?? '',
        },
    });

    const [files, setFiles] = useState(() =>
        (agreements || []).map((a) => ({
            id: a.id, // 👈 important
            name: a.original_name,
            isExisting: true,
        })),
    );


    useEffect(() => {
        register('agreements');
    }, [register]);

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files).map((file) => ({
            file,
            name: file.name,
            isExisting: false,
        }));

        const updated = [...files, ...newFiles];
        setFiles(updated);

        // Only send NEW files to backend
        setValue(
            'agreements',
            updated.filter((f) => !f.isExisting).map((f) => f.file),
        );
    };

    const removeFile = (index) => {
        const updated = files.filter((_, i) => i !== index);
        setFiles(updated);

        setValue(
            'agreements',
            updated.filter((f) => !f.isExisting).map((f) => f.file),
        );
    };



    const updateClient = async (data) => {
        return new Promise((resolve) => {
            router.post(
                route('clients.update', client.id),
                {
                    ...data,

                    // 🟢 IDs of old files user kept
                    existing_agreements: files
                        .filter(f => f.isExisting)
                        .map(f => f.id),

                    // 🆕 new files only
                    agreements: files
                        .filter(f => !f.isExisting)
                        .map(f => f.file),

                    _method: 'PUT',
                },
                {
                    forceFormData: true,
                    onError: (errs) => {
                        Object.keys(errs).forEach(k =>
                            setError(k, { message: errs[k] })
                        );
                    },
                    onFinish: () => resolve(),
                }
            );
        });
    };



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Client" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border p-5">
                    <form onSubmit={handleSubmit(updateClient)}>
                        {/* CLIENT INFO */}
                        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold">Client Information</h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                {['name', 'company_name', 'email', 'phone'].map((f) => (
                                    <div key={f} className="grid gap-2">
                                        <Label>{f.replace('_', ' ')}</Label>
                                        <Input {...register(f)} className={cn(errors[f] && 'border-red-500')} />
                                        {errors[f] && <span className="text-sm text-red-500">{errors[f].message}</span>}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4">
                                <Label>Address</Label>
                                <Input {...register('address')} />
                            </div>

                            <div className="mt-4 grid gap-4 md:grid-cols-3">
                                <Controller
                                    name="client_type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="retainer">Retainer</SelectItem>
                                                <SelectItem value="contingency">Contingency</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />

                                <Input {...register('fee_percentage')} type="number" placeholder="Fee %" />

                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Active</SelectItem>
                                                <SelectItem value="0">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>

                        {/* AGREEMENTS */}
                        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold">Client Agreements</h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label>Agreement Type</Label>
                                    <Input {...register('agreement_type')} />
                                </div>

                                <Controller
                                    name="signed_date"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Signed Date"
                                            value={field.value}
                                            onChange={field.onChange}
                                            error={errors.signed_date?.message}
                                        />
                                    )}
                                />
                            </div>

                            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center">
                                <Upload className="mb-2 h-6 w-6" />
                                <span className="text-sm">Upload agreements</span>
                                <input type="file" multiple hidden onChange={handleFileChange} />
                            </label>

                            <div className="mt-4 space-y-2">
                                {files.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between rounded border p-2">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            <span className="truncate text-sm">{item.name}</span>
                                        </div>

                                        <button type="button" onClick={() => removeFile(i)} className="text-red-600 hover:text-red-700 cursor-pointer">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}

                                {files.length === 0 && <p className="text-muted-foreground text-center text-sm">No agreements uploaded</p>}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                                {isSubmitting ? (
                                    <>
                                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Client'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
