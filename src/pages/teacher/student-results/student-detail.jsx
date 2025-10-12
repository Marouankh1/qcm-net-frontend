// pages/teacher/student-results/student-detail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, BarChart3, Calendar, Target, TrendingUp, Users } from 'lucide-react';
import useStudentResultsStore from '@/stores/studentResultsStore';
import { toast } from 'sonner';

function StudentDetailPage() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const { studentDetail, studentDetailLoading, studentDetailError, fetchStudentDetail } = useStudentResultsStore();

    useEffect(() => {
        if (studentId) {
            loadStudentDetail();
        }
    }, [studentId]);

    const loadStudentDetail = async () => {
        try {
            await fetchStudentDetail(studentId);
        } catch (error) {
            toast.error('Failed to load student details');
        }
    };

    const handleViewQuizResults = (quizId) => {
        navigate(`/teacher/student-results/${studentId}/quiz/${quizId}`);
    };

    if (studentDetailLoading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-8 w-16" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (studentDetailError || !studentDetail) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <div className="text-red-600 mb-4">Error loading student details</div>
                    <Button onClick={() => navigate('/teacher/student-results')}>Back to Students</Button>
                </div>
            </div>
        );
    }

    const { student, global_stats, progress_data } = studentDetail;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate('/teacher/student-results')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">
                        {student.first_name} {student.last_name}
                    </h1>
                    <p className="text-muted-foreground">{student.email}</p>
                </div>
            </div>

            {/* Global Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{global_stats?.total_quizzes_attempted || 0}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.round(global_stats?.average_score || 0)}%</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.round(global_stats?.best_score || 0)}%</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Excellent Results</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{global_stats?.excellent_results || 0}</div>
                        <p className="text-xs text-muted-foreground">Scores ≥ 80%</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Quiz Results */}
            <Card>
                <CardHeader>
                    <CardTitle>Quiz Results</CardTitle>
                    <CardDescription>Recent quiz attempts and scores</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {student.student_results?.length > 0 ? (
                            student.student_results.map((result) => (
                                <div
                                    key={result.id}
                                    className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{result.quiz.title}</h3>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(result.completed_at).toLocaleDateString()}
                                            </div>
                                            <div>
                                                {result.correct_answers} / {result.total_questions} correct
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Badge
                                            className={
                                                result.final_score >= 80
                                                    ? 'bg-green-100 text-green-800'
                                                    : result.final_score >= 60
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                            }>
                                            {result.final_score}%
                                        </Badge>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewQuizResults(result.quiz_id)}>
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">No quiz results found for this student.</div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Performance Distribution */}
            {global_stats && (
                <Card>
                    <CardHeader>
                        <CardTitle>Performance Distribution</CardTitle>
                        <CardDescription>Overview of student performance across all quizzes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{global_stats.excellent_results || 0}</div>
                                <div className="text-sm text-green-800">Excellent (80-100%)</div>
                            </div>
                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                <div className="text-2xl font-bold text-yellow-600">{global_stats.good_results || 0}</div>
                                <div className="text-sm text-yellow-800">Good (60-79%)</div>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">{global_stats.needs_improvement || 0}</div>
                                <div className="text-sm text-red-800">Needs Improvement (&lt;60%)</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default StudentDetailPage;
