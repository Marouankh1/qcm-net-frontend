import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import useAuthStore from '@/stores/authStore';
import useQuizStore from '@/stores/quizStore';
import { BarChart3, Eye, FileQuestionMark, MoreVertical, Search, Trash2, Users, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import EmptyQuizzes from '@/pages/teacher/quizzes/show/components/empty-quizzes';
import { Link } from 'react-router';
import { toast } from 'sonner';

function QuizzesList() {
    const { user } = useAuthStore();
    const { quizzes, isLoading, fetchQuizzes, deleteQuiz, setCurrentQuiz, clearError, error } = useQuizStore();

    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Load quizzes on component mount and when search term changes
    useEffect(() => {
        loadQuizzes();
    }, [searchTerm]);

    const loadQuizzes = async () => {
        try {
            clearError();
            const filters = searchTerm ? { search: searchTerm } : {};
            await fetchQuizzes(filters);
        } catch (error) {
            // console.error('Error loading quizzes:', error);
            // Error is handled in the store and will be displayed
        }
    };

    const handleDeleteQuiz = async (quizId) => {
        try {
            if (!quizId) {
                toast.error('Quiz ID is required');
                return;
            }

            if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
                return;
            }

            await deleteQuiz(quizId);
            toast.success('Quiz deleted successfully!');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete quiz';
            toast.error(errorMessage);
        }
    };

    const handleSearch = () => {
        const trimmedInput = searchInput.trim();

        // Only set searchTerm if the input has changed or if we're clearing a previous search
        if (trimmedInput !== searchTerm) {
            setSearchTerm(trimmedInput);
        }
        // If both are empty, do nothing (no unnecessary API call)
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClearSearch = () => {
        setSearchInput('');
        // Only set searchTerm to empty if it's not already empty
        if (searchTerm !== '') {
            setSearchTerm('');
        }
    };

    const handleRefresh = () => {
        loadQuizzes();
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

    return (
        <>
            {error && <div className="mb-4 p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">{error}</div>}

            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search quizzes by title or description..."
                        className="pl-9 bg-white/80"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                </div>
                <Button
                    onClick={handleSearch}
                    variant="default"
                    className={'cursor-pointer'}
                    disabled={isLoading}>
                    Search
                </Button>
                {(searchInput || searchTerm) && (
                    <Button
                        className={'cursor-pointer'}
                        onClick={handleClearSearch}
                        variant="outline"
                        disabled={isLoading}>
                        Clear
                    </Button>
                )}
                <Button
                    className={'cursor-pointer'}
                    onClick={handleRefresh}
                    variant="outline"
                    size="icon"
                    disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {quizzes.length === 0 ? (
                <EmptyQuizzes
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setSearchInput={setSearchInput}
                />
            ) : (
                <>
                    <div className="mb-4 text-sm text-muted-foreground">
                        {searchTerm ? (
                            <p>
                                Found {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} matching "{searchTerm}"
                            </p>
                        ) : (
                            <p>
                                Showing {quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''}
                            </p>
                        )}
                    </div>

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
                                                    className="h-8 w-8 cursor-pointer"
                                                    disabled={isLoading}>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        to={`/teacher/quiz/${quiz.id}`}
                                                        className="flex items-center gap-2 w-full cursor-pointer">
                                                        <Eye className="h-4 w-4" />
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link
                                                        to={`/teacher/quiz/${quiz.id}/questions/create`}
                                                        className="flex items-center gap-2 w-full cursor-pointer">
                                                        <FileQuestionMark className="h-4 w-4" />
                                                        Add Questions
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    asChild>
                                                    <button
                                                        className="flex items-center gap-2 w-full text-left cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none bg-transparent p-2"
                                                        disabled={isLoading || quiz.participants_count > 0}
                                                        onClick={() => handleDeleteQuiz(quiz.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                        {isLoading ? 'Deleting...' : 'Delete'}
                                                    </button>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <BarChart3 className="h-4 w-4" />
                                            <span>{quiz.questions_count || 0} questions</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            <span>{quiz.participants_count || 0} students</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                                    Created {formatDistanceToNow(new Date(quiz.created_at))} ago
                                    {quiz.is_published ? (
                                        <span className="ml-2 text-green-600 font-medium">• Published</span>
                                    ) : (
                                        <span className="ml-2 text-red-600 font-medium">• Not Published</span>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </>
    );
}

export default QuizzesList;
