import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import FormLogin from './components/form-login';
import { currentYear } from '@/utils/current-year';

// Zod validation schema

export function Login({ className, ...props }) {
    // Redirect if user is already logged in
    // useEffect(() => {
    //     if (user) {
    //         const redirectPath = user.role === 'teacher' ? '/teacher' : user.role === 'admin' ? '/admin' : '/student';
    //         navigate(redirectPath, { replace: true });
    //     }
    // }, [user, navigate]);

    // Clear errors when form changes

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8 -ml-3">
                    <div className="inline-flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                            <BookOpen className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground">QCM-Net</h1>
                    </div>
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
    );
}
