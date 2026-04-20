import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export type MultiSelectOption = {
    label: string;
    value: string | number;
};

type MultiSelectProps = {
    options: MultiSelectOption[];
    value: (string | number)[];
    onChange: (value: (string | number)[]) => void;
    placeholder?: string;
};

export default function MultiSelect({ options = [], value = [], onChange, placeholder = 'Select...' }: MultiSelectProps) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // ✅ Outside click handler FIX
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleOption = (option: MultiSelectOption) => {
        let updated: (string | number)[];

        if (value.includes(option.value)) {
            updated = value.filter((v) => v !== option.value);
        } else {
            updated = [...value, option.value];
        }

        onChange(updated);
    };

    const removeItem = (val: string | number) => {
        const updated = value.filter((v) => v !== val);
        onChange(updated);
    };

    const selectedItems = options.filter((o) => value.includes(o.value));

    return (
        <div ref={wrapperRef} className="relative w-full">
            {/* SELECT BOX */}
            <div className="min-h-[42px] w-full cursor-pointer rounded-md border bg-white px-3 py-2" onClick={() => setOpen((prev) => !prev)}>
                {selectedItems.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {selectedItems.map((item) => (
                            <span key={item.value} className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs">
                                {item.label}

                                <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeItem(item.value);
                                    }}
                                />
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="text-sm text-gray-400">{placeholder}</span>
                )}
            </div>

            {/* DROPDOWN */}
            {open && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow">
                    {options.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-400">No options found</div>
                    ) : (
                        options.map((option) => {
                            const isSelected = value.includes(option.value);

                            return (
                                <div
                                    key={option.value}
                                    onClick={() => toggleOption(option)}
                                    className={cn(
                                        'flex cursor-pointer justify-between px-3 py-2 text-sm hover:bg-gray-100',
                                        isSelected && 'bg-gray-100 font-medium',
                                    )}
                                >
                                    {option.label}
                                    {isSelected && <span className="text-xs text-green-600">✓</span>}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
