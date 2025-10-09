import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useLogout } from '@/hooks/react-query/auth/useAuth';
import useAuthStore from '@/stores/authStore';
import React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

function Header({ title = 'Dashboard' }) {
    const { logout, isLoading, setLoading, user, isAuthenticated } = useAuthStore();

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

    return (
        <header className="flex h-16  items-center justify-between gap-2 border-b mx-6">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 h-4"
                />
                <h1 className="text-lg font-semibold">{title}</h1>
            </div>
            <Button
                variant="outline"
                className="cursor-pointer disabled:cursor-none bg-transparent"
                disabled={isLoading}
                onClick={() => handleLogOut()}>
                {isLoading ? 'Logout ...' : 'Logout'}
            </Button>
        </header>
    );
}

export default Header;
