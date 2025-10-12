// pages/teacher/student-results/components/StudentResultsList.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, TrendingUp, TrendingDown, Minus, Users } from 'lucide-react';
import useStudentResultsStore from '@/stores/studentResultsStore';
import { useNavigate } from 'react-router';

function StudentResultsList() {
    const { students, studentsLoading, pagination } = useStudentResultsStore();
    const navigate = useNavigate();

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBadge = (score) => {
        if (score >= 80) return 'bg-green-100 text-green-800';
        if (score >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    const getTrendIcon = (score) => {
        if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-600" />;
        if (score >= 60) return <Minus className="h-4 w-4 text-yellow-600" />;
        return <TrendingDown className="h-4 w-4 text-red-600" />;
    };

    if (studentsLoading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                                <div className="flex gap-4">
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton className="h-8 w-24" />
                                    <Skeleton className="h-8 w-20" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {students.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No students found</h3>
                        <p className="text-muted-foreground mt-2">No students have attempted your quizzes yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {students.map((student) => (
                        <Card
                            key={student.id}
                            className="hover:shadow-lg transition-shadow">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-lg">
                                                {student.first_name} {student.last_name}
                                            </h3>
                                            <Badge variant="outline">{student.quizzes_attempted} quizzes</Badge>
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-3">{student.email}</p>

                                        {/* Recent quizzes */}
                                        <div className="space-y-1">
                                            {student.student_results?.slice(0, 2).map((result, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 text-sm">
                                                    <span className="text-muted-foreground">{result.quiz.title}:</span>
                                                    <Badge className={getScoreBadge(result.final_score)}>
                                                        {result.final_score}%
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(result.completed_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        {/* Average Score */}
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 mb-1">
                                                {getTrendIcon(student.average_score)}
                                                <span className={`text-2xl font-bold ${getScoreColor(student.average_score)}`}>
                                                    {student.average_score ? Math.round(student.average_score) : 0}%
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Average</p>
                                        </div>

                                        {/* Actions */}
                                        <Button
                                            onClick={() => navigate(`/teacher/student-results/${student.id}`)}
                                            variant="outline"
                                            size="sm">
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </>
            )}
        </div>
    );
}

export default StudentResultsList;
