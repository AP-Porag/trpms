"use client"
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

function formatDate(date) {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

function isValidDate(date) {
    if (!date) return false;
    return !isNaN(date.getTime());
}

export default function DatePicker({ label = 'Signed Date', value, onChange, error }) {
    const [open, setOpen] = React.useState(false);

    const parsedDate = value ? new Date(value) : undefined;

    const [date, setDate] = React.useState(parsedDate);
    const [month, setMonth] = React.useState(parsedDate);
    const [inputValue, setInputValue] = React.useState(formatDate(parsedDate));

    // Sync external value (important for Edit form)
    React.useEffect(() => {
        const d = value ? new Date(value) : undefined;
        setDate(d);
        setMonth(d);
        setInputValue(formatDate(d));
    }, [value]);

    return (
        <div className="flex w-full flex-col gap-3">
            <Label className="px-1">{label}</Label>

            {/* 🔑 EXACT SHADCN STRUCTURE */}
            <div className="relative flex gap-2">
                <Input
                    value={inputValue}
                    placeholder="June 01, 2025"
                    className={`bg-background pr-10 ${error ? 'border-red-500' : ''}`}
                    onChange={(e) => {
                        const d = new Date(e.target.value);
                        setInputValue(e.target.value);

                        if (isValidDate(d)) {
                            setDate(d);
                            setMonth(d);
                            onChange(d.toISOString().split('T')[0]);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setOpen(true);
                        }
                    }}
                />

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button type="button" variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">Select date</span>
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
                        <Calendar
                            className="rounded-md border min-w-[280px]"
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={(d) => {
                                setDate(d);
                                setMonth(d);
                                setInputValue(formatDate(d));
                                onChange(d ? d.toISOString().split('T')[0] : '');
                                setOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {error && <span className="text-sm text-red-500">{error}</span>}
        </div>
    );
}
