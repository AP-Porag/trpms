import { useState } from 'react';
import { router } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

import {
    Command,
    CommandInput,
    CommandItem,
    CommandGroup,
    CommandEmpty,
} from '@/components/ui/command';

import { Plus } from 'lucide-react';

export default function AddCandidateToJobModal({ jobId }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [selected, setSelected] = useState(null);


    const loadDefaultCandidates = async () => {
        try {
            const response = await fetch(
                route('candidates.search', {
                    job_id: jobId,
                }),
                {
                    headers: {
                        Accept: 'application/json',
                    },
                },
            );

            if (!response.ok) return;

            const data = await response.json();
            setCandidates(data);
        } catch {
            setCandidates([]);
        }
    };

    const searchCandidates = async (query) => {
        setSearch(query);

        try {
            const response = await fetch(route('candidates.search', { q: query, job_id: jobId }), { headers: { Accept: 'application/json' } });

            if (!response.ok) {
                setCandidates([]);
                return;
            }

            const data = await response.json();
            setCandidates(data);
        } catch {
            setCandidates([]);
        }
    };



    const submit = () => {
        if (!selected) return;

        router.post(route('job-candidates.store'), {
            job_id: jobId,
            candidate_id: selected.id,
        }, {
            onSuccess: () => {
                setOpen(false);
                setSelected(null);
                setCandidates([]);
            },
            preserveScroll: true,
        });
    };

    return (
        <>
            <Button
                size='sm'
                className="cursor-pointer"
                onClick={() => {
                    setOpen(true);
                    loadDefaultCandidates();
                }}
            >
                <Plus className="mr-2 h-4 w-4" />
                Add Candidate
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Candidate to Job</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        <Label>Search Candidate</Label>

                        <Command>
                            <CommandInput placeholder="Search by name or email or phone..." value={search} onValueChange={searchCandidates} />

                            <CommandEmpty>No candidates found.</CommandEmpty>

                            <CommandGroup>
                                {candidates.map((c) => (
                                    <CommandItem key={c.id} onSelect={() => setSelected(c)}>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {c.first_name} - {c.last_name}
                                            </p>
                                            <p className="text-muted-foreground text-xs">{c.email}</p>
                                            <p className="text-muted-foreground text-xs">{c.phone}</p>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </Command>
                    </div>

                    {selected && (
                        <div className="rounded-md border p-3 text-sm">
                            Selected:
                            <strong className="ml-1">{selected.first_name} {selected.last_name}</strong>
                        </div>
                    )}

                    <DialogFooter>
                        <Button onClick={submit} disabled={!selected}>
                            Add to Job
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
