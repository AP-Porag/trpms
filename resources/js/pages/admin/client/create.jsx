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

import { CLIENT_TYPE, JOB_FEE_TYPE, STATUS } from '@/utils/constants';

const breadcrumbs = [{ title: 'Create Client', href: '/clients/create' }];

const clientSchema = z
    .object({
        name: z.string().min(3, { message: 'Name is Required!' }),
        company_name: z.string().min(3, { message: 'Company name is required!' }),
        email: z.string().email(),
        phone: z.string().min(10),
        address: z.string().optional(),

        client_type: z.enum([CLIENT_TYPE.RETAINER, CLIENT_TYPE.CONTINGENCY]),

        fee_value: z.string().min(1, { message: 'Fee value is required' }),

        status: z.enum([STATUS.ACTIVE.toString(), STATUS.INACTIVE.toString()]),

        agreement_type: z.string().optional(),
        signed_date: z.string().optional(),
        agreements: z.any().optional(),
    })
    .superRefine((data, ctx) => {
        const hasType = !!data.agreement_type;
        const hasDate = !!data.signed_date;
        const hasFiles = Array.isArray(data.agreements) && data.agreements.length > 0;

        const any = hasType || hasDate || hasFiles;
        const all = hasType && hasDate && hasFiles;

        if (any && !all) {
            if (!hasType)
                ctx.addIssue({
                    path: ['agreement_type'],
                    message: 'Agreement type is required',
                });
            if (!hasDate)
                ctx.addIssue({
                    path: ['signed_date'],
                    message: 'Signed date is required',
                });
            if (!hasFiles)
                ctx.addIssue({
                    path: ['agreements'],
                    message: 'At least one file is required',
                });
        }
    });

