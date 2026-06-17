import axios from 'axios';
import { Loader2, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { SearchFilters } from './SearchFilters';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import api from '@/Services/api';

interface SearchResult {
    id: number | string;
    type: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    url: string;
}

interface SearchFilter {
    value: string;
    label: string;
}

interface SearchResponse {
    query: string;
    type: string;

    meta: {
        minimum_length: number;
        filters: SearchFilter[];
    };

    results: Record<string, SearchResult[]>;
}

interface Props {
    open: boolean;
    onClose: () => void;
}

export function GlobalSearchModal({
                                      open,
                                      onClose,
                                  }: Props) {
    const [query, setQuery] = useState('');
    const [type, setType] = useState('all');

    const [loading, setLoading] = useState(false);

    const [response, setResponse] =
        useState<SearchResponse | null>(null);

    const [error, setError] =
        useState<string | null>(null);

    const minimumLength = 3;

    const resetModal = () => {
        setQuery('');
        setType('all');
        setResponse(null);
        setError(null);
        setLoading(false);
    };

    const handleClose = () => {
        onClose();
    };

    /**
     * Lock body scroll while modal is open
     */
    useEffect(() => {
        if (!open) {
            return;
        }

        const original =
            document.body.style.overflow;

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow =
                original;
        };
    }, [open]);

    /**
     * Reset modal when closed
     */
    useEffect(() => {
        if (!open) {
            resetModal();
        }
    }, [open]);

    /**
     * ESC key close
     */
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleEscape = (
            event: KeyboardEvent
        ) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener(
            'keydown',
            handleEscape
        );

        return () => {
            window.removeEventListener(
                'keydown',
                handleEscape
            );
        };
    }, [open]);

    const handleSearch = async () => {
        setError(null);

        if (
            query.trim().length <
            minimumLength
        ) {
            setError(
                `Please enter at least ${minimumLength} characters.`
            );

            return;
        }

        try {
            setLoading(true);

            const { data } =
                await api.get(
                    route('global-search'),
                    {
                        params: {
                            q: query.trim(),
                            type,
                        },
                    }
                );

            setResponse(data);
        } catch (error) {
            console.error(error);

            setError(
                'Unable to perform search.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[9999]">
            {/* Backdrop */}

            <div
                className="animate-in fade-in absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}

            <div className="animate-in fade-in zoom-in-95 absolute top-[10vh] left-1/2 w-full max-w-5xl -translate-x-1/2 px-4 duration-200">
                <div className="bg-background overflow-hidden rounded-2xl border shadow-2xl">
                    {/* Header */}

                    <div className="flex items-center justify-between border-b px-5 py-4">
                        <div className="flex items-center gap-2">
                            <Search className="text-muted-foreground h-5 w-5" />

                            <h2 className="font-semibold">
                                Global Search
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="hover:bg-accent rounded-md p-2"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Search Area */}

                    <div className="space-y-4 p-5">
                        <SearchInput
                            query={query}
                            setQuery={setQuery}
                            onSearch={
                                handleSearch
                            }
                            loading={loading}
                            minimumLength={
                                minimumLength
                            }
                        />

                        <SearchFilters
                            selected={type}
                            onSelect={setType}
                            filters={
                                response?.meta
                                    ?.filters ?? [
                                    {
                                        value: 'all',
                                        label: 'All Results',
                                    },
                                    {
                                        value: 'clients',
                                        label: 'Clients',
                                    },
                                    {
                                        value: 'jobs',
                                        label: 'Jobs',
                                    },
                                    {
                                        value: 'candidates',
                                        label: 'Candidates',
                                    },
                                    {
                                        value: 'pipeline',
                                        label: 'Pipeline',
                                    },
                                    {
                                        value: 'prospects',
                                        label: 'Prospects',
                                    },
                                    {
                                        value: 'leads',
                                        label: 'Leads',
                                    },
                                    {
                                        value: 'placements',
                                        label: 'Placements',
                                    },
                                    {
                                        value: 'invoices',
                                        label: 'Invoices',
                                    },
                                    {
                                        value: 'notes',
                                        label: 'Notes',
                                    },
                                    {
                                        value: 'contacts',
                                        label: 'Contacts',
                                    },
                                ]
                            }
                        />

                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Results */}

                    <div className="max-h-[65vh] overflow-y-auto border-t">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : (
                            <SearchResults
                                response={
                                    response
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
