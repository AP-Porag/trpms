import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function ContactForm() {
    const { contacts } = usePage().props as any;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        contact_type: '',
        contact: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/app/client-contacts', {
            onSuccess: () => {
                reset(); // form clear after submit
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Client Contact" />

            <div className="mx-auto max-w-3xl space-y-8 p-6">
                {/* FORM */}
                <div className="space-y-6 rounded-xl border bg-white p-6">
                    <h2 className="text-xl font-semibold">Add Client Contact</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Contact Type</Label>
                            <Select value={data.contact_type} onValueChange={(value) => setData('contact_type', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="phone">Phone</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.contact_type && <p className="text-sm text-red-500">{errors.contact_type}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Contact</Label>
                            <Input value={data.contact} onChange={(e) => setData('contact', e.target.value)} />
                            {errors.contact && <p className="text-sm text-red-500">{errors.contact}</p>}
                        </div>

                        <Button type="submit" disabled={processing}>
                            Save Contact
                        </Button>
                    </form>
                </div>

                {/* CONTACT LIST */}
                <div className="rounded-xl border bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold">Saved Contacts</h2>

                    {contacts?.length ? (
                        <div className="space-y-3">
                            {contacts.map((item: any) => (
                                <div key={item.id} className="flex justify-between border-b pb-2">
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.contact_type} • {item.contact}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No contacts found</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
