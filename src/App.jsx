import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useLogout } from '@/hooks/react-query/auth/useAuth';
import useAuthStore from '@/stores/authStore';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
// import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
// import { AppSidebar } from '@/components/app-sidebar';

function App() {
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
        <>
            <Toaster
                // closeButton={true}
                richColors
                toastOptions={{}}
            />
            Welcome To QCM-NET Platform
            <Button
                className="cursor-pointer disabled:cursor-none"
                disabled={isLoading}
                onClick={() => handleLogOut()}>
                {isLoading ? 'Logout ...' : 'Logout'}
            </Button>
        </>
    );
}

export default App;
