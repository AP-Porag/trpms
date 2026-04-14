import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { RotateCw } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { STATUS } from '@/utils/constants';

const breadcrumbs = [{ title: 'Edit Target Account', href: '#' }];

const prospectSchema = z.object({
    name: z.string().min(3, { message: 'Name is required' }),
    company_name: z.string().min(3, { message: 'Company name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(5, { message: 'Phone is required' }),
    address: z.string().optional(),
    status: z.enum([STATUS.ACTIVE.toString(), STATUS.INACTIVE.toString()]),
});

export default function Edit({ prospect }) {
    const {
        register,
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(prospectSchema),
    });

    /*
    |--------------------------------------------------------------------------
    | Populate Form Values
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (prospect) {
            reset({
                name: prospect.name || '',
                company_name: prospect.company_name || '',
                email: prospect.email || '',
                phone: prospect.phone || '',
                address: prospect.address || '',
                status: prospect.status?.toString() || STATUS.ACTIVE.toString(),
            });
        }
    }, [prospect, reset]);

    /*
    |--------------------------------------------------------------------------
    | Update Prospect
    |--------------------------------------------------------------------------
    */

    const updateProspect = async (data) => {
        return new Promise((resolve) => {
            router.post(
                route('target-accounts.update', prospect.id),
                {
                    ...data,
                    _method: 'PUT',
                },
                {
                    onError: (errs) => {
                        Object.keys(errs).forEach((k) => setError(k, { message: errs[k] }));

                        toast.error('Please fix the errors in the form.');
                    },

                    onFinish: () => resolve(),
                },
            );
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Target Account" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border p-5">
                    <form onSubmit={handleSubmit(updateProspect)}>
                        {/* Prospect Info */}

                        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">
                            <h2 className="mb-4 text-lg font-semibold">Target Account Information</h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                {[
                                    ['name', 'Name'],
                                    ['company_name', 'Company Name'],
                                    ['email', 'Email'],
                                    ['phone', 'Phone'],
                                ].map(([field, label]) => (
                                    <div key={field} className="grid gap-2">
                                        <Label>{label}</Label>

                                        <Input {...register(field)} className={cn(errors[field] && 'border-red-500')} />

                                        {errors[field] && <span className="text-sm text-red-500">{errors[field].message}</span>}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 grid gap-2">
                                <Label>Address</Label>

                                <Input {...register('address')} />
                            </div>

                            <div className="mt-4 grid gap-4 md:grid-cols-3">
                                {/* Status */}

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
                        </div>

                        {/* Submit */}

                        <div className="flex justify-end gap-2">

                            <Button
                                type="button"
                                onClick={() => router.visit(route('clients.edit', prospect.id))}
                                className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                            >
                                Convert to Prospect
                            </Button>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="cursor-pointer"
                            >

                                {isSubmitting ? (
                                    <>
                                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Target Account'
                                )}

                            </Button>

                        </div>

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
