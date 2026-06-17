import { Search } from 'lucide-react';

import { SearchSection } from './SearchSection';

interface SearchResult {
    id: number | string;
    type: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    url: string;
}

interface SearchResponse {
    query: string;
    type: string;

    meta: {
        minimum_length: number;
        filters: {
            value: string;
            label: string;
        }[];
    };

    results: Record<string, SearchResult[]>;
}

interface Props {
    response: SearchResponse | null;
}

const SECTION_TITLES: Record<string, string> = {
    clients: 'Clients',
    jobs: 'Jobs',
    candidates: 'Candidates',
    pipeline: 'Pipeline',
    prospects: 'Prospects',
    leads: 'Leads',
    placements: 'Placements',
    invoices: 'Invoices',
    notes: 'Notes',
    contacts: 'Contacts',
};

export function SearchResults({ response }: Props) {
    if (!response) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="text-muted-foreground mb-4 h-10 w-10" />

                <h3 className="text-lg font-semibold">Global Search</h3>

                <p className="text-muted-foreground mt-2 max-w-md text-sm">
                    Search across clients, jobs, candidates, placements, invoices, notes, contacts and more.
                </p>
            </div>
        );
    }

    const sections = Object.entries(response.results).filter(([, items]) => Array.isArray(items) && items.length > 0);

    if (sections.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="text-muted-foreground mb-4 h-10 w-10" />

                <h3 className="text-lg font-semibold">No results found</h3>

                <p className="text-muted-foreground mt-2 text-sm">Try another keyword or search category.</p>
            </div>
        );
    }

    return (
        <div className="divide-y">
            {sections.map(([key, items]) => (
                <SearchSection key={key} title={SECTION_TITLES[key] ?? key} count={items.length} items={items} />
            ))}
        </div>
    );
}
