import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FormLogin from './components/form-login';
import { currentYear } from '@/utils/current-year';
import LogoApp from '@/components/ui/logo-app';
import { Toaster } from '@/components/ui/sonner';
import useAuthStore from '@/stores/authStore';
import { Navigate } from 'react-router';

export function Login({ className, ...props }) {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return (
        <>
            <title>QCM NET - Login</title>
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <Toaster
                    richColors
                    toastOptions={{}}
                />
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8 -ml-3">
                        <LogoApp />
                    </div>
                    <div
                        className={cn('flex flex-col gap-6', className)}
                        {...props}>
                        <Card>
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">Welcome back</CardTitle>
                                <CardDescription>Sign in to QCM Net platform</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FormLogin />
                                <div className="flex flex-col justify-center items-center mt-5">
                                    <span className="text-xs text-foreground/30">ENSI Tanger | QCM NET © {currentYear}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
