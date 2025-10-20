import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import React from 'react';
import useAuthStore from '@/stores/authStore';
import useQuizStore from '@/stores/quizStore';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

const quizFormSchema = z.object({
    title: z
        .string()
        .min(1, { message: 'Quiz title is required' })
        .min(3, { message: 'Quiz title must be at least 3 characters' })
        .max(255, { message: 'Quiz title must not exceed 255 characters' }),
    description: z
        .string()
        .min(1, { message: 'Quiz Description is required' })
        .max(1000, { message: 'Description must not exceed 1000 characters' }),
});

const defaultValues = {
    title: '',
    description: '',
};

function AddQuizForm() {
    const { user } = useAuthStore();
    const { createQuiz, isLoading, error, clearError } = useQuizStore();
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(quizFormSchema),
        defaultValues,
    });

    async function onSubmit(data) {
        try {
            clearError();

            if (!user?.id) {
                toast.error('User not found. Please log in again.');
                return;
            }

            const quizData = { ...data, teacher_id: user.id };
            const result = await createQuiz(quizData);

            if (result.success) {
                toast.success('Quiz created successfully!');
                form.reset();
                navigate('/teacher/quizzes');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create quiz';
            toast.error(errorMessage);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quiz Information</CardTitle>
                <CardDescription>Basic details about your quiz</CardDescription>
            </CardHeader>
            <CardContent>
                {error && <div className="mb-4 p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">{error}</div>}

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quiz Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., Network Protocols Fundamentals"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormDescription>Enter a descriptive title for your quiz</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter a description for your quiz"
                                            className="min-h-[100px]"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormDescription>Provide additional context or instructions for the quiz</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-3 justify-end border-t pt-6">
                            <Button
                                type="submit"
                                className={'cursor-pointer disabled:cursor-none'}
                                disabled={!form.formState.isValid || isLoading}>
                                {isLoading ? 'Creating...' : 'Create Quiz'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default AddQuizForm;
