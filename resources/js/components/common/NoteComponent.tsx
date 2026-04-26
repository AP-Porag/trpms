import AddNoteModal from '@/components/notes/AddNoteModal';
import NotesTimeline from '@/components/notes/NotesTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NoteComponent({ noteableType, noteableId, notes }) {
    return (
        <div className="">
            <div className="mb-3 flex justify-between">
                <div></div>
                <AddNoteModal noteableType={noteableType} noteableId={noteableId} />
            </div>

            <Card className="bg-gray-100">
                <CardHeader>
                    <CardTitle>Notes</CardTitle>
                </CardHeader>

                <hr className="-mt-2 border-1 border-gray-200" />

                <CardContent>
                    <NotesTimeline notes={notes} />
                </CardContent>
            </Card>
        </div>
    );
}
