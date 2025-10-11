import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteQuiz, useQuizzes } from '@/hooks/react-query/quizzes/useQuiz';
import useAuthStore from '@/stores/authStore';
import useQuizStore from '@/stores/quizStore';
import { BarChart3, Edit, Eye, MoreVertical, Search, Trash2, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import EmptyQuizzes from '@/pages/teacher/quizzes/show/components/empty-quizzes';

function QuizzesList() {
    const { user } = useAuthStore();
    const { setQuizzes, setCurrentQuiz } = useQuizStore();
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Use the query hook
    const { data: quizzesData, isLoading, error, refetch } = useQuizzes({ search: searchTerm });

    const deleteQuizMutation = useDeleteQuiz();

    // Sync with Zustand store when data loads
    useEffect(() => {
        if (quizzesData?.data) {
            setQuizzes(quizzesData.data);
        }
    }, [quizzesData, setQuizzes]);

    const handleDeleteQuiz = async (quizId) => {
        try {
            await deleteQuizMutation.mutateAsync(quizId);
            // The invalidateQueries in the mutation will automatically refetch the data
        } catch (error) {
            // Error handling is already done in the mutation
        }
    };

    const handleEditQuiz = (quiz) => {
        setCurrentQuiz(quiz);
        // Navigate to edit page or open modal
    };

    const handleSearch = () => {
        setSearchTerm(searchInput);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Card
                        key={i}
                        className="flex flex-col">
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3 mt-2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-1/2 mb-2" />
                            <Skeleton className="h-4 w-1/3" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-4 w-2/3" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    // Error state
    // if (error) {
    //     return (
    //         <div className="text-center py-8">
    //             <p className="text-destructive mb-4">Failed to load quizzes</p>
    //             <Button onClick={() => refetch()}>Try Again</Button>
    //         </div>
    //     );
    // }

    console.log('quizzesData');
    console.log(quizzesData);

    const quizzes = quizzesData?.data || quizzesData || [];

    console.log('Quizzes:', quizzes);

    return (
        <>
            {/* <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search quizzes..."
                        className="pl-9"
                    />
                </div>
            </div> */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search quizzes..."
                        className="pl-9 bg-white/80"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <Button
                    onClick={handleSearch}
                    variant="default">
                    Search
                </Button>
            </div>
            {quizzes.length === 0 ? (
                <EmptyQuizzes
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setSearchInput={setSearchInput}
                />
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz) => (
                        <Card
                            key={quiz.id}
                            className="flex flex-col hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl leading-tight">{quiz.title}</CardTitle>
                                        <CardDescription className="mt-2 line-clamp-2">{quiz.description}</CardDescription>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Quiz
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <BarChart3 className="h-4 w-4" />
                                        <span>12 questions</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>24 students</span>
                                    </div>
                                </div>
                            </CardContent>
                            {/* <CardFooter className="text-xs text-muted-foreground border-t pt-4">Created {quiz.created_at}</CardFooter> */}
                            <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                                Created {formatDistanceToNow(new Date(quiz.created_at))} ago
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}

export default QuizzesList;
