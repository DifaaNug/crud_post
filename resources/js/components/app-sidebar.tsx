import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { FileText, BookOpen, Folder, LayoutGrid, Package, Users, FolderOpen, User, FileStack, Globe } from 'lucide-react';
import AppLogo from './app-logo';

const appsFeatures: NavItem[] = [
    {
        title: 'E-Prosedur',
        href: '#',
        icon: FileStack,
    },
    {
        title: 'Employee Directory',
        href: '#',
        icon: User,
    },
    {
        title: 'SIADIL',
        href: '/test-archive',
        icon: FolderOpen,
    },
    {
        title: 'SYSTIK',
        href: '#',
        icon: Globe,
    },
    {
        title: 'Konsumsi',
        href: '#',
        icon: Package,
    },
    {
        title: 'Dokumenku',
        href: '#',
        icon: FileText,
    },
    {
        title: 'MyStatement',
        href: '#',
        icon: FileText,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="h-screen">
            <SidebarHeader className="pb-4 border-b border-sidebar-border/50">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="pt-2 px-0 space-y-0 sidebar-scroll overflow-y-auto">
                {/* GENERALS Section */}
                <NavMain items={[
                    {
                        title: 'Home',
                        href: dashboard(),
                        icon: LayoutGrid,
                    },
                    {
                        title: 'Profile',
                        href: '#',
                        icon: User,
                    },
                    {
                        title: 'Employment',
                        href: '#',
                        icon: Users,
                    },
                ]} groupTitle="GENERALS" />

                {/* MAIN MENU Section */}
                <NavMain items={[
                    {
                        title: 'Portal Aplikasi',
                        href: '#',
                        icon: Globe,
                    },
                    {
                        title: 'Kujang AI',
                        href: '#',
                        icon: FileText,
                    },
                    {
                        title: 'Library',
                        href: '#',
                        icon: BookOpen,
                    },
                    {
                        title: 'Shortlink',
                        href: '#',
                        icon: Folder,
                    },
                ]} groupTitle="MAIN MENU" />

                {/* APPS & FEATURES Section */}
                <NavMain items={appsFeatures} groupTitle="APPS & FEATURES" />
            </SidebarContent>

            <SidebarFooter className="pt-4 border-t border-sidebar-border/50">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
