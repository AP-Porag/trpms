import type { MultiSelectOption } from '@/components/forms/MultiSelect';
import MultiSelect from '@/components/forms/MultiSelect';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { RotateCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { RATING, STATUS } from '@/utils/constants';

const breadcrumbs = [{ title: 'Create Client', href: '/clients/create' }];

/* ================= SCHEMA ================= */
const clientSchema = z.object({
    name: z.string().min(3, { message: 'Name name is required!' }),
    company_name: z.string().min(3, { message: 'Company name is required!' }),
    rating: z.string().optional(),
    industry_id: z.string().nullable().optional(),
    status: z.enum([STATUS.ACTIVE.toString(), STATUS.INACTIVE.toString()]),
    departments: z.array(z.string()).optional(),
    is_use_agency: z.boolean().optional(),
    current_openings: z.string().optional(),
    revenue_potential: z.string().min(3, { message: 'Revenue potential must be number!' }),
});

export default function Create({ industries = [], departments = [] }: any) {
    /* ================= STATE ================= */
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

    /* ================= OPTIONS ================= */
    const departmentOptions: MultiSelectOption[] =
        departments?.map((item: any) => ({
            label: item.name,
            value: String(item.id),
        })) || [];

    const {
        register,
        control,
        handleSubmit,
        setValue,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: '',
            company_name: '',
            revenue_potential: '',
            rating: '',
            industry_id: '',
            status: STATUS.ACTIVE.toString(),
            departments: [],
            is_use_agency: false,
        },
    });

    /* ================= REGISTER EXTRA FIELD ================= */
    useEffect(() => {
        register('departments');
    }, [register]);

    /* ================= SUBMIT ================= */
    const saveClient = (data: any) => {
        router.post(route('target-accounts.store'), data, {
            onError: (errs) => {
                Object.keys(errs).forEach((k) => setError(k as any, { message: errs[k] }));
                toast.error('Please fix the errors in the form.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Target Account" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border p-5">
                    <form onSubmit={handleSubmit(saveClient)}>
                        {/* ================= TARGET ACCOUNT INFO ================= */}
                        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold">Target Account Information</h2>

                            {/* <div className="grid gap-4 md:grid-cols-3">
                                {[
                                    ['name', 'Name'],
                                    ['company_name', 'Company Name'],
                                    ['current_openings', 'Current Openings'],
                                    ['revenue_potential', 'Revenue Potential'],
                                ].map(([f, l]) => (
                                    <div key={f} className="grid gap-2">
                                        <Label>{l}</Label>

                                        <Input {...register(f as any)} className={cn(errors[f as keyof typeof errors] && 'border-red-500')} />

                                        {errors[f as keyof typeof errors] && (
                                            <span className="text-sm text-red-500">{(errors[f as keyof typeof errors] as any)?.message}</span>
                                        )}
                                    </div>
                                ))}
                            </div> */}
                            <div className="grid gap-4 md:grid-cols-2">
                                {[
                                    ['name', 'Name'],
                                    ['company_name', 'Company Name'],
                                    ['current_openings', 'Current Openings'],
                                    ['revenue_potential', 'Revenue Potential'],
                                ].map(([f, l]) => (
                                    <div key={f} className="grid gap-2">
                                        <Label>{l}</Label>

                                        {f === 'revenue_potential' ? (
                                            <div className="relative">
                                                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">$</span>

                                                <Input
                                                    {...register(f as any)}
                                                    className={cn(errors[f as keyof typeof errors] && 'border-red-500', 'pr-24 pl-7')}
                                                />

                                                <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">k/year</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Input {...register(f as any)} className={cn(errors[f as keyof typeof errors] && 'border-red-500')} />

                                                {errors[f as keyof typeof errors] && (
                                                    <span className="text-sm text-red-500">{(errors[f as keyof typeof errors] as any)?.message}</span>
                                                )}
                                            </>
                                        )}

                                        {f === 'revenue_potential' && errors[f as keyof typeof errors] && (
                                            <span className="text-sm text-red-500">{(errors[f as keyof typeof errors] as any)?.message}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* ================= DEPARTMENTS ================= */}
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

                                {selectedDepartments.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedDepartments.map((id) => {
                                            const dept = departmentOptions.find((d) => d.value === id);

                                            return (
                                                <span key={id} className="rounded-md border bg-blue-100 px-3 py-1 text-xs text-blue-700">
                                                    {dept?.label}
                                                </span>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* ================= GRID ================= */}
                            <div className="mt-4 grid sm:grid-cols-2 gap-4">
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
                                                    <SelectItem value={STATUS.ACTIVE.toString()}>Active</SelectItem>
                                                    <SelectItem value={STATUS.INACTIVE.toString()}>Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                {/* RATINGS */}
                                <div className="grid gap-2">
                                    <Label>Ratings</Label>

                                    <Controller
                                        name="rating"
                                        control={control}
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select Rating" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={RATING.RATING_A.toString()}>A</SelectItem>
                                                    <SelectItem value={RATING.RATING_B.toString()}>B</SelectItem>
                                                    <SelectItem value={RATING.RATING_C.toString()}>C</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <br className="hidden sm:block"/>

                                {/* ================= CHECKBOX ================= */}
                                <div className="mt-4 flex items-center space-x-2">
                                    <Controller
                                        name="is_use_agency"
                                        control={control}
                                        render={({ field }) => <Checkbox checked={field.value} onCheckedChange={field.onChange} />}
                                    />
                                    <Label>Use Agency</Label>
                                </div>
                            </div>
                        </div>

                        {/* ================= SUBMIT ================= */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
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
