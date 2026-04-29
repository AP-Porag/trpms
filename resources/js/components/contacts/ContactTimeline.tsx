import { DATE_PRESETS, formatDateUS } from '@/utils/helpers';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactTimeline({ contacts = [], client }) {
    console.log(client);
    // ================= DELETE =================
    function deleteContact(id: number) {
        router.delete(route('contacts.destroy', id), {
            preserveScroll: true,

            onSuccess: () => {
                toast.success('Contact deleted successfully');
            },

            onError: () => {
                toast.error('Failed to delete contact');
            },
        });
    }

    // function toggleHiringManager(contact: any, clientId: number) {
    //     router.post(
    //         route('clients.setHiringManager', clientId),
    //         {
    //             contact_id: contact.id,
    //         },
    //         {
    //             preserveScroll: true,
    //             onSuccess: () => {
    //                 toast.success('Hiring manager updated');
    //             },
    //             onError: () => {
    //                 toast.error('Failed to update hiring manager');
    //             },
    //         },
    //     );
    // }

    function toggleHiringManager(contact: any) {
        router.post(
            route('clients.setHiringManager', client.id),
            {
                contact_id: contact.id,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Hiring manager updated');
                },
                onError: () => {
                    toast.error('Failed to update hiring manager');
                },
            },
        );
    }

    // ================= EMPTY STATE =================
    if (!contacts || contacts.length === 0) {
        return <div className="text-muted-foreground text-sm">No contacts yet</div>;
    }

    // ================= UI =================
    return (
        <div className="space-y-4">
            {contacts.map((contact: any) => (
                <div key={contact.id} className="flex gap-4">
                    {/* timeline dot */}
                    <div className="mt-2 h-3 w-3 rounded-full bg-black"></div>

                    {/* contact card */}
                    <div className="flex-1 rounded-lg border bg-white p-4 shadow-sm">
                        <div className="mb-2 flex items-center justify-between">
                            {/* name */}
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-100 bg-gray-200 px-3 py-1 text-sm font-medium text-gray-600">
                                {contact.author_name || 'N/A'}
                            </span>

                            {/* delete */}
                            <button
                                onClick={() => deleteContact(contact.id)}
                                className="rounded-full bg-gray-200 p-2 text-red-500 hover:bg-gray-300 hover:text-red-700"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="mb-2">
                            {contact.contactable_type === 'client' && (
                                <div className="mt-3 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={client.hiring_manager_contact_id === contact.id}
                                        onChange={() => toggleHiringManager(contact, client.id)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-sm text-gray-700">Set Hiring Manager</span>
                                </div>
                            )}
                        </div>

                        {/* contact value */}
                        <div className="text-sm text-gray-700">
                            <span className="font-bold">Person Name: </span>
                            {contact.name || '—'}
                        </div>
                        <div className="text-sm text-gray-700">
                            <span className="font-bold">Contact Type:</span> {contact.type || '—'}
                        </div>
                        <div className="text-sm text-gray-700">
                            <span className="font-bold">Contact:</span> {contact.contact || '—'}
                        </div>

                        {/* footer */}
                        <div className="text-muted-foreground mt-2 flex justify-end text-xs">
                            {contact.created_at ? formatDateUS(contact.created_at, DATE_PRESETS.SHORT) : ''}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
