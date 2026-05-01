import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { FileText, RotateCw, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs = [{ title: 'Edit Candidate', href: '/candidates/edit' }];

const candidateSchema = z.object({
    first_name: z.string().min(2),
    last_name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    address: z.string(),
    expected_salary: z.string().min(1, 'Expected salary is required').regex(/^\d+$/, 'Salary must be a number'),
    file: z.any().optional(),
});

export default function Edit({ candidate }) {
    const [files, setFiles] = useState<File[]>([]);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(candidateSchema),
        defaultValues: candidate,
    });
    /* ================= FILE HANDLING (UNCHANGED) ================= */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selected = [...files, ...Array.from(e.target.files)];
        setFiles(selected);
        setValue('agreements', selected);
    };

    const removeFile = (index: number) => {
        const updated = files.filter((_, i) => i !== index);
        setFiles(updated);
        setValue('agreements', updated);
    };

    // const newFile = watch('file');

    const submit = (data) => {
        const formData = new FormData();

        formData.append('_method', 'PUT');
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('address', data.address);
        formData.append('expected_salary', data.expected_salary);

        // if (data.file instanceof File) {
        //     formData.append('file', data.file);
        // }
        // 🔹 NEW FILES upload
        files.forEach((file: File) => {
            formData.append('resumes[]', file);
        });

        router.post(route('candidates.update', candidate.id), formData, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Candidate" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border p-5">
                    <form onSubmit={handleSubmit(submit)}>
                        {/* INFO */}
                        <div className="mb-6 rounded-xl bg-white p-6 shadow">
                            <h2 className="mb-4 text-lg font-semibold">Candidate Information</h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                {[
                                    ['first_name', 'First Name'],
                                    ['last_name', 'Last Name'],
                                    ['email', 'Email'],
                                    ['phone', 'Phone'],
                                    ['expected_salary', 'Expected Salary'],
                                    ['address', 'Address'],
                                ].map(([f, l]) => (
                                    <div key={f} className="grid gap-2">
                                        <Label>{l}</Label>

                                        {f === 'expected_salary' ? (
                                            <div className="relative">
                                                <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">$</span>

                                                <Input
                                                    {...register(f as any)}
                                                    className={cn(errors?.[f as keyof typeof errors] && 'border-red-500', 'pr-24 pl-7')}
                                                />

                                                <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">k/per year</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Input
                                                    {...register(f as any)}
                                                    className={cn(errors?.[f as keyof typeof errors] && 'border-red-500')}
                                                />

                                                {errors?.[f as keyof typeof errors] && (
                                                    <span className="text-sm text-red-500">{(errors as any)[f]?.message}</span>
                                                )}
                                            </>
                                        )}

                                        {f === 'expected_salary' && errors?.[f as keyof typeof errors] && (
                                            <span className="text-sm text-red-500">{(errors as any)[f]?.message}</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4">
                                <Label>Address</Label>
                                <Input {...register('address')} />
                            </div>
                        </div>

                        {/* RESUME */}
                        <div className="mb-6 rounded-xl bg-white p-6 shadow">
                            <h2 className="mb-4 text-lg font-semibold">Resume</h2>

                            {candidate.resume_path && !newFile && (
                                <div className="mb-3 flex items-center gap-2 text-sm">
                                    <FileText className="h-4 w-4" />
                                    <a href={`/storage/${candidate.resume_path}`} target="_blank" className="underline">
                                        {candidate.original_name}
                                    </a>
                                </div>
                            )}

                            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center">
                                <Upload className="mb-2 h-6 w-6" />
                                <span className="text-sm">Upload agreements</span>
                                <input type="file" multiple hidden onChange={handleFileChange} />
                            </label>

                            <div className="mt-4 space-y-2">
                                {files.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between rounded border p-2">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            <span className="truncate text-sm">{file.name}</span>
                                        </div>

                                        <button type="button" onClick={() => removeFile(i)}>
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        </button>
                                    </div>
                                ))}
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
                                    'Update Candidate'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