export default function Create() {

    const {
        register,
        control,
        handleSubmit,
        setValue,
        setError,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            client_type: CLIENT_TYPE.RETAINER,
            status: STATUS.ACTIVE.toString(),
        },
    });

    const [files, setFiles] = useState([]);

    const clientType = watch('client_type');

    useEffect(() => {
        register('agreements');
    }, [register]);

    /*
    |--------------------------------------------------------------------------
    | Auto clear fee when switching client type
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setValue('fee_value', '');
    }, [clientType]);

    const handleFileChange = (e) => {
        const selected = [...files, ...Array.from(e.target.files)];
        setFiles(selected);
        setValue('agreements', selected);
    };

    const removeFile = (index) => {
        const updated = files.filter((_, i) => i !== index);
        setFiles(updated);
        setValue('agreements', updated);
    };

    const saveClient = async (data) => {
        return new Promise((resolve) => {

            const payload = {
                ...data,
                fee_type:
                    data.client_type === CLIENT_TYPE.CONTINGENCY
                        ? JOB_FEE_TYPE.PERCENTAGE
                        : JOB_FEE_TYPE.FIXED,
                agreements: files,
            };

            router.post(route('clients.store'), payload, {
                forceFormData: true,
                onError: (errs) => {
                    Object.keys(errs).forEach((k) =>
                        setError(k, { message: errs[k] })
                    );
                    toast.error('Please fix the errors in the form.');
                },
                onFinish: () => resolve(),
            });
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Client" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border p-5">

                    <form onSubmit={handleSubmit(saveClient)}>

                        {/* CLIENT INFO */}

                        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">

                            <h2 className="mb-4 text-lg font-semibold">
                                Client Information
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                {[
                                    ['name', 'Name'],
                                    ['company_name', 'Company Name'],
                                    ['email', 'Email'],
                                    ['phone', 'Phone'],
                                ].map(([f, l]) => (
                                    <div key={f} className="grid gap-2">
                                        <Label>{l}</Label>

                                        <Input
                                            {...register(f)}
                                            className={cn(errors[f] && 'border-red-500')}
                                        />

                                        {errors[f] && (
                                            <span className="text-sm text-red-500">
{errors[f].message}
</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 grid gap-2">
                                <Label>Address</Label>
                                <Input {...register('address')} />
                            </div>

                            <div className="mt-4 grid gap-4 md:grid-cols-3">

                                {/* CLIENT TYPE */}

                                <div className="grid gap-2">
                                    <Label>Client Type</Label>

                                    <Controller
                                        name="client_type"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value={CLIENT_TYPE.RETAINER}>
                                                        Retainer
                                                    </SelectItem>

                                                    <SelectItem value={CLIENT_TYPE.CONTINGENCY}>
                                                        Contingency
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />

                                </div>

                                {/* FEE VALUE */}

                                <div className="grid gap-2">

                                    <Label>
                                        {clientType === CLIENT_TYPE.CONTINGENCY
                                            ? 'Placement Fee (%)'
                                            : 'Monthly Retainer ($)'}
                                    </Label>

                                    <div className="relative">

                                        {clientType === CLIENT_TYPE.RETAINER && (
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
$
</span>
                                        )}

                                        <Input
                                            type="number"
                                            min={0}
                                            max={clientType === CLIENT_TYPE.CONTINGENCY ? 100 : undefined}
                                            className={cn(
                                                clientType === CLIENT_TYPE.RETAINER && 'pl-7',
                                                errors.fee_value && 'border-red-500'
                                            )}
                                            placeholder={
                                                clientType === CLIENT_TYPE.CONTINGENCY
                                                    ? 'Fee %'
                                                    : 'Retainer Amount'
                                            }
                                            {...register('fee_value', {
                                                onChange: (e) => {

                                                    let value = e.target.value;

                                                    if (clientType === CLIENT_TYPE.CONTINGENCY) {
                                                        value = Math.min(100, Math.max(0, value));
                                                    }

                                                    setValue('fee_value', value);
                                                },
                                            })}
                                        />

                                        {clientType === CLIENT_TYPE.CONTINGENCY && (
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
%
</span>
                                        )}

                                    </div>

                                    {errors.fee_value && (
                                        <span className="text-sm text-red-500">
{errors.fee_value.message}
</span>
                                    )}

                                </div>

                                {/* STATUS */}

                                <div className="grid gap-2">
                                    <Label>Status</Label>

                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value={STATUS.ACTIVE.toString()}>
                                                        Active
                                                    </SelectItem>

                                                    <SelectItem value={STATUS.INACTIVE.toString()}>
                                                        Inactive
                                                    </SelectItem>
                                                </SelectContent>

                                            </Select>
                                        )}
                                    />

                                </div>

                            </div>

                        </div>

                        {/* AGREEMENTS */}

                        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">

                            <h2 className="mb-4 text-lg font-semibold">
                                Client Agreements
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">

                                <div className="grid gap-2">
                                    <Label>Agreement Type</Label>

                                    <Input {...register('agreement_type')} />

                                    {errors.agreement_type && (
                                        <span className="text-sm text-red-500">
{errors.agreement_type.message}
</span>
                                    )}
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

                                <span className="text-sm">
Upload agreements
</span>

                                <input
                                    type="file"
                                    multiple
                                    hidden
                                    onChange={handleFileChange}
                                />

                            </label>

                            {errors.agreements && (
                                <span className="text-sm text-red-500">
{errors.agreements.message}
</span>
                            )}

                            <div className="mt-4 space-y-2">

                                {files.map((file, i) => (

                                    <div
                                        key={i}
                                        className="flex items-center justify-between rounded border p-2"
                                    >

                                        <div className="flex items-center gap-2">

                                            <FileText className="h-5 w-5" />

                                            <span className="truncate text-sm">
{file.name}
</span>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeFile(i)}
                                            className="cursor-pointer"
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </button>

                                    </div>

                                ))}

                            </div>

                        </div>

                        {/* SUBMIT */}

                        <div className="flex justify-end">

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="cursor-pointer"
                            >

                                {isSubmitting ? (
                                    <>
                                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Save Client'
                                )}

                            </Button>

                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

