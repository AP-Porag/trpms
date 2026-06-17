import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GlobalSearchModal } from './GlobalSearchModal';

export function GlobalSearchTrigger() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const isCmdOrCtrl = event.ctrlKey || event.metaKey;

            if (
                isCmdOrCtrl &&
                event.key.toLowerCase() === 'k'
            ) {
                event.preventDefault();
                setOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener(
                'keydown',
                handleKeyDown
            );
        };
    }, []);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="
                    flex
                    h-10
                    w-[340px]
                    items-center
                    justify-between
                    rounded-lg
                    border
                    border-border
                    bg-background
                    px-3
                    text-sm
                    transition-all
                    hover:bg-accent
                    hover:text-accent-foreground
                    focus:outline-none
                    focus:ring-2
                    focus:ring-primary/20
                "
            >
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Search className="h-4 w-4" />
                    <span>
                        Search clients, jobs, candidates...
                    </span>
                </div>

                <div
                    className="
                        hidden
                        items-center
                        gap-1
                        rounded-md
                        border
                        bg-muted
                        px-2
                        py-1
                        text-[11px]
                        text-muted-foreground
                        md:flex
                    "
                >
                    <span>Ctrl</span>
                    <span>K</span>
                </div>
            </button>

            <GlobalSearchModal
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}
