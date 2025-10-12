import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Lock, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useOutlet } from 'react-router';
import useAuthStore from '@/stores/authStore';
import useAccountStore from '@/stores/accountStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';

// Validation schema pour les informations personnelles
const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
    email: z.string().email('Invalid email address'),
});

// Validation schema pour le mot de passe
const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

export default function AccountPage() {
    const outlet = useOutlet();
    const { user, login } = useAuthStore();
    const { isLoading, isPasswordLoading, error, updateProfile, updatePassword, clearError } = useAccountStore();

    // Form for profile information
    const profileForm = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.first_name || '',
            lastName: user?.last_name || '',
            email: user?.email || '',
        },
        mode: 'onChange',
    });

    // Form for password change
    const passwordForm = useForm({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        mode: 'onChange',
    });

    // Generate initials from first and last name
    const getInitials = () => {
        const firstName = profileForm.watch('firstName');
        const lastName = profileForm.watch('lastName');
        const firstInitial = firstName.charAt(0).toUpperCase();
        const lastInitial = lastName.charAt(0).toUpperCase();
        return `${firstInitial}${lastInitial}`;
    };

    // Handle profile information update
    const onProfileSubmit = async (data) => {
        try {
            clearError();
            const result = await updateProfile({
                firstName: data.firstName,
                lastName: data.lastName,
            });

            if (result.success) {
                // Update the user in the auth store
                login(result.data);
                toast.success('Profile information updated successfully!');

                // Reset form state to reflect new values
                profileForm.reset({
                    firstName: result.data.first_name,
                    lastName: result.data.last_name,
                    email: result.data.email,
                });
            }
        } catch (error) {
            console.error('Profile update error:', error);

            // Show validation errors if any
            if (error.errors) {
                Object.keys(error.errors).forEach((field) => {
                    const fieldErrors = error.errors[field];
                    profileForm.setError(field.toLowerCase(), {
                        type: 'server',
                        message: fieldErrors[0],
                    });
                });
            } else {
                toast.error(error.message);
            }
        }
    };

    // Handle password change
    const onPasswordSubmit = async (data) => {
        try {
            clearError();
            const result = await updatePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
                newPassword_confirmation: data.confirmPassword,
            });

            if (result.success) {
                toast.success('Password updated successfully!');

                // Reset password form
                passwordForm.reset({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            }
        } catch (error) {
            console.error('Password update error:', error);

            // Show validation errors if any
            if (error.errors) {
                Object.keys(error.errors).forEach((field) => {
                    const fieldName = field === 'newPassword_confirmation' ? 'confirmPassword' : field;
                    const fieldErrors = error.errors[field];
                    passwordForm.setError(fieldName, {
                        type: 'server',
                        message: fieldErrors[0],
                    });
                });
            } else {
                toast.error(error.message);
            }
        }
    };

    // Check if profile form has changes
    const isProfileDirty = profileForm.formState.isDirty;
    const hasProfileErrors = Object.keys(profileForm.formState.errors).length > 0;
    const isProfileSaveEnabled = isProfileDirty && !hasProfileErrors;

    // Check if password form is valid and has values
    const isPasswordValid = passwordForm.formState.isValid;
    const isPasswordDirty = passwordForm.formState.isDirty;
    const isPasswordSaveEnabled = isPasswordValid && isPasswordDirty;

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
                                    <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">{error}</div>
                            )}

                            {/* Personal Information Form */}
                            <Form {...profileForm}>
                                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
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
                                                    control={profileForm.control}
                                                    name="firstName"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-2">
                                                            <FormLabel>First Name</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Enter your first name"
                                                                    {...field}
                                                                    disabled={isLoading}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={profileForm.control}
                                                    name="lastName"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-2">
                                                            <FormLabel>Last Name</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Enter your last name"
                                                                    {...field}
                                                                    disabled={isLoading}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <FormField
                                                control={profileForm.control}
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
                                                        <FormDescription>Email address cannot be changed.</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                        <CardFooter className="flex justify-end border-t pt-4">
                                            <Button
                                                type="submit"
                                                disabled={!isProfileSaveEnabled || isLoading}>
                                                <Save className="mr-2 h-4 w-4" />
                                                {isLoading ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </form>
                            </Form>

                            {/* Change Password Form */}
                            <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Lock className="h-5 w-5" />
                                                Change Password
                                            </CardTitle>
                                            <CardDescription>Update your password to keep your account secure.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <FormField
                                                control={passwordForm.control}
                                                name="currentPassword"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel>Current Password</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="password"
                                                                placeholder="Enter your current password"
                                                                {...field}
                                                                disabled={isPasswordLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={passwordForm.control}
                                                name="newPassword"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel>New Password</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="password"
                                                                placeholder="Enter your new password"
                                                                {...field}
                                                                disabled={isPasswordLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={passwordForm.control}
                                                name="confirmPassword"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <FormLabel>Confirm New Password</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="password"
                                                                placeholder="Confirm your new password"
                                                                {...field}
                                                                disabled={isPasswordLoading}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </CardContent>
                                        <CardFooter className="flex justify-end border-t pt-4">
                                            <Button
                                                type="submit"
                                                disabled={!isPasswordSaveEnabled || isPasswordLoading}>
                                                <Save className="mr-2 h-4 w-4" />
                                                {isPasswordLoading ? 'Updating...' : 'Update Password'}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </form>
                            </Form>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
