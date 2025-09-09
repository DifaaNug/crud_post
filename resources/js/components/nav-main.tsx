import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export function NavMain({ items = [], groupTitle }: { items: NavItem[], groupTitle?: string }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-2 mb-4">
            {groupTitle && <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-3">{groupTitle}</SidebarGroupLabel>}
            <SidebarMenu className="space-y-1">
                {items.map((item) => {
                    const itemUrl = typeof item.href === 'string' ? item.href : item.href.url;
                    const isActive = page.url === itemUrl ||
                                   page.url.startsWith(itemUrl) ||
                                   (item.title === 'SIADIL' && (page.url.includes('/test-archive') || page.url.includes('/archive')));

                    // Special styling for SIADIL menu
                    const siadilActive = item.title === 'SIADIL' && isActive;

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className={cn(
                                    "w-full justify-start py-2.5 px-3 text-sm font-medium transition-all duration-200 rounded-md",
                                    siadilActive
                                        ? 'bg-[#057A3C] text-white hover:bg-[#046732] shadow-sm !important'
                                        : isActive
                                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                )}
                                style={siadilActive ? { backgroundColor: '#057A3C', color: 'white' } : {}}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
