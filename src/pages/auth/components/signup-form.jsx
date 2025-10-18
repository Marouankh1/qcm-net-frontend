import z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import useAuthStore from '@/stores/authStore';
import { toast } from 'sonner';
import { FormErrors } from './form-errors';
import { useState } from 'react';

const signupSchema = z
    .object({
        first_name: z
            .string()
            .min(1, {
                message: 'First name is required',
            })
            .min(2, {
                message: 'First name must be at least 2 characters long',
            })
            .max(50, {
                message: 'First name must be less than 50 characters',
            })
            .regex(/^[a-zA-Z\s]+$/, {
                message: 'First name can only contain letters and spaces',
            }),
        last_name: z
            .string()
            .min(1, {
                message: 'Last name is required',
            })
            .min(2, {
                message: 'Last name must be at least 2 characters long',
            })
            .max(50, {
                message: 'Last name must be less than 50 characters',
            })
            .regex(/^[a-zA-Z\s]+$/, {
                message: 'Last name can only contain letters and spaces',
            }),
        email: z.email({
            message: 'Please enter a valid email address',
        }),
        password: z
            .string()
            .min(1, {
                message: 'Password is required',
            })
            .min(8, {
                message: 'Password must be at least 8 characters long',
            })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            }),
        password_confirmation: z.string().min(1, {
            message: 'Please confirm your password',
        }),
        role: z.enum(['teacher', 'student'], {
            required_error: 'Please select a role',
        }),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords don't match",
        path: ['password_confirmation'],
    });

export function SignupForm() {
    const [apiErrors, setApiErrors] = useState({});
    const { signupUser, isLoading, clearError } = useAuthStore();
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: 'teacher',
        },
    });

    const onSubmit = async (credentials) => {
        try {
            clearError();
            setApiErrors({});
            const result = await signupUser(credentials);

            if (result.success) {
                toast.success(result.message || 'Account created successfully!');
                navigate('/');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Signup failed';

            if (error.response?.data?.errors) {
                setApiErrors(error.response.data.errors);
            } else {
                toast.error(errorMessage);
            }
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto space-y-4">
            <FormErrors errors={apiErrors} />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-3">
                    <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel htmlFor="first_name">First Name</FormLabel>
                                <FormControl>
                                    <Input
                                        id="first_name"
                                        placeholder="Enter your First Name"
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
                        name="last_name"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel htmlFor="last_name">Last Name</FormLabel>
                                <FormControl>
                                    <Input
                                        id="last_name"
                                        placeholder="Enter your Last Name"
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
                        name="email"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel htmlFor="email">Email</FormLabel>
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
                                <FormLabel htmlFor="password">Password</FormLabel>
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
                    <FormField
                        control={form.control}
                        name="password_confirmation"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel htmlFor="password_confirmation">Password Confirmation</FormLabel>
                                <FormControl>
                                    <Input
                                        id="password_confirmation"
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
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex items-center space-y-1"
                                        disabled={isLoading}>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="teacher" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Teacher</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="student" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Student</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full cursor-pointer disabled:cursor-none mt-1"
                        disabled={isLoading}>
                        {isLoading ? 'Signing up...' : 'Sign up'}
                    </Button>

                    <FormDescription className="px-6 text-center">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-primary hover:underline transition-all duration-150">
                            Sign in
                        </Link>
                    </FormDescription>
                </form>
            </Form>
        </div>
    );
}
