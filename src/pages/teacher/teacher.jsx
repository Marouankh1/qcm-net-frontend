import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useLogout } from '@/hooks/react-query/auth/useAuth';
import useAuthStore from '@/stores/authStore';
import React from 'react';
import { useNavigate, useOutlet } from 'react-router';
import TeacherContent from './components/teacher-content';

function Teacher() {
    const outlet = useOutlet();
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
        <div className={'w-full h-full'}>
            {outlet || (
                <>
                    <header className="flex h-16  items-center justify-between gap-2 border-b mx-6">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            {/* <SidebarTrigger /> */}
                            <Separator
                                orientation="vertical"
                                className="mr-2 h-4"
                            />
                            <h1 className="text-lg font-semibold">Dashboard</h1>
                        </div>
                        <Button
                            variant="outline"
                            className="cursor-pointer disabled:cursor-none bg-transparent"
                            disabled={isLoading}
                            onClick={() => handleLogOut()}>
                            {isLoading ? 'Logout ...' : 'Logout'}
                        </Button>
                    </header>
                    <TeacherContent />
                </>
            )}
        </div>
    );
}

export default Teacher;
