import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { User, Mail, Save } from 'lucide-react';

const PersonalInformationForm = ({ form, onSubmit, isLoading, isSaveEnabled }) => {
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Information
                        </CardTitle>
                        <CardDescription>Update your personal details and profile information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem
                                        className={`${
                                            Object.keys(form.formState.errors).length > 0 ? 'grid-rows-3' : 'grid-rows-2'
                                        }`}>
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
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem
                                        className={`${
                                            Object.keys(form.formState.errors).length > 0 ? 'grid-rows-3' : 'grid-rows-2'
                                        }`}>
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
                                    <FormDescription>Email address cannot be changed.</FormDescription>
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
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
};

export default PersonalInformationForm;
