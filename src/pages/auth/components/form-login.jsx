import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router';
import useAuthStore from '@/stores/authStore';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
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
    const { loginUser, isLoading, error, clearError } = useAuthStore();
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
            clearError();
            const result = await loginUser(credentials);

            if (result.success) {
                toast.success(result.message || 'Login successful!');
                navigate('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            toast.error(errorMessage);
        }
    };

    const handleGoogleLogin = () => {
        console.log('Google login clicked');
    };

    return (
        <div className="w-full max-w-sm mx-auto space-y-6 font-poppins">
            {error && <div className="p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">{error}</div>}

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
                                        disabled={isLoading}
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
                                        disabled={isLoading}
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
