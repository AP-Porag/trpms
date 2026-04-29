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

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { ChevronsUpDown, RotateCw } from 'lucide-react';

import RichTextEditor from '@/components/forms/RichTextEditor';

import { JOB_FEE_TYPE, PRIORITY, STATUS } from '@/utils/constants';

const breadcrumbs = [{ title: 'Edit Job', href: '/jobs' }];

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

export default function Edit({ job, clients, departments }) {
    const editorRef = useRef(null);

    // ✅ FIX: state MUST be top-level (layout stability fix)
    const [clientOpen, setClientOpen] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            title: job?.title || '',
            client_id: job?.client_id ? String(job.client_id) : '',
            description: job?.description || '',
            department_id: job?.department_id ?? null,
            salary_range: job?.salary_range || '',
            fee_type: job?.fee_type || JOB_FEE_TYPE.PERCENTAGE,
            location: job?.location || '',
            priority: job?.priority || '',
            fee_value: job?.fee_value || '',
            status: job?.status || String(STATUS.ACTIVE),
        },
    });

    const saveJob = async (data) => {
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

        router.put(route('jobs.update', job.id), {
            ...data,
            description: html,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Job" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border p-5">
                    <form onSubmit={handleSubmit(saveJob)} className="space-y-6">
                        <h2 className="text-lg font-semibold">Edit Job Information</h2>

                        {/* GRID BLOCK */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            {/* CLIENT */}
                            <Controller
                                name="client_id"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid min-w-0 gap-2">
                                        <Label>Client</Label>

                                        <Popover open={clientOpen} onOpenChange={setClientOpen}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full min-w-0 justify-between overflow-hidden">
                                                    <span className="block min-w-0 truncate">
                                                        {clients.find((c) => String(c.id) === field.value)
                                                            ? `${clients.find((c) => String(c.id) === field.value)?.name} – ${clients.find((c) => String(c.id) === field.value)?.company_name}`
                                                            : 'Select client'}
                                                    </span>
                                                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>

                                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search client..." />
                                                    <CommandEmpty>No client found.</CommandEmpty>

                                                    <CommandGroup className="h-[200px] overflow-y-auto">
                                                        {clients.map((client) => (
                                                            <CommandItem
                                                                key={client.id}
                                                                value={client.name}
                                                                onSelect={() => {
                                                                    field.onChange(String(client.id));
                                                                    setClientOpen(false);
                                                                }}
                                                            >
                                                                {client.name} – {client.company_name}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                )}
                            />

                            {/* FEE TYPE */}
                            <Controller
                                name="fee_type"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid min-w-0 gap-2">
                                        <Label>Fee Type</Label>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Fee Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={JOB_FEE_TYPE.PERCENTAGE}>Percentage</SelectItem>
                                                <SelectItem value={JOB_FEE_TYPE.FIXED}>Fixed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            />

                            {/* FEE VALUE */}
                            <div className="grid min-w-0 gap-2">
                                <Label>Fee Value</Label>
                                <Input type="number" className="w-full" {...register('fee_value')} />
                            </div>

                            {/* DEPARTMENT */}
                            <Controller
                                name="department_id"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid min-w-0 gap-2">
                                        <Label>Department</Label>
                                        <Select value={field.value?.toString() || ''} onValueChange={(val) => field.onChange(Number(val))}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((d) => (
                                                    <SelectItem key={d.id} value={d.id.toString()}>
                                                        {d.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            />
                        </div>

                        {/* ROW 2 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Salary Range</Label>

                                <div className="relative">
                                    <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">$</span>

                                    <Input {...register('salary_range')} className="pr-24 pl-7" />

                                    <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">k/per year</span>
                                </div>
                            </div>

                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid gap-2">
                                        <Label>Status</Label>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Status" />
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

                        {/* ROW 3 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Location</Label>
                                <Input {...register('location')} />
                            </div>

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

                        {/* TITLE */}
                        <div className="grid gap-2">
                            <Label>Title</Label>
                            <Input {...register('title')} />
                        </div>

                        {/* DESCRIPTION */}
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <div className="grid gap-2">
                                    <Label>Description</Label>
                                    <RichTextEditor ref={editorRef} value={field.value || ''} onChange={field.onChange} />
                                </div>
                            )}
                        />

                        {/* SUBMIT */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                        Updating
                                    </>
                                ) : (
                                    'Update Job'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
