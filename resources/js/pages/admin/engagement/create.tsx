import AppLayout from '@/layouts/app-layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

import { ChevronsUpDown, RotateCw } from 'lucide-react';

import RichTextEditor from '@/components/forms/RichTextEditor';

// ✅ project-level constants
import { JOB_FEE_TYPE, PRIORITY, STATUS } from '@/utils/constants';

const breadcrumbs = [{ title: 'Create Job', href: '/jobs/create' }];

const jobSchema = z.object({
    title: z.string().min(3, 'Title is required'),
    client_id: z.string().min(1, 'Client is required'),
    description: z.string().min(3, 'Description is required'),
    department_id: z.number().nullable(),
    salary_range: z.string().min(3, 'Salary range is required'),
    fee_type: z.enum(Object.values(JOB_FEE_TYPE)),
    location: z.string().nullable().optional(),
    priority: z.string().nullable().optional(),
    fee_value: z.string().min(1, 'Fee value is required'),
    status: z.enum([String(STATUS.ACTIVE), String(STATUS.INACTIVE)]),
});

export default function Create({ clients, departments }) {
    const editorRef = useRef(null);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            fee_type: JOB_FEE_TYPE.PERCENTAGE,
            status: String(STATUS.ACTIVE),
        },
    });

    const saveJob = async (data) => {
        console.log(data);
        let html = data.description;

        const tempImages = editorRef.current?.editor?.storage?.tempImages || [];

        if (tempImages.length) {
            const formData = new FormData();
            formData.append('content', html);

            tempImages.forEach((img, i) => {
                formData.append(`images[${i}]`, img.file);
            });

            const response = await axios.post(route('editor.finalize'), formData);

            html = response.data.html;
        }

        console.log(html);
        router.post(route('jobs.store'), {
            ...data,
            description: html,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Job" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border p-5">
                    <form onSubmit={handleSubmit(saveJob)} className="space-y-6">
                        <h2 className="text-lg font-semibold">Job Information</h2>

                        {/* Client + Fee */}
                        <div className="grid grid-cols-4 gap-4">
                            {/* Client Combobox */}
                            <Controller
                                name="client_id"
                                control={control}
                                render={({ field }) => {
                                    const [open, setOpen] = useState(false);

                                    return (
                                        <div className="grid min-w-0 gap-2 md:col-span-1">
                                            <Label>Client</Label>

                                            <Popover open={open} onOpenChange={setOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" role="combobox" className="w-full justify-between overflow-hidden">
                                                        <span className="truncate">
                                                            {field.value
                                                                ? (() => {
                                                                      const c = clients.find((x) => String(x.id) === field.value);
                                                                      return c ? `${c.name} – ${c.company_name}` : 'Select client';
                                                                  })()
                                                                : 'Select client'}
                                                        </span>

                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search client..." />
                                                        <CommandEmpty>No client found.</CommandEmpty>

                                                        <CommandGroup>
                                                            {clients.map((client) => (
                                                                <CommandItem
                                                                    key={client.id}
                                                                    value={`${client.name} ${client.company_name}`}
                                                                    onSelect={() => {
                                                                        field.onChange(String(client.id));
                                                                        setOpen(false);
                                                                    }}
                                                                >
                                                                    <span className="truncate">
                                                                        {client.name} – {client.company_name}
                                                                    </span>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>

                                            {errors.client_id && <span className="text-sm text-red-500">{errors.client_id.message}</span>}
                                        </div>
                                    );
                                }}
                            />

                            {/* Fee Type */}
                            <Controller
                                name="fee_type"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid gap-2">
                                        <Label>Fee Type</Label>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={JOB_FEE_TYPE.PERCENTAGE}>Percentage</SelectItem>
                                                <SelectItem value={JOB_FEE_TYPE.FIXED}>Fixed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            />

                            {/* Fee Value */}
                            <div className="grid gap-2">
                                <Label>Fee Value</Label>
                                <Input type="number" {...register('fee_value')} />
                                {errors.fee_value && <span className="text-sm text-red-500">{errors.fee_value.message}</span>}
                            </div>

                            {/* Department */}
                            <Controller
                                name="department_id"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid gap-2">
                                        <Label>Department</Label>

                                        <Select value={field.value?.toString()} onValueChange={(val) => field.onChange(Number(val))}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {departments?.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Salary Range */}
                            {/* <div className="grid gap-2">
                                <Label>Salary Range</Label>
                                <Input
                                    type="text"
                                    {...register('salary_range', {
                                        setValueAs: (v) => v?.toString(),
                                    })}
                                />
                                <span></span>
                                {errors.fee_value && <span className="text-sm text-red-500">{errors.salary_range.message}</span>}
                            </div> */}

                            <div className="grid gap-2">
                                <Label>Salary Range</Label>

                                <div className="relative">
                                    {/* Left $ prefix */}
                                    <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">$</span>

                                    <Input
                                        type="text"
                                        {...register('salary_range', {
                                            setValueAs: (v) => v?.toString(),
                                        })}
                                        className="pr-24 pl-7"
                                    />

                                    {/* Right suffix */}
                                    <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">k/per year</span>
                                </div>

                                {errors.salary_range && <span className="text-sm text-red-500">{errors.salary_range.message}</span>}
                            </div>

                            {/* Status */}
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid gap-2">
                                        <Label>Status</Label>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={String(STATUS.ACTIVE)}>Active</SelectItem>
                                                <SelectItem value={String(STATUS.INACTIVE)}>Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {/* Location */}
                            <div className="grid gap-2">
                                <Label>Location</Label>
                                <Input {...register('location')} />
                                {errors.location && <span className="text-sm text-red-500">{errors.location.message}</span>}
                            </div>

                            {/* Priority */}
                            <Controller
                                name="priority"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid gap-2">
                                        <Label>Priority</Label>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Priority" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={String(PRIORITY.HIGH)}>High</SelectItem>
                                                <SelectItem value={String(PRIORITY.MEDIUM)}>Medium</SelectItem>
                                                <SelectItem value={String(PRIORITY.LOW)}>Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            />
                        </div>

                        {/* Title */}
                        <div className="grid gap-2">
                            <Label>Title</Label>
                            <Input {...register('title')} />
                            {errors.title && <span className="text-sm text-red-500">{errors.title.message}</span>}
                        </div>

                        {/* Description */}
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <div className="grid gap-2">
                                    <Label>Description</Label>
                                    <RichTextEditor ref={editorRef} value={field.value || ''} onChange={field.onChange} />
                                    {errors.description && <span className="text-sm text-red-500">{errors.description.message}</span>}
                                </div>
                            )}
                        />

                        {/* Submit */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                                {isSubmitting ? (
                                    <>
                                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                        Processing
                                    </>
                                ) : (
                                    'Save Job'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
