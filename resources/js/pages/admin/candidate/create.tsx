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
import { toast } from 'sonner';
import { z } from 'zod';

const breadcrumbs = [{ title: 'Create Candidate', href: '/candidates/create' }];

// const candidateSchema = z.object({
//     first_name: z.string().min(2, 'First name is required'),
//     last_name: z.string().min(2, 'Last name is required'),
//     email: z.string().email(),
//     phone: z.string().min(5),
//     address: z.string().min(3),
//     file: z.any().refine((f) => f instanceof File, {
//         message: 'Resume is required',
//     }),
// });

const candidateSchema = z.object({
    first_name: z.string().min(2, 'First name is required'),
    last_name: z.string().min(2, 'Last name is required'),
    email: z.string().email(),
    phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
    address: z.string().min(3),
    expected_salary: z.string().optional(),

    file: z.array(z.any()).optional(),
});

export default function Create() {
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(candidateSchema),
    });

    // const resume = watch('file');
    const resumes = watch('file');
    const [files, setFiles] = useState<File[]>([]);

    const submit = async (data) => {
        return new Promise((resolve) => {
            router.post(route('candidates.store'), data, {
                forceFormData: true,
                onError: (errs) => {
                    Object.keys(errs).forEach((k) => setError(k, { message: errs[k] }));
                    toast.error('Please fix the errors.');
                },
                onFinish: () => resolve(),
            });
        });
    };

    const removeFile = (index: number) => {
        const updated = resumes.filter((_, i) => i !== index);
        setFiles(updated);
        setValue('file', updated);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Candidate" />

            <div className="flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded-xl border p-5">
                    <form onSubmit={handleSubmit(submit)}>
                        {/* BASIC INFO */}
                        <div className="mb-6 rounded-xl bg-white p-6 shadow">
                            <h2 className="mb-4 text-lg font-semibold">Candidate Information</h2>

                            {/* <div className="grid gap-4 md:grid-cols-2">
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
                                        <Input {...register(f)} className={cn(errors[f] && 'border-red-500')} />
                                        {errors[f] && <span className="text-sm text-red-500">{errors[f].message}</span>}
                                    </div>
                                ))}
                            </div> */}

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

                                                <Input {...register(f)} className={cn(errors[f] && 'border-red-500', 'pr-24 pl-7')} />

                                                <span className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">k/per year</span>
                                            </div>
                                        ) : (
                                            <>
                                                <Input {...register(f)} className={cn(errors[f] && 'border-red-500')} />

                                                {errors[f] && <span className="text-sm text-red-500">{errors[f].message}</span>}
                                            </>
                                        )}

                                        {f === 'expected_salary' && errors[f] && <span className="text-sm text-red-500">{errors[f].message}</span>}
                                    </div>
                                ))}
                            </div>

                            {/*<div className="mt-4">*/}
                            {/*    <Label>Address</Label>*/}
                            {/*    <Input {...register('address')} />*/}
                            {/*</div>*/}
                        </div>

                        {/* RESUME */}
                        <div className="mb-6 rounded-xl bg-white p-6 shadow">
                            <h2 className="mb-4 text-lg font-semibold">Resume</h2>

                            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center">
                                <Upload className="mb-2 h-6 w-6" />
                                <span className="text-sm">Upload</span>
                                <input type="file" hidden multiple onChange={(e) => setValue('file', Array.from(e.target.files))} />
                                {/*<input type="file" hidden onChange={(e) => setValue('file', e.target.files[0])} />*/}
                            </label>

                            {/*{resume && (*/}
                            {/*    <div className="mt-3 flex items-center gap-2 text-sm">*/}
                            {/*        <FileText className="h-4 w-4" />*/}
                            {/*        <span className="truncate">{resume.name}</span>*/}
                            {/*    </div>*/}
                            {/*)}*/}
                            {resumes?.length > 0 && (
                                <div className="mt-3 space-y-1 text-sm">
                                    {resumes.map((file, index) => (
                                        // <div key={index} className="flex items-center gap-2">
                                        //     <FileText className="h-4 w-4" />
                                        //     <span className="truncate">{file.name}</span>
                                        // </div>
                                        <div key={index} className="flex items-center justify-between rounded border p-2">
                                            <div className="flex items-center gap-2">
                                                <FileText className="h-5 w-5" />
                                                <span className="truncate text-sm">{file.name}</span>
                                            </div>

                                            <button type="button" onClick={() => removeFile(index)}>
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {errors.file && <span className="text-sm text-red-500">{errors.file.message}</span>}
                        </div>

                        {/* SUBMIT */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                                {isSubmitting ? (
                                    <>
                                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Save Candidate'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
