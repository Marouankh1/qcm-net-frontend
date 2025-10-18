import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import useAuthStore from '@/stores/authStore';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

export function NavUser() {
    const { isMobile } = useSidebar();
    const { logoutUser, user, isLoading } = useAuthStore();
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            await logoutUser();
            navigate('/login');
            setTimeout(() => {
                toast.success('Logged out successfully!');
            }, 1000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Logout failed';
            toast.error(errorMessage);
        }
    };

    if (!user) {
        return null;
    }

    const userInitials = `${user.first_name?.[0]?.toUpperCase() || ''}${user.last_name?.[0]?.toUpperCase() || ''}`;
    const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarFallback className="rounded-lg">{userInitials || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{userName || 'User'}</span>
                                <span className="truncate text-xs">{user.email || ''}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}>
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarFallback className="rounded-lg">{userInitials || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{userName || 'User'}</span>
                                    <span className="truncate text-xs">{user.email || ''}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link
                                    to="/account"
                                    className="flex items-center gap-2 w-full cursor-pointer">
                                    <BadgeCheck className="h-4 w-4" />
                                    Account
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <button
                                className="flex items-center gap-2 w-full text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none bg-transparent p-2"
                                disabled={isLoading}
                                onClick={handleLogOut}>
                                <LogOut className="h-4 w-4" />
                                {isLoading ? 'Logging out...' : 'Logout'}
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
