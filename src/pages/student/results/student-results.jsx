import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useStudentStore from '@/stores/studentStore';
import { Award, TrendingUp, Clock, BookOpen, RefreshCw, Eye, Play } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router';
import Header from '@/components/header';

function StudentResults() {
    const { myAttempts, fetchMyAttempts, isLoading } = useStudentStore();
    const [filter, setFilter] = useState('all'); // 'all', 'completed', 'in-progress'

    useEffect(() => {
        loadAttempts();
    }, []);

    const loadAttempts = async () => {
        try {
            await fetchMyAttempts();
        } catch (error) {
            toast.error('Failed to load results');
        }
    };

    const handleRefresh = async () => {
        try {
            await fetchMyAttempts();
            toast.success('Results updated successfully');
        } catch (error) {
            toast.error('Failed to refresh results');
        }
    };

    const filteredAttempts = myAttempts.filter((attempt) => {
        switch (filter) {
            case 'completed':
                return attempt.completed_at;
            case 'in-progress':
                return !attempt.completed_at;
            default:
                return true;
        }
    });

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getStatusBadge = (attempt) => {
        if (attempt.completed_at) {
            return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Completed</span>;
        }
        return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">In Progress</span>;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div>
            <Header title="My Results" />
            <div className="p-6 mx-3 space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">My Quiz Results</h2>
                        <p className="text-muted-foreground">View your quiz attempts and performance</p>
                    </div>
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        size="icon"
                        disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}>
                        All Attempts
                    </Button>
                    <Button
                        variant={filter === 'completed' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('completed')}>
                        Completed
                    </Button>
                    <Button
                        variant={filter === 'in-progress' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('in-progress')}>
                        In Progress
                    </Button>
                </div>

                {/* Results Grid */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-5 w-48" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                        <Skeleton className="h-8 w-24" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : filteredAttempts.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No results found</h3>
                            <p className="text-muted-foreground mb-4">
                                {filter === 'all'
                                    ? "You haven't attempted any quizzes yet."
                                    : `No ${filter.replace('-', ' ')} attempts found.`}
                            </p>
                            {filter === 'all' && (
                                <Link to="/student/quizzes">
                                    <Button>Browse Quizzes</Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {filteredAttempts.map((attempt) => (
                            <Card
                                key={attempt.id}
                                className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold">{attempt.quiz?.title || 'Quiz'}</h3>
                                                {getStatusBadge(attempt)}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>Started: {formatDate(attempt.attempt_date)}</span>
                                                </div>
                                                {attempt.completed_at && (
                                                    <div className="flex items-center gap-2">
                                                        <TrendingUp className="h-4 w-4" />
                                                        <span>Completed: {formatDate(attempt.completed_at)}</span>
                                                    </div>
                                                )}
                                                {attempt.quiz?.teacher && (
                                                    <div className="flex items-center gap-2">
                                                        <BookOpen className="h-4 w-4" />
                                                        <span>
                                                            By {attempt.quiz.teacher.first_name} {attempt.quiz.teacher.last_name}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {attempt.completed_at ? (
                                                <>
                                                    <div className="text-right">
                                                        <div
                                                            className={`text-2xl font-bold ${getScoreColor(
                                                                attempt.final_score
                                                            )}`}>
                                                            {attempt.final_score}%
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">Score</div>
                                                    </div>
                                                    <Link to={`/student/results/${attempt.id}`}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-2">
                                                            <Eye className="h-4 w-4" />
                                                            Details
                                                        </Button>
                                                    </Link>
                                                </>
                                            ) : (
                                                <Link to={`/student/quiz/${attempt.quiz?.id}/attempt`}>
                                                    <Button
                                                        size="sm"
                                                        className="gap-2 bg-orange-600 hover:bg-orange-700">
                                                        <Play className="h-4 w-4" />
                                                        Continue Quiz
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Statistics */}
                {!isLoading && filteredAttempts.length > 0 && filter === 'completed' && (
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.round(
                                        filteredAttempts.reduce((sum, attempt) => sum + attempt.final_score, 0) /
                                            filteredAttempts.length
                                    )}
                                    %
                                </div>
                                <p className="text-xs text-muted-foreground">Across all completed quizzes</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                                <Award className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.max(...filteredAttempts.map((attempt) => attempt.final_score))}%
                                </div>
                                <p className="text-xs text-muted-foreground">Your highest score</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{filteredAttempts.length}</div>
                                <p className="text-xs text-muted-foreground">Quizzes completed</p>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentResults;
