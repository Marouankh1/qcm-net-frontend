import z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { useSignup } from '@/hooks/react-query/auth/useAuth';
import useAuthStore from '@/stores/authStore';
import { toast } from 'sonner';

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
        role: z.enum(['admin', 'teacher', 'student'], {
            required_error: 'Please select a role',
        }),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords don't match",
        path: ['password_confirmation'],
    });

export function SignupForm() {
    const { login, isLoading, error, clearError, user, isAuthenticated, setLoading } = useAuthStore();

    const signupMutation = useSignup();
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: 'admin',
        },
    });

    const onSubmit = async (credentials) => {
        console.log('onSubmit ===> credentials');
        console.log(credentials);
        try {
            setLoading(true);
            const result = await signupMutation.mutateAsync(credentials);
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
        <div className="w-full max-w-sm mx-auto space-y-4">
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
                                        className="flex justify-center items-center space-y-1">
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="admin" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Admin</FormLabel>
                                        </FormItem>
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
                        {isLoading ? 'Sign up ...' : 'Sign up'}
                    </Button>
                    {/* <Button
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
                        Sign up with Google
                    </Button> */}
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
