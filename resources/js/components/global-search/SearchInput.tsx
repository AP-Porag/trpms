import { Loader2, Search } from 'lucide-react';

interface Props {
    query: string;
    setQuery: (value: string) => void;
    onSearch: () => void;
    loading: boolean;
    minimumLength: number;
}

export function SearchInput({ query, setQuery, onSearch, loading, minimumLength }: Props) {
    const canSearch = query.trim().length >= minimumLength;

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && canSearch) {
            onSearch();
        }
    };

    return (
        <div className="space-y-2">
            <div className="relative flex items-center">
                {/* Search Icon */}

                <Search className="text-muted-foreground absolute left-4 h-4 w-4" />

                {/* Input */}

                <input
                    type="text"
                    value={query}
                    autoFocus
                    placeholder="Search clients, jobs, candidates, notes, contacts..."
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="border-border bg-background focus:border-primary focus:ring-primary/10 h-12 w-full rounded-xl border pr-32 pl-11 text-sm transition-all outline-none focus:ring-2"
                />

                {/* Search Button */}

                <button
                    type="button"
                    disabled={!canSearch || loading}
                    onClick={onSearch}
                    className="bg-primary text-primary-foreground absolute right-2 flex h-8 min-w-[90px] items-center justify-center gap-2 rounded-lg px-3 text-xs font-medium transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Searching
                        </>
                    ) : (
                        <>
                            <Search className="h-3.5 w-3.5" />
                            Search
                        </>
                    )}
                </button>
            </div>

            {/* Helper Text */}

            <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>Enter at least {minimumLength} characters</span>

                <span className="hidden md:block">Press Enter to search</span>
            </div>
        </div>
    );
}
