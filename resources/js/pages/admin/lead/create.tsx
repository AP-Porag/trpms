import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { RotateCw } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import MultiSelect, { MultiSelectOption } from '@/components/forms/MultiSelect';
import { STATUS } from '@/utils/constants';

const breadcrumbs = [{ title: 'Create Lead', href: '/leads/create' }];

const prospectSchema = z.object({
    name: z.string().min(3, { message: 'Name is Required!' }),
    company_name: z.string().min(3, { message: 'Company name is required!' }),
    industry_id: z.string().nullable().optional(),
    source_id: z.string().nullable().optional(),
    mpc: z.string().optional(),
    departments: z.array(z.string()).optional(),
    current_openings: z.string().optional(),
    status: z.enum([STATUS.ACTIVE.toString(), STATUS.INACTIVE.toString()]),
    note: z.string().optional(),
});

export default function Create({ industries = [], departments = [], source = [] }: any) {
    const {
        register,
        control,
        handleSubmit,
        setError,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(prospectSchema),
        defaultValues: {
            status: STATUS.ACTIVE.toString(),
            industry_id: '',
            departments: [],
        },
    });

    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

    /* ================= OPTIONS ================= */
    const departmentOptions: MultiSelectOption[] =
        departments?.map((item: any) => ({
            label: item.name,
            value: String(item.id),
        })) || [];

    const saveProspect = async (data) => {
        return new Promise((resolve) => {
            router.post(route('leads.store'), data, {
                onError: (errs) => {
                    Object.keys(errs).forEach((k) => setError(k, { message: errs[k] }));
                    toast.error('Please fix the errors in the form.');
                },

                onFinish: () => resolve(),
            });
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Lead" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border p-5">
                    <form onSubmit={handleSubmit(saveProspect)}>
                        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold">Lead Information</h2>

                            <div className="grid gap-4 md:grid-cols-3">
                                {[
                                    ['name', 'Name'],
                                    ['company_name', 'Company Name'],
                                    ['mpc', 'MPC'],
                                ].map(([f, l]) => (
                                    <div key={f} className="grid gap-2">
                                        <Label>{l}</Label>

                                        <Input {...register(f as any)} className={cn(errors[f] && 'border-red-500')} />

                                        {errors[f] && <span className="text-sm text-red-500">{errors[f].message}</span>}
                                    </div>
                                ))}

                                {/* INDUSTRY */}
                                <div className="grid gap-2">
                                    <Label>Industry</Label>

                                    <Controller
                                        name="industry_id"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value || ''} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Industry" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {industries.map((i: any) => (
                                                        <SelectItem key={i.id} value={String(i.id)}>
                                                            {i.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                {/* SOURCE */}
                                <div className="grid gap-2">
                                    <Label>Source</Label>

                                    <Controller
                                        name="source_id"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value || ''} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Source" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {source.map((i: any) => (
                                                        <SelectItem key={i.id} value={String(i.id)}>
                                                            {i.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

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
                                                    <SelectItem value={STATUS.ACTIVE.toString()}>Active</SelectItem>

                                                    <SelectItem value={STATUS.INACTIVE.toString()}>Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* ================= DEPARTMENTS (MULTISELECT + BADGES) ================= */}
                            <div className="mt-4 grid gap-2">
                                <Label>Departments</Label>
                                <MultiSelect
                                    options={departmentOptions}
                                    value={selectedDepartments}
                                    onChange={(val) => {
                                        const normalized = val.map(String);

                                        setSelectedDepartments(normalized);
                                        setValue('departments', normalized);
                                    }}
                                    placeholder="Select Departments"
                                />

                                {/* BADGES */}
                                {selectedDepartments.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedDepartments.map((id) => {
                                            const dept = departmentOptions.find((d) => d.value === id);

                                            return (
                                                <span key={id} className="rounded-full border bg-blue-100 px-3 py-1 text-xs text-blue-700">
                                                    {dept?.label}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 grid gap-2">
                                <Label>Current Openings</Label>
                                <Input {...register('current_openings')} />
                            </div>

                            {/* <div className="mt-4 grid gap-2">
                                <Label>Note</Label>
                                <Input {...register('note')} />
                            </div> */}
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                                {isSubmitting ? (
                                    <>
                                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Save Prospect'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
