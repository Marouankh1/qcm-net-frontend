// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
// import { Input } from '@/components/ui/input';

// export function Login({ className, ...props }) {
//     return (
//         <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
//             <div className="w-full max-w-sm">
//                 <div
//                     className={cn('flex flex-col gap-6', className)}
//                     {...props}>
//                     <Card>
//                         <CardHeader>
//                             <CardTitle>Login to your account</CardTitle>
//                             <CardDescription>Enter your email below to login to your account</CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <form>
//                                 <FieldGroup>
//                                     <Field>
//                                         <FieldLabel htmlFor="email">Email</FieldLabel>
//                                         <Input
//                                             id="email"
//                                             type="email"
//                                             placeholder="m@example.com"
//                                             required
//                                         />
//                                     </Field>
//                                     <Field>
//                                         <div className="flex items-center">
//                                             <FieldLabel htmlFor="password">Password</FieldLabel>
//                                             <a
//                                                 href="#"
//                                                 className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
//                                                 Forgot your password?
//                                             </a>
//                                         </div>
//                                         <Input
//                                             id="password"
//                                             type="password"
//                                             required
//                                         />
//                                     </Field>
//                                     <Field>
//                                         <Button type="submit">Login</Button>
//                                         <Button
//                                             variant="outline"
//                                             type="button">
//                                             Login with Google
//                                         </Button>
//                                         <FieldDescription className="text-center">
//                                             Don&apos;t have an account? <a href="#">Sign up</a>
//                                         </FieldDescription>
//                                     </Field>
//                                 </FieldGroup>
//                             </form>
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     );
// }

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import authStore from '@/stores/authStore';

// Zod validation schema
const loginSchema = z.object({
    email: z.email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

export function Login({ className, ...props }) {
    const { login, isLoading, error, clearError, user } = authStore();

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // Redirect if user is already logged in
    // useEffect(() => {
    //     if (user) {
    //         const redirectPath = user.role === 'teacher' ? '/teacher' : user.role === 'admin' ? '/admin' : '/student';
    //         navigate(redirectPath, { replace: true });
    //     }
    // }, [user, navigate]);

    // Clear errors when form changes
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    const onSubmit = async (data) => {
        clearError();
        const result = await login(data);

        if (result.success) {
            // Navigation will be handled by the useEffect above
            console.log('Login successful');
        }
    };

    const handleGoogleLogin = () => {
        // Implement Google OAuth logic here
        console.log('Google login clicked');
    };

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div
                    className={cn('flex flex-col gap-6', className)}
                    {...props}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Login to your account</CardTitle>
                            <CardDescription>Enter your email below to login to your account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            {...register('email')}
                                        />
                                        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                                    </Field>

                                    <Field>
                                        <div className="flex items-center">
                                            <FieldLabel htmlFor="password">Password</FieldLabel>
                                            <Link
                                                to="/forgot-password"
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                                Forgot your password?
                                            </Link>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            {...register('password')}
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                                        )}
                                    </Field>

                                    {/* Server error message */}
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <Field>
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isLoading}>
                                            {isLoading ? 'Signing in...' : 'Login'}
                                        </Button>

                                        {/* <div className="relative my-4">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t" />
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                            </div>
                                        </div> */}

                                        {/* <Button
                                            variant="outline"
                                            type="button"
                                            className="w-full"
                                            onClick={handleGoogleLogin}
                                            disabled={isLoading}>
                                            <svg
                                                className="mr-2 h-4 w-4"
                                                viewBox="0 0 24 24">
                                                <path
                                                    fill="currentColor"
                                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                />
                                                <path
                                                    fill="currentColor"
                                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                />
                                                <path
                                                    fill="currentColor"
                                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                />
                                                <path
                                                    fill="currentColor"
                                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                />
                                            </svg>
                                            Login with Google
                                        </Button> */}

                                        <FieldDescription className="text-center">
                                            Don't have an account?{' '}
                                            <Link
                                                to="/register"
                                                className="font-medium text-primary underline-offset-4 hover:underline">
                                                Sign up
                                            </Link>
                                        </FieldDescription>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
