// import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
// import { type BreadcrumbItem } from '@/types';
// import { type ReactNode } from 'react';
// import { Toaster } from "@/components/ui/sonner"
// interface AppLayoutProps {
//     children: ReactNode;
//     breadcrumbs?: BreadcrumbItem[];
// }
//
// export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
//     <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
//         {children}
//         <Toaster richColors position="top-right" />
//     </AppLayoutTemplate>
// );

import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    useEffect(() => {
        function disableNumberScroll(e: WheelEvent) {
            const active = document.activeElement as HTMLInputElement | null;

            if (active && active.type === 'number') {
                e.preventDefault();
            }
        }

        window.addEventListener('wheel', disableNumberScroll, { passive: false });

        return () => {
            window.removeEventListener('wheel', disableNumberScroll);
        };
    }, []);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Toaster richColors position="top-right" />
        </AppLayoutTemplate>
    );
}
