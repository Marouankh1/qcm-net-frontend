// pages/teacher/student-results/quiz-results-detail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Check, X, HelpCircle } from 'lucide-react';
import useStudentResultsStore from '@/stores/studentResultsStore';
import { toast } from 'sonner';

function QuizResultsDetailPage() {
    const { studentId, quizId } = useParams();
    const navigate = useNavigate();
    const { quizResults, quizResultsLoading, quizResultsError, fetchQuizResults } = useStudentResultsStore();

    useEffect(() => {
        if (studentId && quizId) {
            loadQuizResults();
        }
    }, [studentId, quizId]);

    const loadQuizResults = async () => {
        try {
            await fetchQuizResults(studentId, quizId);
        } catch (error) {
            toast.error('Failed to load quiz results');
        }
    };

    if (quizResultsLoading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-64" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                        {[...Array(5)].map((_, i) => (
                            <Skeleton
                                key={i}
                                className="h-20 w-full mb-4"
                            />
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (quizResultsError || !quizResults) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <div className="text-red-600 mb-4">Error loading quiz results</div>
                    <Button onClick={() => navigate(`/teacher/student-results/${studentId}`)}>Back to Student</Button>
                </div>
            </div>
        );
    }

    const { result, answer_details } = quizResults;
    const studentName = `${result.student?.first_name} ${result.student?.last_name}`;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/teacher/student-results/${studentId}`)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Quiz Results</h1>
                    <p className="text-muted-foreground">
                        {studentName} - {result.quiz.title}
                    </p>
                </div>
            </div>

            {/* Quiz Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Quiz Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{result.final_score}%</div>
                            <div className="text-sm text-blue-800">Final Score</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{result.correct_answers}</div>
                            <div className="text-sm text-green-800">Correct Answers</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-600">{result.total_questions}</div>
                            <div className="text-sm text-gray-800">Total Questions</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                                {Math.round((result.correct_answers / result.total_questions) * 100)}%
                            </div>
                            <div className="text-sm text-orange-800">Accuracy</div>
                        </div>
                    </div>
                    {result.completed_at && (
                        <div className="mt-4 text-sm text-muted-foreground">
                            Completed on: {new Date(result.completed_at).toLocaleString()}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Question Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Question Details</CardTitle>
                    <CardDescription>Review of student answers for each question</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {result.quiz.questions?.map((question, index) => {
                            const studentAnswer = answer_details[question.id]?.[0];
                            const correctChoice = question.choices.find((choice) => choice.is_correct);

                            return (
                                <div
                                    key={question.id}
                                    className="border rounded-lg p-4">
                                    <div className="flex items-start gap-3 mb-4">
                                        <Badge variant="outline">Q{index + 1}</Badge>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{question.question_text}</h3>
                                            <div className="mt-2 text-sm text-muted-foreground">Points: {question.points}</div>
                                        </div>
                                        <div>
                                            {studentAnswer?.is_correct ? (
                                                <Badge className="bg-green-100 text-green-800">
                                                    <Check className="h-3 w-3 mr-1" />
                                                    Correct
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-red-100 text-red-800">
                                                    <X className="h-3 w-3 mr-1" />
                                                    Incorrect
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid gap-3">
                                        {/* Correct Answer */}
                                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                                            <div className="flex items-center gap-2 text-sm font-medium text-green-800 mb-1">
                                                <Check className="h-4 w-4" />
                                                Correct Answer
                                            </div>
                                            <div>{correctChoice?.choice_text}</div>
                                        </div>

                                        {/* Student's Answer */}
                                        {studentAnswer ? (
                                            <div
                                                className={`p-3 border rounded ${
                                                    studentAnswer.is_correct
                                                        ? 'bg-green-50 border-green-200'
                                                        : 'bg-red-50 border-red-200'
                                                }`}>
                                                <div className="flex items-center gap-2 text-sm font-medium mb-1">
                                                    {studentAnswer.is_correct ? (
                                                        <>
                                                            <Check className="h-4 w-4 text-green-600" />
                                                            <span className="text-green-600">Student's Answer (Correct)</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <X className="h-4 w-4 text-red-600" />
                                                            <span className="text-red-600">Student's Answer (Incorrect)</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div>{studentAnswer.choice?.choice_text}</div>
                                            </div>
                                        ) : (
                                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                                <div className="flex items-center gap-2 text-sm font-medium text-yellow-800 mb-1">
                                                    <HelpCircle className="h-4 w-4" />
                                                    Not Answered
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default QuizResultsDetailPage;
