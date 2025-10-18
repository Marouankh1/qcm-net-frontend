import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Lock, Save } from 'lucide-react';

const ChangePasswordForm = ({ form, onSubmit, isLoading, isSaveEnabled }) => {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                                            disabled={isLoading}
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
                                            disabled={isLoading}
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
                                            disabled={isLoading}
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
                            className={'cursor-pointer'}
                            disabled={!isSaveEnabled || isLoading}>
                            <Save className="mr-2 h-4 w-4" />
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
};

export default ChangePasswordForm;
