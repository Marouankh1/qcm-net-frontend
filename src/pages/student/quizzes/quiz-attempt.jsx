import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/header';
import useStudentStore from '@/stores/studentStore';
import api from '@/services/api'; // Importez api

function QuizAttemptStudent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        currentQuiz,
        currentAttempt,
        fetchQuizDetails,
        startQuizAttempt, // Ajoutez cette fonction
        submitAnswer,
        submitQuiz,
        isLoading,
    } = useStudentStore();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes default
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [attempt, setAttempt] = useState(null); // State local pour l'attempt

    useEffect(() => {
        if (id) {
            loadQuizAndAttempt();
        }
    }, [id]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            handleAutoSubmit();
        }
    }, [timeLeft]);

    useEffect(() => {
        if (attempt) {
            loadExistingAnswers();
        }
    }, [attempt]);

    const loadQuizAndAttempt = async () => {
        try {
            // Chargez d'abord les détails du quiz
            await fetchQuizDetails(id);

            // Ensuite, démarrez ou récupérez l'attempt
            const attemptData = await startQuizAttempt(id);
            setAttempt(attemptData);
        } catch (error) {
            toast.error('Failed to load quiz');
            navigate('/student/quizzes');
        }
    };

    const loadExistingAnswers = async () => {
        try {
            if (!attempt?.id) return;

            // Chargez les réponses déjà soumises pour cet attempt
            const response = await api.get(`/student/attempts/${attempt.id}/answers`);
            if (response.data.success) {
                const existingAnswers = {};
                response.data.data.forEach((answer) => {
                    existingAnswers[answer.question_id] = answer.choice_id;
                });
                setSelectedAnswers(existingAnswers);
            }
        } catch (error) {
            // console.error('Error loading existing answers:', error);
        }
    };

    const handleAnswerSelect = async (questionId, choiceId) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: choiceId,
        }));

        try {
            await submitAnswer(questionId, choiceId);
        } catch (error) {
            toast.error('Failed to save answer');
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < (currentQuiz?.questions?.length || 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        if (!confirm('Are you sure you want to submit your quiz? You cannot change your answers after submission.')) {
            return;
        }

        if (!attempt?.id) {
            toast.error('No active quiz attempt found');
            return;
        }

        setIsSubmitting(true);
        try {
            await submitQuiz(attempt.id);
            toast.success('Quiz submitted successfully!');
            navigate('/student/results');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to submit quiz';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAutoSubmit = async () => {
        if (!attempt?.id) {
            toast.error('No active quiz attempt found');
            navigate('/student/quizzes');
            return;
        }

        setIsSubmitting(true);
        try {
            await submitQuiz(attempt.id);
            toast.success("Time's up! Quiz submitted automatically.");
            navigate('/student/results');
        } catch (error) {
            toast.error('Failed to submit quiz automatically');
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const currentQuestion = currentQuiz?.questions?.[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / (currentQuiz?.questions?.length || 1)) * 100;
    const isLastQuestion = currentQuestionIndex === (currentQuiz?.questions?.length || 0) - 1;

    useEffect(() => {
        if (currentQuiz && (!currentQuiz.questions || currentQuiz.questions.length === 0)) {
            toast.error('This quiz has no questions available.');
            navigate('/student/quizzes');
            return;
        }
    }, [currentQuiz, navigate]);

    if (isLoading || !currentQuiz || !attempt || !currentQuiz.questions || currentQuiz.questions.length === 0) {
        return (
            <div>
                <Header title="Taking Quiz" />
                <div className="p-6 mx-3 space-y-6">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header title="Taking Quiz" />
            <div className="p-6 mx-3 space-y-6">
                {/* Quiz Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => navigate('/student/quizzes')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{currentQuiz.title}</h1>
                            <p className="text-muted-foreground">
                                Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                            </p>
                        </div>
                    </div>

                    {/* Timer */}
                    <div
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                            timeLeft < 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                        <Clock className="h-4 w-4" />
                        <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <Progress
                    value={progress}
                    className="h-2"
                />

                {/* Current Question */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-start gap-3">
                            <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                {currentQuestionIndex + 1}
                            </span>
                            <div>
                                {currentQuestion?.question_text}
                                <CardDescription className="mt-2">
                                    {currentQuestion?.points} point{currentQuestion?.points !== 1 ? 's' : ''}
                                </CardDescription>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={selectedAnswers[currentQuestion?.id] || ''}
                            onValueChange={(value) => handleAnswerSelect(currentQuestion?.id, value)}
                            className="space-y-3">
                            {currentQuestion?.choices.map((choice, index) => (
                                <div
                                    key={choice.id}
                                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent transition-colors">
                                    <RadioGroupItem
                                        value={choice.id}
                                        id={`choice-${choice.id}`}
                                    />
                                    <Label
                                        htmlFor={`choice-${choice.id}`}
                                        className="flex-1 cursor-pointer text-base">
                                        {String.fromCharCode(65 + index)}. {choice.choice_text}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                    <Button
                        variant="outline"
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}>
                        Previous Question
                    </Button>

                    <div className="flex items-center gap-2">
                        {!isLastQuestion ? (
                            <Button onClick={handleNextQuestion}>Next Question</Button>
                        ) : (
                            <Button
                                onClick={handleSubmitQuiz}
                                disabled={isSubmitting}
                                className="bg-green-600 hover:bg-green-700">
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Question Navigation */}
                <Card>
                    <CardHeader>
                        <CardTitle>Question Navigation</CardTitle>
                        <CardDescription>Click on a question number to jump to it</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-5 gap-2">
                            {currentQuiz.questions.map((question, index) => (
                                <Button
                                    key={question.id}
                                    variant={currentQuestionIndex === index ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    className={`h-10 ${
                                        selectedAnswers[question.id] ? 'bg-green-100 text-green-800 border-green-200' : ''
                                    }`}>
                                    {index + 1}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default QuizAttemptStudent;
