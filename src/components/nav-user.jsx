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
import { useLogout } from '@/hooks/react-query/auth/useAuth';

export function NavUser() {
    const { isMobile } = useSidebar();
    const { logout, isLoading, setLoading, user } = useAuthStore();

    const loginMutation = useLogout();
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            setLoading(true);
            const result = await loginMutation.mutateAsync();
            if (result.data.success) {
                logout();
                setLoading(false);
                navigate('/login');
                setTimeout(() => {
                    toast.success(result.data.message);
                }, 1000);
            }
        } catch (error) {
            setLoading(false);
        }
    };

    console.log(user);
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarFallback className="rounded-lg">{`${user.first_name[0].toUpperCase()}${user.last_name[0].toUpperCase()}`}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{`${user.first_name} ${user.last_name}`}</span>
                                <span className="truncate text-xs">{user.email}</span>
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
                                    <AvatarFallback className="rounded-lg">{`${user.first_name[0].toUpperCase()}${user.last_name[0].toUpperCase()}`}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{`${user.first_name} ${user.last_name}`}</span>
                                    <span className="truncate text-xs">{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <Link
                                    to="/account"
                                    className="flex items-center gap-2">
                                    <BadgeCheck />
                                    Account
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuItem>
                            <button
                                className="flex items-center gap-2 border-none p-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                                onClick={() => handleLogOut()}>
                                <LogOut />
                                {isLoading ? 'Logout ...' : 'Logout'}
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
