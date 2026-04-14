import { useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';

import { ChevronsUpDown, RotateCw } from 'lucide-react';
import RichTextEditor from '@/components/forms/RichTextEditor';

import { JOB_FEE_TYPE, STATUS } from '@/utils/constants';

const breadcrumbs = [
    { title: 'Edit Job', href: '#' },
];

const jobSchema = z.object({
    title: z.string().min(3, 'Title is required'),
    client_id: z.string().min(1, 'Client is required'),
    description: z.string().min(3, 'Description is required'),
    fee_type: z.enum(Object.values(JOB_FEE_TYPE)),
    fee_value: z.string().min(1, 'Fee value is required'),
    status: z.enum([String(STATUS.ACTIVE), String(STATUS.INACTIVE)]),
});

export default function Edit({ job, clients }) {
    const editorRef = useRef(null);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            title: job.title,
            client_id: String(job.client_id),
            description: job.description, // ✅ HTML from DB
            fee_type: job.fee_type,
            fee_value: job.fee_value,
            status: String(job.status),
        },
    });

    const updateJob = async (data) => {
        let html = data.description;

        // only NEW images (temp ones)
        const tempImages =
            editorRef.current?.editor?.storage?.tempImages || [];

        if (tempImages.length) {
            const formData = new FormData();
            formData.append('content', html);

            tempImages.forEach((img, i) => {
                formData.append(`images[${i}]`, img.file);
            });

            const response = await axios.post(
                route('editor.finalize'),
                formData
            );

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
                    <form
                        onSubmit={handleSubmit(updateJob)}
                        className="space-y-6"
                    >
                        <h2 className="text-lg font-semibold">
                            Edit Job
                        </h2>

                        {/* Client + Fee */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            {/* Client Combobox */}
                            <Controller
                                name="client_id"
                                control={control}
                                render={({ field }) => {
                                    const [open, setOpen] = useState(false);

                                    const selectedClient = clients.find(
                                        c => String(c.id) === field.value
                                    );

                                    return (
                                        <div className="md:col-span-1 grid gap-2 min-w-0">
                                            <Label>Client</Label>

                                            <Popover
                                                open={open}
                                                onOpenChange={setOpen}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className="w-full justify-between overflow-hidden"
                                                    >
                                                        <span className="truncate">
                                                            {selectedClient
                                                                ? `${selectedClient.name} – ${selectedClient.company_name}`
                                                                : 'Select client'}
                                                        </span>
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent
                                                    align="start"
                                                    className="w-[--radix-popover-trigger-width] p-0"
                                                >
                                                    <Command>
                                                        <CommandInput placeholder="Search client..." />
                                                        <CommandEmpty>
                                                            No client found.
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {clients.map(
                                                                (client) => (
                                                                    <CommandItem
                                                                        key={
                                                                            client.id
                                                                        }
                                                                        value={`${client.name} ${client.company_name}`}
                                                                        onSelect={() => {
                                                                            field.onChange(
                                                                                String(
                                                                                    client.id
                                                                                )
                                                                            );
                                                                            setOpen(
                                                                                false
                                                                            );
                                                                        }}
                                                                    >
                                                                        <span className="truncate">
                                                                            {
                                                                                client.name
                                                                            }{' '}
                                                                            –{' '}
                                                                            {
                                                                                client.company_name
                                                                            }
                                                                        </span>
                                                                    </CommandItem>
                                                                )
                                                            )}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>

                                            {errors.client_id && (
                                                <span className="text-sm text-red-500">
                                                    {
                                                        errors.client_id
                                                            .message
                                                    }
                                                </span>
                                            )}
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
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={JOB_FEE_TYPE.PERCENTAGE}>
                                                    Percentage
                                                </SelectItem>
                                                <SelectItem value={JOB_FEE_TYPE.FIXED}>
                                                    Fixed
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            />

                            {/* Fee Value */}
                            <div className="grid gap-2">
                                <Label>Fee Value</Label>
                                <Input
                                    type="number"
                                    {...register('fee_value')}
                                />
                                {errors.fee_value && (
                                    <span className="text-sm text-red-500">
                                        {errors.fee_value.message}
                                    </span>
                                )}
                            </div>

                            {/* Status */}
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid gap-2">
                                        <Label>Status</Label>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={String(STATUS.ACTIVE)}>
                                                    Active
                                                </SelectItem>
                                                <SelectItem value={String(STATUS.INACTIVE)}>
                                                    Inactive
                                                </SelectItem>
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
                            {errors.title && (
                                <span className="text-sm text-red-500">
                                    {errors.title.message}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <div className="grid gap-2">
                                    <Label>Description</Label>
                                    <RichTextEditor
                                        ref={editorRef}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                    {errors.description && (
                                        <span className="text-sm text-red-500">
                                            {
                                                errors.description
                                                    .message
                                            }
                                        </span>
                                    )}
                                </div>
                            )}
                        />

                        {/* Submit */}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="cursor-pointer"
                            >
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
