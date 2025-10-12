import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, TrendingUp, Award, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router';
import useStudentStore from '@/stores/studentStore';

function StudentContent() {
    const { myAttempts, fetchMyAttempts, isLoading } = useStudentStore();
    const [stats, setStats] = useState({
        totalQuizzes: 0,
        averageScore: 0,
        completedQuizzes: 0,
        bestScore: 0,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            await fetchMyAttempts();
        } catch (error) {
            toast.error('Failed to load dashboard data');
        }
    };

    useEffect(() => {
        if (myAttempts.length > 0) {
            const completed = myAttempts.filter((attempt) => attempt.completed_at);
            const scores = completed.map((attempt) => attempt.final_score || 0);
            const average = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
            const best = Math.max(...scores, 0);

            setStats({
                totalQuizzes: myAttempts.length,
                averageScore: Math.round(average),
                completedQuizzes: completed.length,
                bestScore: Math.round(best),
            });
        }
    }, [myAttempts]);

    const handleRefresh = async () => {
        try {
            await fetchMyAttempts();
            toast.success('Dashboard updated successfully');
        } catch (error) {
            toast.error('Failed to refresh dashboard');
        }
    };

    const getRecentAttempts = () => {
        return myAttempts.sort((a, b) => new Date(b.attempt_date) - new Date(a.attempt_date)).slice(0, 3);
    };

    return (
        <div className="flex flex-1 flex-col gap-4 px-8 py-6 pt-0">
            {/* Header with refresh button */}
            <div className="flex justify-between items-center mt-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Welcome to QCM-Net</h2>
                    <p className="text-muted-foreground">Your learning dashboard</p>
                </div>
                <Button
                    onClick={handleRefresh}
                    variant="outline"
                    size="icon"
                    disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16 mb-1" />
                        ) : (
                            <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
                        )}
                        <p className="text-xs text-muted-foreground">Quizzes attempted</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16 mb-1" />
                        ) : (
                            <div className="text-2xl font-bold">{stats.completedQuizzes}</div>
                        )}
                        <p className="text-xs text-muted-foreground">Quizzes completed</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16 mb-1" />
                        ) : (
                            <div className="text-2xl font-bold">{stats.averageScore}%</div>
                        )}
                        <p className="text-xs text-muted-foreground">Your average performance</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-16 mb-1" />
                        ) : (
                            <div className="text-2xl font-bold">{stats.bestScore}%</div>
                        )}
                        <p className="text-xs text-muted-foreground">Your highest score</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions & Recent Attempts */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Start a new quiz or view your progress</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Link to="/student/quizzes">
                                <Button
                                    className="w-full justify-start gap-2"
                                    variant="outline">
                                    <BookOpen className="h-4 w-4" />
                                    Browse Available Quizzes
                                </Button>
                            </Link>
                            <Link to="/student/results">
                                <Button
                                    className="w-full justify-start gap-2"
                                    variant="outline">
                                    <TrendingUp className="h-4 w-4" />
                                    View My Results
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Attempts */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Attempts</CardTitle>
                        <CardDescription>Your latest quiz attempts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                ))
                            ) : getRecentAttempts().length > 0 ? (
                                getRecentAttempts().map((attempt, index) => (
                                    <div
                                        key={attempt.id}
                                        className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{attempt.quiz?.title || 'Quiz'}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(attempt.attempt_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            {attempt.completed_at ? (
                                                <span className="font-bold text-green-600">{attempt.final_score}%</span>
                                            ) : (
                                                <span className="text-orange-600 font-medium">In Progress</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted-foreground text-center py-4">No quiz attempts yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default StudentContent;
