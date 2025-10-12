// pages/teacher/student-results/components/QuizStats.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3, Users, Target } from 'lucide-react';
import useStudentResultsStore from '@/stores/studentResultsStore';
import { useEffect } from 'react';

function QuizStats() {
    const { quizStats, quizStatsLoading, fetchQuizStats } = useStudentResultsStore();

    useEffect(() => {
        fetchQuizStats();
    }, []);

    const getPerformanceLevel = (score) => {
        if (score >= 80) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
        if (score >= 70) return { text: 'Good', color: 'bg-blue-100 text-blue-800' };
        if (score >= 60) return { text: 'Average', color: 'bg-yellow-100 text-yellow-800' };
        return { text: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
    };

    if (quizStatsLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-4 w-24" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizStats.map((quiz) => {
                const performance = getPerformanceLevel(quiz.average_score);

                return (
                    <Card
                        key={quiz.id}
                        className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-lg line-clamp-2">{quiz.title}</CardTitle>
                            <CardDescription>{quiz.attempts_count} attempts</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-2xl font-bold">{quiz.average_score}%</span>
                                </div>
                                <Badge className={performance.color}>{performance.text}</Badge>
                            </div>

                            {/* Top Performers */}
                            {quiz.top_performers.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Top Performers:</p>
                                    <div className="space-y-1">
                                        {quiz.top_performers.slice(0, 3).map((performer, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center text-sm">
                                                <span className="truncate flex-1">{performer.student_name}</span>
                                                <Badge
                                                    variant="outline"
                                                    className="ml-2 shrink-0">
                                                    {performer.score}%
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}

            {quizStats.length === 0 && (
                <div className="col-span-full">
                    <Card>
                        <CardContent className="text-center py-12">
                            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No quiz statistics available</h3>
                            <p className="text-muted-foreground mt-2">No students have attempted your quizzes yet.</p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default QuizStats;
