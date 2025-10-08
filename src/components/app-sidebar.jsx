'use client';

import * as React from 'react';
import {
    AudioWaveform,
    BarChart3,
    BookOpen,
    Bot,
    Command,
    FilePlus2,
    FileTextIcon,
    Frame,
    GalleryVerticalEnd,
    LayoutDashboardIcon,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import LogoApp from '@/components/ui/logo-app';

const data = {
    user: {
        name: 'Teacher Name',
        email: 'teacher@qcm-net.com',
        avatar: '/avatars/teacher.jpg',
    },
    navMain: [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutDashboardIcon,
            isActive: true,
        },
        {
            title: 'Show Quizzes',
            url: '/quizzes',
            icon: FileTextIcon,
        },
        {
            title: 'Create Quizzes',
            url: '/quizzes/create',
            icon: FilePlus2,
        },
        {
            title: 'Statistics',
            url: '/statistics',
            icon: BarChart3,
        },
    ],
};

export function AppSidebar({ ...props }) {
    return (
        <Sidebar
            collapsible="icon"
            {...props}>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 group-data-[collapsible=icon]:px-0">
                    {/* Logo icon - always visible */}
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary">
                        <BookOpen className="size-4 text-primary-foreground" />
                    </div>
                    {/* Logo text - hidden when sidebar is collapsed */}
                    <div className="flex flex-col justify-center group-data-[collapsible=icon]:hidden">
                        <h1 className="text-sm font-medium text-sidebar-foreground">QCM-Net</h1>
                        <span className="text-xs font-light text-sidebar-foreground/70">Plateform of quizzes</span>
                    </div>
                </div>

                {/* <TeamSwitcher teams={data.teams} /> */}
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
