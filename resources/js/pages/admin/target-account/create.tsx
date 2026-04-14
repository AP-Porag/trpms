import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { RotateCw } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { STATUS } from '@/utils/constants';

const breadcrumbs = [{ title: 'Create Target Account', href: '/target-accounts/create' }];

const prospectSchema = z.object({
    name: z.string().min(3, { message: 'Name is Required!' }),
    company_name: z.string().min(3, { message: 'Company name is required!' }),
    email: z.string().email(),
    phone: z.string().min(5),
    address: z.string().optional(),
    status: z.enum([STATUS.ACTIVE.toString(), STATUS.INACTIVE.toString()]),
});

export default function Create() {

    const {
        register,
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(prospectSchema),
        defaultValues: {
            status: STATUS.ACTIVE.toString(),
        },
    });

    const saveProspect = async (data) => {

        return new Promise((resolve) => {

            router.post(route('target-accounts.store'), data, {

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
            <Head title="Create Prospect" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border p-5">

                    <form onSubmit={handleSubmit(saveProspect)}>

                        <div className="mb-6 rounded-xl bg-white p-6 shadow dark:bg-gray-800">

                            <h2 className="mb-4 text-lg font-semibold">
                                Target Account Information
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

                            <div className="mt-4 grid gap-2">

                                <Label>Status</Label>

                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
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
                                    'Save Target Account'
                                )}

                            </Button>

                        </div>

                    </form>

                </div>
            </div>
        </AppLayout>
    );
}
