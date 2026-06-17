import { SearchResultItem } from './SearchResultItem';

interface SearchResult {
    id: number | string;
    type: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    url: string;
}

interface Props {
    title: string;
    count: number;
    items: SearchResult[];
}

export function SearchSection({ title, count, items }: Props) {
    return (
        <section>
            {/* Section Header */}

            <div className="bg-muted/30 sticky top-0 z-10 flex items-center justify-between border-b px-5 py-3 backdrop-blur-sm">
                <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">{title}</h3>

                <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs font-medium">{count}</span>
            </div>

            {/* Items */}

            <div>
                {items.map((item) => (
                    <SearchResultItem key={`${item.type}-${item.id}`} item={item} />
                ))}
            </div>
        </section>
    );
}
