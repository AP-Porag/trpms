import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SearchFilter {
    value: string;
    label: string;
}

interface Props {
    filters: SearchFilter[];
    selected: string;
    onSelect: (value: string) => void;
}

export function SearchFilters({ filters, selected, onSelect }: Props) {
    if (!filters.length) {
        return null;
    }

    return (
        <div className="relative">
            <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
                {filters.map((filter) => {
                    const isActive = selected === filter.value;

                    return (
                        <button key={filter.value} type="button" onClick={() => onSelect(filter.value)} className="shrink-0 transition-all">
                            <Badge
                                variant={isActive ? 'default' : 'outline'}
                                className={cn(
                                    `cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200`,
                                    isActive && `shadow-sm`,
                                )}
                            >
                                {filter.label}
                            </Badge>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
