import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Shield,
    Users,
    Briefcase,
    ClipboardList,
    UserCheck,
    CheckCircle,
    Wallet,
    FileText,
    BarChart3,
    Target,
    UserSearch,
    Building2Icon,
    Factory,
    Network,
    UserCog2,
    Share2,
    Award,
    AwardIcon,
    ListOrdered,
    CalendarDays,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: "Business Timeline",
        href: "/events",
        icon: CalendarDays,
    },
    {
        title: 'Administration',
        icon: Shield,
        children: [
            {
                title: 'Users',
                href: '/users',
                icon: Users,
            },
            {
                title: 'Industries',
                href: '/industries',
                icon: Factory,
            },
            {
                title: 'Department',
                href: '/departments',
                icon: Network,
            },
            {
                title: 'Contact Roles',
                href: '/positions',
                icon: UserCog2,
            },
            {
                title: 'Lead Sources',
                href: '/sources',
                icon: Share2,
            },
        ],
    },
    {
        title: 'Companies',
        icon: Building2Icon,
        children: [
            {
                title: 'Clients',
                href: '/clients',
                icon: Briefcase,
            },
            {
                title: 'Prospects',
                href: '/prospects',
                icon: UserSearch,
            },
            {
                title: 'Target Accounts',
                href: '/target-accounts',
                icon: Target,
            },
            {
                title: 'Leads',
                // href: '/leads',
                href: route('under-development', { module: 'Leads' }),
                icon: ListOrdered,
            },
        ],
    },
    {
        title: 'Jobs',
        href: '/jobs',
        icon: ClipboardList,
    },
    {
        title: 'Candidates',
        href: '/candidates',
        icon: UserCheck,
    },
    {
        title: 'Placements',
        href: '/placements',
        icon: CheckCircle,
    },
    {
        title: 'Finance',
        icon: Wallet,
        children: [
            {
                title: 'Invoices',
                href: '/invoices',
                icon: FileText,
            },
            {
                title: 'Revenue Goal',
                href: '/revenue-goals',
                icon: Award,
            },
            {
                title: 'Revenue Reports',
                href: '/revenue-reports',
                icon: BarChart3,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
