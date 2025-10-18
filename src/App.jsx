import { AppSidebar } from '@/components/app-sidebar';
import { SidebarContent, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import useAuthStore from '@/stores/authStore';
import { useEffect } from 'react';
import { Outlet } from 'react-router';

function App() {
    const { validateToken, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            validateToken();
        }
    }, [isAuthenticated, validateToken]);

    return (
        <>
            <Toaster
                richColors
                toastOptions={{}}
            />
            <SidebarProvider>
                <AppSidebar />
                <SidebarContent>
                    <Outlet />
                </SidebarContent>
            </SidebarProvider>
        </>
    );
}

export default App;
