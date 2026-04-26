import { DATE_PRESETS, formatDateUS } from '@/utils/helpers';
import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function NotesTimeline({ notes = [] }) {
    function deleteNote(id) {
        router.delete(route('notes.destroy', id), {
            preserveScroll: true,

            onSuccess: () => {
                toast.success('Note deleted successfully');
            },

            onError: () => {
                toast.error('Failed to delete note');
            },
        });
    }

    if (!notes.length) {
        return <div className="text-muted-foreground text-sm">No notes yet</div>;
    }

    return (
        <div className="space-y-4">
            {notes.map((note) => (
                <div key={note.id} className="flex gap-4">
                    {/* timeline dot */}
                    <div className="mt-2 h-3 w-3 rounded-full bg-black"></div>

                    {/* note card */}
                    <div className="flex-1 rounded-lg border bg-white p-4 shadow-sm">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-gray-100 bg-gray-200 px-3 py-1 text-sm font-medium text-gray-500">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                {note.author_name}
                            </span>
                            <button
                                onClick={() => deleteNote(note.id)}
                                className="rounded-full bg-gray-200 p-2 text-red-500 hover:bg-gray-300 hover:text-red-700"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="text-sm text-gray-700">{note.note}</div>

                        <div className="text-muted-foreground mt-2 flex justify-between text-xs">
                            <span></span>
                            <span> {formatDateUS(note.created_at, DATE_PRESETS.SHORT)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
