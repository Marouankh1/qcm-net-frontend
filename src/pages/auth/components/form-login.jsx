import React from 'react';
import { Button } from '@/components/ui/button';
import { FieldSeparator } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router';
import useAuthStore from '@/stores/authStore';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useLogin } from '@/hooks/react-query/auth/useAuth';
import { toast } from 'sonner';

const loginSchema = z.object({
    email: z.email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(1, {
            message: 'Please enter your password',
        })
        .min(7, {
            message: 'Password must be at least 7 characters long',
        }),
});

function FormLogin() {
    const { login, isLoading, error, clearError, user, isAuthenticated, setLoading } = useAuthStore();

    const loginMutation = useLogin();
    // const { data: user } = useUser();

    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (credentials) => {
        try {
            setLoading(true);
            const result = await loginMutation.mutateAsync(credentials);
            if (result.data.success) {
                login(result.data.data.user);
                setLoading(false);
                navigate('/');
                setTimeout(() => {
                    toast.success(result.data.message);
                }, 1000);
            }
        } catch (error) {
            // Error is already handled in the mutation
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        console.log('Google login clicked');
    };

    return (
        <div className="w-full max-w-sm mx-auto space-y-6 font-poppins">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <FormLabel>Password</FormLabel>
                                </div>
                                <FormControl>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="********"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full cursor-pointer disabled:cursor-none"
                        disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>

                    <FieldSeparator className="my-4">Or continue with</FieldSeparator>

                    <Button
                        onClick={handleGoogleLogin}
                        variant="outline"
                        type="button"
                        className="w-full flex items-center justify-center gap-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-5 h-5">
                            <path
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                fill="currentColor"
                            />
                        </svg>
                        Login with Google
                    </Button>
                    <FormDescription className="text-center">
                        Don&apos;t have an account?{' '}
                        <Link
                            to="/signup"
                            className="text-primary hover:underline transition-all duration-150">
                            Sign up
                        </Link>
                    </FormDescription>
                </form>
            </Form>
        </div>
    );
}

export default FormLogin;
