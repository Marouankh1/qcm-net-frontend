import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import useStudentStore from '@/stores/studentStore';
import { ArrowLeft, Clock, BookOpen, AlertTriangle, Play } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/header';

function QuizDetailsStudentPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentQuiz, fetchQuizDetails, startQuizAttempt, isLoading } = useStudentStore();
    const [isStarting, setIsStarting] = useState(false);

    useEffect(() => {
        if (id) {
            loadQuizDetails();
        }
    }, [id]);

    const loadQuizDetails = async () => {
        try {
            await fetchQuizDetails(id);
        } catch (error) {
            toast.error('Failed to load quiz details');
            navigate('/student/quizzes');
        }
    };

    const handleStartQuiz = async () => {
        if (!currentQuiz) return;

        setIsStarting(true);
        try {
            const attempt = await startQuizAttempt(currentQuiz.id);
            toast.success('Quiz started! Good luck!');
            navigate(`/student/quiz/${currentQuiz.id}/attempt`);
        } catch (error) {
            toast.error('Failed to start quiz');
        } finally {
            setIsStarting(false);
        }
    };

    if (isLoading) {
        return (
            <div>
                <Header title="Quiz Details" />
                <div className="p-6 mx-3 space-y-6">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="grid gap-4 md:grid-cols-2">
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                    </div>
                </div>
            </div>
        );
    }

    if (!currentQuiz) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Quiz Not Found</h2>
                    <p className="text-muted-foreground mb-4">The quiz you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate('/student/quizzes')}>Back to Quizzes</Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header title="Quiz Details" />
            <div className="p-6 mx-3 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate('/student/quizzes')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{currentQuiz.title}</h1>
                            <p className="text-muted-foreground">{currentQuiz.description}</p>
                        </div>
                    </div>
                </div>

                {/* Quiz Information */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Quiz Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Questions:</span>
                                <span className="font-medium">{currentQuiz.questions_count || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="font-medium">{currentQuiz.duration || 30} minutes</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Teacher:</span>
                                <span className="font-medium">
                                    {currentQuiz.teacher?.first_name} {currentQuiz.teacher?.last_name}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Instructions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    <span>Read each question carefully before answering</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    <span>You can only select one answer per question</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    <span>Your progress will be saved automatically</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    <span>You cannot go back to previous questions once answered</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Start Quiz Button */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <h3 className="text-xl font-semibold">Ready to start the quiz?</h3>
                            <p className="text-muted-foreground">
                                Once you start, the timer will begin and you'll need to complete all questions.
                            </p>
                            <Button
                                size="lg"
                                onClick={handleStartQuiz}
                                disabled={isStarting || isLoading}
                                className="gap-2">
                                <Play className="h-5 w-5" />
                                {isStarting ? 'Starting...' : 'Start Quiz'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default QuizDetailsStudentPage;
