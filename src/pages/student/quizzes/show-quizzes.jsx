import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import useStudentStore from '@/stores/studentStore';
import { BookOpen, Clock, Users, Search, Play, RefreshCw, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import Header from '@/components/header';

function ShowQuizzesStudent() {
    const { availableQuizzes, isLoading, fetchAvailableQuizzes } = useStudentStore();
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadQuizzes();
    }, []);

    const loadQuizzes = async () => {
        try {
            await fetchAvailableQuizzes();
        } catch (error) {
            toast.error('Failed to load quizzes');
        }
    };

    const handleSearch = () => {
        const trimmedInput = searchInput.trim();
        if (trimmedInput !== searchTerm) {
            setSearchTerm(trimmedInput);
        }
    };

    const handleClearSearch = () => {
        setSearchInput('');
        if (searchTerm !== '') {
            setSearchTerm('');
        }
    };

    const handleRefresh = () => {
        loadQuizzes();
    };

    const filteredQuizzes = availableQuizzes.filter(
        (quiz) =>
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Header title="Available Quizzes" />
            <div className="p-6 mx-3 space-y-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Available Quizzes</h2>
                        <p className="text-muted-foreground">Choose a quiz to test your knowledge</p>
                    </div>
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        size="icon"
                        disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search quizzes by title or description..."
                            className="pl-9 bg-white/80"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            disabled={isLoading}
                        />
                    </div>
                    <Button
                        onClick={handleSearch}
                        variant="default"
                        disabled={isLoading}>
                        Search
                    </Button>
                    {(searchInput || searchTerm) && (
                        <Button
                            onClick={handleClearSearch}
                            variant="outline"
                            disabled={isLoading}>
                            Clear
                        </Button>
                    )}
                </div>

                {/* Quizzes Grid */}
                {isLoading ? (
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
                ) : filteredQuizzes.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No quizzes available</h3>
                        <p className="text-muted-foreground">
                            {searchTerm
                                ? `No quizzes found matching "${searchTerm}"`
                                : 'No quizzes are currently available. Check back later!'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 text-sm text-muted-foreground">
                            {searchTerm ? (
                                <p>
                                    Found {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? 'zes' : ''} matching "
                                    {searchTerm}"
                                </p>
                            ) : (
                                <p>
                                    Showing {filteredQuizzes.length} available quiz{filteredQuizzes.length !== 1 ? 'zes' : ''}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredQuizzes.map((quiz) => (
                                <Card
                                    key={quiz.id}
                                    className="flex flex-col hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="text-xl leading-tight">{quiz.title}</CardTitle>
                                        <CardDescription className="mt-2 line-clamp-3">{quiz.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 space-y-3">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{quiz.questions_count || 0} questions</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>{quiz.duration || 30} min</span>
                                            </div>
                                        </div>
                                        {quiz.teacher && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                                                <User className="h-4 w-4" />
                                                <span>
                                                    By {quiz.teacher.first_name} {quiz.teacher.last_name}
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter>
                                        <Link
                                            to={`/student/quiz/${quiz.id}`}
                                            className="w-full">
                                            <Button className="w-full gap-2">
                                                <Play className="h-4 w-4" />
                                                Start Quiz
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ShowQuizzesStudent;
