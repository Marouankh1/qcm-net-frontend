import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, TrendingUp, Users, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import useDashboardStore from '@/stores/dashboardStore';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function TeacherContent() {
    const { stats, isLoading, error, fetchStats, clearError } = useDashboardStore();

    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            await fetchStats();
            setLastUpdated(new Date());
        } catch (error) {
            toast.error('Failed to load dashboard statistics');
        }
    };

    const handleRefresh = async () => {
        try {
            await fetchStats();
            setLastUpdated(new Date());
            toast.success('Dashboard updated successfully');
        } catch (error) {
            toast.error('Failed to refresh dashboard');
        }
    };

    // Format growth percentage with sign
    const formatGrowth = (value) => {
        if (value === 0) return '0%';
        const sign = value > 0 ? '+' : '';
        return `${sign}${value}%`;
    };

    // Get growth text color
    const getGrowthColor = (value) => {
        if (value > 0) return 'text-green-600';
        if (value < 0) return 'text-red-600';
        return 'text-muted-foreground';
    };

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
                    <Button onClick={loadStats}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-1 flex-col gap-4 px-8 py-6 pt-0">
                {/* Header with refresh button */}
                <div className="flex justify-between items-center mt-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Welcome to QCM-Net</h2>
                        <p className="text-muted-foreground">
                            Your quiz management platform
                            {lastUpdated && (
                                <span className="text-xs ml-2">(Last updated: {lastUpdated.toLocaleTimeString()})</span>
                            )}
                        </p>
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
                    {/* Total Quizzes */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16 mb-1" />
                            ) : (
                                <div className="text-2xl font-bold">{stats.total_quizzes}</div>
                            )}
                            <div className={`text-xs ${getGrowthColor(stats.growth_metrics.quizzes_growth)}`}>
                                {isLoading ? (
                                    <Skeleton className="h-4 w-24" />
                                ) : (
                                    `${formatGrowth(stats.growth_metrics.quizzes_growth)} from last month`
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Students */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16 mb-1" />
                            ) : (
                                <div className="text-2xl font-bold">{stats.active_students}</div>
                            )}
                            <div className="text-xs text-muted-foreground">
                                {isLoading ? <Skeleton className="h-4 w-24" /> : 'Students participated in your quizzes'}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Completion Rate */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16 mb-1" />
                            ) : (
                                <div className="text-2xl font-bold">{stats.completion_rate}%</div>
                            )}
                            <div className="text-xs text-muted-foreground">
                                {isLoading ? <Skeleton className="h-4 w-24" /> : 'Of quiz attempts completed'}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Average Score */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <Skeleton className="h-8 w-16 mb-1" />
                            ) : (
                                <div className="text-2xl font-bold">{stats.average_score}%</div>
                            )}
                            <div className="text-xs text-muted-foreground">
                                {isLoading ? <Skeleton className="h-4 w-24" /> : 'Average across all quizzes'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Quizzes & Top Performers */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Quizzes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Quizzes</CardTitle>
                            <CardDescription>Your latest created quizzes</CardDescription>
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
                                ) : stats.recent_quizzes.length > 0 ? (
                                    stats.recent_quizzes.map((quiz, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{quiz.title}</p>
                                                <p className="text-sm text-muted-foreground">{quiz.questions_count} questions</p>
                                            </div>
                                            <span className="text-sm text-muted-foreground">{quiz.created_at}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-center py-4">No quizzes created yet</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Performers */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Top Performers</CardTitle>
                            <CardDescription>Students with highest average scores</CardDescription>
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
                                            <Skeleton className="h-4 w-12" />
                                        </div>
                                    ))
                                ) : stats.top_performers.length > 0 ? (
                                    stats.top_performers.map((student, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">{student.name}</p>
                                                <p className="text-sm text-muted-foreground">{student.email}</p>
                                            </div>
                                            <span className="font-bold text-green-600">{student.average_score}%</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-center py-4">No student data available</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default TeacherContent;
