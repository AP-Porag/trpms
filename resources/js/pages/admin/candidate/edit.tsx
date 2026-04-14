import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router } from '@inertiajs/react';
import { FileText, RotateCw, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs = [{ title: 'Edit Candidate', href: '/candidates/edit' }];

const candidateSchema = z.object({
    first_name: z.string().min(2),
    last_name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5),
    address: z.string(),
    file: z.any().optional(),
});

export default function Edit({ candidate }) {
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

    const newFile = watch('file');

    const submit = async (data) => {
        return new Promise((resolve) => {
            router.post(
                route('candidates.update', candidate.id),
                {
                    ...data,
                    _method: 'PUT',
                },
                {
                    forceFormData: true,
                    onFinish: () => resolve(),
                },
            );
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
                                ].map(([f, l]) => (
                                    <div key={f} className="grid gap-2">
                                        <Label>{l}</Label>
                                        <Input {...register(f)} className={cn(errors[f] && 'border-red-500')} />
                                        {errors[f] && <span className="text-sm text-red-500">{errors[f].message}</span>}
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

                            <label className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed text-center">
                                <Upload className="mb-1 h-5 w-5" />
                                <span className="text-xs">Replace</span>
                                <input type="file" hidden onChange={(e) => setValue('file', e.target.files[0])} />
                            </label>

                            {newFile && (
                                <div className="mt-3 flex items-center gap-2 text-sm">
                                    <FileText className="h-4 w-4" />
                                    <span>{newFile.name}</span>
                                </div>
                            )}
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
