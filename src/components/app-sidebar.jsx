import * as React from 'react';
import { BarChart3, FilePlus2, FileTextIcon, LayoutDashboardIcon, BookOpen, Users, Play } from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import useAuthStore from '@/stores/authStore';

const navConfig = {
    admin: [
        { title: 'Dashboard', url: '/admin', icon: LayoutDashboardIcon },
        { title: 'Manage Users', url: '/admin/users', icon: FileTextIcon },
        { title: 'Reports', url: '/admin/reports', icon: BarChart3 },
    ],
    teacher: [
        { title: 'Dashboard', url: '/teacher', icon: LayoutDashboardIcon },
        { title: 'My Quizzes', url: '/teacher/quizzes', icon: FileTextIcon },
        { title: 'Create Quiz', url: '/teacher/quizzes/create', icon: FilePlus2 },
        { title: 'Student Results', url: '/teacher/student-results', icon: Users },
    ],
    student: [
        { title: 'Dashboard', url: '/student', icon: LayoutDashboardIcon },
        { title: 'Available Quizzes', url: '/student/quizzes', icon: Play }, // Changé l'icône et le texte
        { title: 'My Results', url: '/student/results', icon: BarChart3 },
    ],
};

export function AppSidebar({ ...props }) {
    const { user } = useAuthStore();
    const role = user?.role || 'student';

    const navItems = navConfig[role] || [];

    return (
        <Sidebar
            collapsible="icon"
            {...props}>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 group-data-[collapsible=icon]:px-0">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary">
                        <BookOpen className="size-4 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col justify-center group-data-[collapsible=icon]:hidden">
                        <h1 className="text-sm font-medium text-sidebar-foreground">QCM-Net</h1>
                        <span className="text-xs font-light text-sidebar-foreground/70">Platform of quizzes</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
