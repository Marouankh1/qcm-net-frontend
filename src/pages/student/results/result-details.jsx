import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useStudentStore from '@/stores/studentStore';
import { ArrowLeft, CheckCircle2, XCircle, Award, BarChart3, BookOpen, Target, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/header';

function ResultDetails() {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    const { getQuizResults, isLoading } = useStudentStore();
    const [results, setResults] = useState(null);

    useEffect(() => {
        if (attemptId) {
            loadResults();
        }
    }, [attemptId]);

    const loadResults = async () => {
        try {
            const resultData = await getQuizResults(attemptId);
            setResults(resultData);
        } catch (error) {
            toast.error('Failed to load results');
            navigate('/student/results');
        }
    };

    if (isLoading || !results) {
        return (
            <div>
                <Header title="Quiz Results" />
                <div className="p-6 mx-3 space-y-6">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    const { attempt, result, question_details, summary } = results;

    return (
        <div>
            <Header title="Quiz Results" />
            <div className="p-6 mx-3 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate('/student/results')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{attempt.quiz.title}</h1>
                            <p className="text-muted-foreground">
                                Completed on {new Date(attempt.completed_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Score Summary */}
                <div className="grid gap-4 md:grid-cols-4">
                    {/* Final Score */}
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardContent className="p-6 text-center">
                            <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <div className="text-3xl font-bold text-green-800">{summary.final_score}%</div>
                            <p className="text-sm text-green-700">Final Score</p>
                        </CardContent>
                    </Card>

                    {/* Correct Answers */}
                    <Card>
                        <CardContent className="p-6 text-center">
                            <CheckSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-3xl font-bold">
                                {summary.correct_answers}/{summary.total_questions}
                            </div>
                            <p className="text-sm text-muted-foreground">Correct Answers</p>
                        </CardContent>
                    </Card>

                    {/* Success Rate */}
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <div className="text-3xl font-bold text-green-600">
                                {Math.round((summary.correct_answers / summary.total_questions) * 100) || 0}%
                            </div>
                            <p className="text-sm text-muted-foreground">Success Rate</p>
                        </CardContent>
                    </Card>

                    {/* Total Questions */}
                    <Card>
                        <CardContent className="p-6 text-center">
                            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-3xl font-bold">{summary.total_questions || 0}</div>
                            <p className="text-sm text-muted-foreground">Total Questions</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Question Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Question Review</CardTitle>
                        <CardDescription>Review your answers and see the correct solutions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {question_details.map((question, index) => (
                            <div
                                key={question.id}
                                className="border rounded-lg p-4">
                                <div className="flex items-start gap-3 mb-4">
                                    <div
                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                            question.student_answer?.is_correct
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2">{question.question_text}</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">Your answer:</span>
                                                <span
                                                    className={
                                                        question.student_answer?.is_correct ? 'text-green-600' : 'text-red-600'
                                                    }>
                                                    {question.student_answer?.choice_text || 'Not answered'}
                                                </span>
                                                {question.student_answer?.is_correct ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <XCircle className="h-4 w-4 text-red-600" />
                                                )}
                                            </div>
                                            {!question.student_answer?.is_correct && question.correct_answer && (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Correct answer:</span>
                                                    <span className="text-green-600">{question.correct_answer.choice_text}</span>
                                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center">
                    <Button onClick={() => navigate('/student/quizzes')}>Take Another Quiz</Button>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/student/results')}>
                        Back to Results
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ResultDetails;
