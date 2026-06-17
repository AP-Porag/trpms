import { router } from '@inertiajs/react';
import { ArrowRight, Briefcase, Building2, Contact, FileText, Receipt, StickyNote, User, Users } from 'lucide-react';

interface SearchResult {
    id: number | string;
    type: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    url: string;
}

interface Props {
    item: SearchResult;
}

export function SearchResultItem({ item }: Props) {
    const getIcon = () => {
        switch (item.type) {
            case 'client':
                return <Building2 className="h-4 w-4" />;

            case 'prospect':
                return <Building2 className="h-4 w-4" />;

            case 'job':
                return <Briefcase className="h-4 w-4" />;

            case 'candidate':
                return <User className="h-4 w-4" />;

            case 'pipeline':
                return <Users className="h-4 w-4" />;

            case 'lead':
                return <Users className="h-4 w-4" />;

            case 'placement':
                return <Briefcase className="h-4 w-4" />;

            case 'invoice':
                return <Receipt className="h-4 w-4" />;

            case 'note':
                return <StickyNote className="h-4 w-4" />;

            case 'contact':
                return <Contact className="h-4 w-4" />;

            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const handleClick = () => {
        if (!item.url || item.url === '#') {
            return;
        }

        router.visit(item.url);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="group hover:bg-accent/50 focus:bg-accent/50 flex w-full items-center justify-between gap-4 border-b px-5 py-4 text-left transition-all focus:outline-none"
        >
            {/* Left */}

            <div className="flex min-w-0 flex-1 items-start gap-3">
                {/* Icon */}

                <div className="bg-muted text-muted-foreground mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border">
                    {getIcon()}
                </div>

                {/* Content */}

                <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{item.title}</div>

                    {item.subtitle && <div className="text-muted-foreground mt-0.5 truncate text-sm">{item.subtitle}</div>}

                    {item.description && <div className="text-muted-foreground mt-1 text-xs">{item.description}</div>}
                </div>
            </div>

            {/* Right */}

            <div
                className="
                            flex
                            shrink-0
                            items-center
                        "
                                >
                                    <ArrowRight
                                        className="
                                h-6
                                w-6
                                text-muted-foreground
                                transition-all
                                duration-200
                                group-hover:translate-x-1
                        "
                />
            </div>
        </button>
    );
}
