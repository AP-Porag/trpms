import { router } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

import { CommandList } from 'cmdk';
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

        router.post(
            route('job-candidates.store'),
            {
                job_id: jobId,
                candidate_id: selected.id,
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    setSelected(null);
                    setCandidates([]);
                },
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Button
                size="sm"
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
                <DialogContent className="max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>Add Candidate to Job</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        <Label>Search Candidate</Label>

                        <Command>
                            <CommandInput placeholder="Search by name or email or phone..." value={search} onValueChange={searchCandidates} />

                            <CommandList className="h-[200px] overflow-y-auto">
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
                            </CommandList>
                        </Command>
                    </div>

                    {selected && (
                        <div className="rounded-md border p-3 text-sm">
                            Selected:
                            <strong className="ml-1">
                                {selected.first_name} {selected.last_name}
                            </strong>
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
