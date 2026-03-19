import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function SearchableClientSelect({ clients = [], value, onChange }) {
    const [open, setOpen] = useState(false);

    const selectedClient = clients.find((c) => c.id.toString() === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-64 justify-between">
                    {selectedClient ? selectedClient.name : 'Select Client'}

                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-64 p-0">
                <Command>
                    {/* 🔍 Search Input */}
                    <CommandInput placeholder="Search client..." />

                    <CommandEmpty>No client found.</CommandEmpty>

                    <CommandGroup>
                        {/* ALL OPTION */}
                        <CommandItem
                            value="all"
                            onSelect={() => {
                                onChange('');
                                setOpen(false);
                            }}
                        >
                            All Clients
                            <Check className={`ml-auto ${value === '' ? 'opacity-100' : 'opacity-0'}`} />
                        </CommandItem>

                        {/* CLIENT LIST */}
                        {clients.map((client) => (
                            <CommandItem
                                key={client.id}
                                value={client.name}
                                onSelect={() => {
                                    onChange(client.id.toString());
                                    setOpen(false);
                                }}
                            >
                                {client.name}

                                <Check className={`ml-auto ${value === client.id.toString() ? 'opacity-100' : 'opacity-0'}`} />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
