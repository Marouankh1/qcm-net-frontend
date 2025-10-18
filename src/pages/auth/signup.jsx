import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignupForm } from '@/pages/auth/components/signup-form';
import LogoApp from '@/components/ui/logo-app';
import { currentYear } from '@/utils/current-year';
import useAuthStore from '@/stores/authStore';
import { Toaster } from '@/components/ui/sonner';
import { Navigate } from 'react-router';

function Signup({ className, ...props }) {
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
            <title>QCM NET - Signup</title>
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
                            <CardHeader>
                                <CardTitle>Create an account</CardTitle>
                                <CardDescription>Enter your information below to create your account</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SignupForm />
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

export default Signup;
