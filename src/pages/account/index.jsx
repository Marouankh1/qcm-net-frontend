import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { User, Mail, Lock, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useOutlet } from 'react-router';
import useAuthStore from '@/stores/authStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Validation schema
const accountSchema = z
    .object({
        firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
        lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
        email: z.email('Invalid email address'),
        currentPassword: z.string().optional(),
        newPassword: z.string().optional(),
        confirmPassword: z.string().optional(),
    })
    .refine(
        (data) => {
            // If any password field is filled, all must be filled and new passwords must match
            if (data.currentPassword || data.newPassword || data.confirmPassword) {
                return (
                    data.currentPassword && data.newPassword && data.confirmPassword && data.newPassword === data.confirmPassword
                );
            }
            return true;
        },
        {
            message: 'All password fields are required and new passwords must match',
            path: ['confirmPassword'],
        }
    )
    .refine(
        (data) => {
            // Password strength validation only if changing password
            if (data.newPassword) {
                return z.string().min(8, 'Password must be at least 8 characters').safeParse(data.newPassword).success;
            }
            return true;
        },
        {
            message: 'Password must be at least 8 characters',
            path: ['newPassword'],
        }
    );

export default function AccountPage() {
    const outlet = useOutlet();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthStore();

    // const { user } = useUser();

    // Initialize form with user data from auth store
    const form = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            firstName: user?.first_name || '',
            lastName: user?.last_name || '',
            email: user?.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        mode: 'onChange',
    });

    // Watch form values to determine if save should be enabled
    const watchedValues = form.watch();
    const isDirty = form.formState.isDirty;
    const hasErrors = Object.keys(form.formState.errors).length > 0;

    // Check if password fields have any value
    const isChangingPassword = !!(watchedValues.currentPassword || watchedValues.newPassword || watchedValues.confirmPassword);

    // Save button should be enabled only when:
    // 1. Form is dirty (values changed) AND
    // 2. No validation errors AND
    // 3. If changing password, all password fields must be filled
    const isSaveEnabled =
        isDirty &&
        !hasErrors &&
        (!isChangingPassword || (watchedValues.currentPassword && watchedValues.newPassword && watchedValues.confirmPassword));

    // Generate initials from first and last name
    const getInitials = () => {
        const firstInitial = watchedValues.firstName.charAt(0).toUpperCase();
        const lastInitial = watchedValues.lastName.charAt(0).toUpperCase();
        return `${firstInitial}${lastInitial}`;
    };

    const onSubmit = async (data) => {
        setIsLoading(true);

        // Prepare data for API call
        const updateData = {
            firstName: data.firstName,
            lastName: data.lastName,
            ...(isChangingPassword && {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            }),
        };

        console.log('Submitting data:', updateData);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);

            // Reset password fields on success
            if (isChangingPassword) {
                form.reset({
                    ...form.getValues(),
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }

            toast.success('Your account information has been successfully updated.');
        }, 1000);
    };

    return (
        <div className={'w-full h-full'}>
            {outlet || (
                <>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        <div className="mx-auto w-full max-w-4xl space-y-6 py-8">
                            {/* Profile Header */}
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                                    <AvatarFallback className="bg-primary text-3xl font-semibold text-primary-foreground">
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">
                                        {user.first_name} {user.last_name}
                                    </h1>
                                    <p className="text-muted-foreground">{user.email}</p>
                                </div>
                            </div>

                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6">
                                    {/* Personal Information */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <User className="h-5 w-5" />
                                                Personal Information
                                            </CardTitle>
                                            <CardDescription>
                                                Update your personal details and profile information.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <FormField
                                                    control={form.control}
                                                    name="firstName"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-2">
                                                            <FormLabel>First Name</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Enter your first name"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="lastName"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-2">
                                                            <FormLabel>Last Name</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Enter your last name"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel className="flex items-center gap-2">
                                                            <Mail className="h-4 w-4" />
                                                            Email Address
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="email"
                                                                disabled
                                                                className="cursor-not-allowed bg-muted"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>

                                    {/* Change Password */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Lock className="h-5 w-5" />
                                                Change Password
                                            </CardTitle>
                                            <CardDescription>
                                                Update your password to keep your account secure. Leave blank to keep current
                                                password.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name="currentPassword"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel>Current Password</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="password"
                                                                placeholder="Enter your current password"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="newPassword"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel>New Password</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="password"
                                                                placeholder="Enter your new password"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="confirmPassword"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel>Confirm New Password</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="password"
                                                                placeholder="Confirm your new password"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                    </Card>

                                    {/* Save Button */}
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={!isSaveEnabled || isLoading}>
                                            <Save className="mr-2 h-4 w-4" />
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
