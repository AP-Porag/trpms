import { useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { X, PlusCircle } from "lucide-react";
import { toast } from 'sonner';

export default function AddNoteModal({ noteableType, noteableId }) {

    const [open,setOpen] = useState(false);
    const [note,setNote] = useState("");

    function submit(){

        router.post(
            route('notes.store'),
            {
                note,
                noteable_id: noteableId,
                noteable_type: noteableType,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Note added successfully');
                    setNote('');
                    setOpen(false);
                    router.reload({ only: ['placement'] });
                },
                onError: () => {
                    toast.error('Failed to add note');
                },
            },
        );

    }

    return (
        <>
            <Button
                onClick={()=>setOpen(true)}
                className="flex items-center gap-2"
            >
                <PlusCircle size={16}/>
                Add Note
            </Button>

            {open && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

                    <div className="w-[520px] rounded-xl bg-white p-6 shadow-xl">

                        <div className="flex items-center justify-between mb-4">

                            <h3 className="text-lg font-semibold">
                                Add Note
                            </h3>

                            <button onClick={()=>setOpen(false)}>
                                <X size={18}/>
                            </button>

                        </div>

                        <textarea
                            className="w-full rounded-lg border p-3 focus:ring-2 focus:ring-black"
                            rows="5"
                            placeholder="Write note..."
                            value={note}
                            onChange={(e)=>setNote(e.target.value)}
                        />

                        <div className="mt-5 flex justify-end gap-3">

                            <Button
                                variant="outline"
                                onClick={()=>setOpen(false)}
                            >
                                Cancel
                            </Button>

                            <Button onClick={submit}>
                                Save Note
                            </Button>

                        </div>

                    </div>

                </div>

            )}
        </>
    );

}
