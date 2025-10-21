import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, GripVertical, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useNavigate, useParams } from 'react-router';
import useQuestionStore from '@/stores/questionStore';
import { toast } from 'sonner';
import useQuizStore from '@/stores/quizStore';

function FormAddQuestion() {
    const { id: quizId } = useParams();
    const navigate = useNavigate();

    const {
        getQuestionsByQuiz,
        getChoicesByQuestion,
        fetchQuestionsByQuiz,
        fetchAllChoices,
        createQuestionsWithChoices,
        refreshQuizData,
        isLoading,
        clearError,
        error,
    } = useQuestionStore();

    const [questions, setLocalQuestions] = useState([]);

    const { quizzes, fetchQuizzes } = useQuizStore();
    const [isQuizPublished, setIsQuizPublished] = useState(false);

    const checkQuizStatus = async () => {
        try {
            // Fetch quizzes if not already loaded
            if (quizzes.length === 0) {
                await fetchQuizzes();
            }

            // Find the current quiz
            const currentQuiz = quizzes.find((q) => q.id === parseInt(quizId));
            if (currentQuiz?.is_published) {
                setIsQuizPublished(true);
                toast.error('Cannot modify questions of a published quiz');
                // Optionally redirect back after a delay
                setTimeout(() => {
                    navigate(`/teacher/quiz/${quizId}`);
                }, 2000);
            }
        } catch (error) {
            // console.error('Error checking quiz status:', error);
        }
    };

    // Load existing questions for this quiz from API on component mount
    useEffect(() => {
        if (quizId) {
            loadQuizData();
            checkQuizStatus();
        }
    }, [quizId]);

    const loadQuizData = async () => {
        try {
            clearError();
            await fetchQuestionsByQuiz(quizId);
            await fetchAllChoices();

            // Update local questions from store
            const existingQuestions = getQuestionsByQuiz(parseInt(quizId));

            if (existingQuestions.length > 0) {
                const formattedQuestions = existingQuestions.map((q) => {
                    const choices = getChoicesByQuestion(q.id);
                    // Find the correct answer ID for radio group
                    const correctAnswer = choices.find((c) => c.is_correct);
                    return {
                        id: q.id.toString(),
                        text: q.question_text,
                        points: q.points,
                        correctAnswerId: correctAnswer ? correctAnswer.id.toString() : '',
                        answers: choices.map((c) => ({
                            id: c.id.toString(),
                            text: c.choice_text,
                            isCorrect: c.is_correct,
                        })),
                    };
                });
                setLocalQuestions(formattedQuestions);
            } else {
                // If no existing questions, start with one empty question
                setLocalQuestions([createEmptyQuestion()]);
            }
        } catch (error) {
            toast.error('Failed to load questions');
            // Start with one empty question even if loading fails
            setLocalQuestions([createEmptyQuestion()]);
        }
    };

    const createEmptyQuestion = () => {
        const questionId = `temp-${Date.now()}`;
        const answers = [
            { id: `${questionId}-a`, text: '', isCorrect: false },
            { id: `${questionId}-b`, text: '', isCorrect: false },
            { id: `${questionId}-c`, text: '', isCorrect: false },
            { id: `${questionId}-d`, text: '', isCorrect: false },
        ];
        return {
            id: questionId,
            text: '',
            points: 1,
            correctAnswerId: '', // No correct answer selected initially
            answers: answers,
        };
    };

    const addQuestion = () => {
        setLocalQuestions([...questions, createEmptyQuestion()]);
    };

    const removeQuestion = (questionId) => {
        if (questions.length > 1) {
            setLocalQuestions(questions.filter((q) => q.id !== questionId));
        } else {
            toast.error('You must have at least one question');
        }
    };

    const updateQuestion = (questionId, text) => {
        setLocalQuestions(questions.map((q) => (q.id === questionId ? { ...q, text } : q)));
    };

    const updateAnswer = (questionId, answerId, text) => {
        setLocalQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? {
                          ...q,
                          answers: q.answers.map((a) => (a.id === answerId ? { ...a, text } : a)),
                      }
                    : q
            )
        );
    };

    const handleCorrectAnswerChange = (questionId, answerId) => {
        setLocalQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? {
                          ...q,
                          correctAnswerId: answerId,
                          answers: q.answers.map((a) => ({
                              ...a,
                              isCorrect: a.id === answerId, // Set only the selected answer as correct
                          })),
                      }
                    : q
            )
        );
    };

    // const addAnswer = (questionId) => {
    //     const newAnswerId = `temp-${Date.now()}`;
    //     setLocalQuestions(
    //         questions.map((q) =>
    //             q.id === questionId
    //                 ? {
    //                       ...q,
    //                       answers: [...q.answers, { id: newAnswerId, text: '', isCorrect: false }],
    //                   }
    //                 : q
    //         )
    //     );
    // };

    // const removeAnswer = (questionId, answerId) => {
    //     setLocalQuestions(
    //         questions.map((q) => {
    //             if (q.id === questionId) {
    //                 const updatedAnswers = q.answers.filter((a) => a.id !== answerId);
    //                 const wasCorrectAnswer = q.correctAnswerId === answerId;

    //                 return {
    //                     ...q,
    //                     answers: updatedAnswers, // Supprimez cette ligne
    //                     correctAnswerId: wasCorrectAnswer ? '' : q.correctAnswerId,
    //                     answers: updatedAnswers.map((a) => ({
    //                         // Gardez seulement cette ligne
    //                         ...a,
    //                         isCorrect: wasCorrectAnswer ? false : a.isCorrect,
    //                     })),
    //                 };
    //             }
    //             return q;
    //         })
    //     );
    // };

    const removeAnswer = (questionId, answerId) => {
        setLocalQuestions(
            questions.map((q) => {
                if (q.id === questionId) {
                    const updatedAnswers = q.answers.filter((a) => a.id !== answerId);
                    const wasCorrectAnswer = q.correctAnswerId === answerId;

                    return {
                        ...q,
                        correctAnswerId: wasCorrectAnswer ? '' : q.correctAnswerId,
                        answers: updatedAnswers.map((a) => ({
                            ...a,
                            isCorrect: wasCorrectAnswer ? false : a.isCorrect,
                        })),
                    };
                }
                return q;
            })
        );
    };

    const validateQuestions = () => {
        // Validate all questions have text
        const emptyQuestions = questions.filter((q) => !q.text.trim());
        if (emptyQuestions.length > 0) {
            toast.error('Please fill in all question texts');
            return false;
        }

        // Validate all answers have text
        const emptyAnswers = questions.some((q) => q.answers.some((a) => !a.text.trim()));
        if (emptyAnswers) {
            toast.error('Please fill in all answer texts');
            return false;
        }

        // Validate at least one correct answer per question
        const questionsWithoutCorrectAnswer = questions.filter((q) => !q.correctAnswerId);
        if (questionsWithoutCorrectAnswer.length > 0) {
            toast.error('Each question must have one correct answer selected');
            return false;
        }

        // Validate minimum answers per question
        const questionsWithFewAnswers = questions.filter((q) => q.answers.length < 2);
        if (questionsWithFewAnswers.length > 0) {
            toast.error('Each question must have at least 2 answers');
            return false;
        }

        return true;
    };

    if (isQuizPublished) {
        return (
            <div className="p-6 mx-3 space-y-4">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                            <h3 className="font-bold text-lg">Quiz Published</h3>
                            <p>Cannot add or modify questions for a published quiz.</p>
                        </div>
                        <Button
                            onClick={() => navigate(`/teacher/quiz/${quizId}`)}
                            variant="default">
                            Back to Quiz
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSaveQuestions = async (e) => {
        e.preventDefault();

        if (!quizId) {
            toast.error('Quiz ID is required');
            return;
        }

        // Check if quiz is published before saving
        if (isQuizPublished) {
            toast.error('Cannot modify questions of a published quiz');
            return;
        }

        // Clear any previous errors
        clearError();

        // Validate questions
        if (!validateQuestions()) {
            return;
        }

        try {
            // Format data for API
            const questionsData = questions.map((question) => ({
                quiz_id: parseInt(quizId),
                question_text: question.text,
                question_type: 'multiple_choice',
                points: question.points,
                choices: question.answers.map((answer) => ({
                    choice_text: answer.text,
                    is_correct: answer.id === question.correctAnswerId, // Use radio button selection
                })),
            }));

            const result = await createQuestionsWithChoices(questionsData);

            if (result.success) {
                toast.success(result.message || 'Questions saved successfully!');

                // Refresh data to ensure we have everything
                await refreshQuizData(quizId);

                // Navigate back to quiz page
                navigate(`/teacher/quiz/${quizId}`);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save questions';
            toast.error(errorMessage);
        }
    };

    const handleRefresh = async () => {
        try {
            toast.info('Refreshing questions...');
            await loadQuizData();
            toast.success('Questions refreshed!');
        } catch (error) {
            toast.error('Failed to refresh questions');
        }
    };

    // Show loading state while fetching initial data
    if (isLoading && questions.length === 0) {
        return (
            <div className="p-6 mx-3 space-y-4">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Loading questions...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!quizId) {
        navigate('/');
        return null;
    }

    return (
        <div className="p-6 mx-3 space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Create Questions</h2>
                    <p className="text-muted-foreground">
                        Add questions and multiple choice answers (select one correct answer per question)
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        className={'cursor-pointer'}
                        onClick={handleRefresh}
                        variant="outline"
                        size="icon"
                        disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                        onClick={addQuestion}
                        variant="outline"
                        className="gap-2 text-white bg-primary hover:text-white hover:bg-primary/90 cursor-pointer"
                        disabled={isLoading}>
                        <Plus className="h-4 w-4" />
                        Add Question
                    </Button>
                </div>
            </div>

            {error && <div className="p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">{error}</div>}

            <form onSubmit={handleSaveQuestions}>
                <div className="space-y-6">
                    {questions.map((question, qIndex) => (
                        <Card key={question.id}>
                            <CardHeader>
                                <div className="flex items-start gap-3">
                                    <GripVertical className="h-5 w-5 text-muted-foreground mt-1" />
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <Label
                                                htmlFor={`question-${question.id}`}
                                                className="text-base">
                                                Question {qIndex + 1}
                                            </Label>
                                            <div className="flex gap-2">
                                                {/* <Button
                                                    type="button"
                                                    onClick={() => addAnswer(question.id)}
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={isLoading}>
                                                    Add Answer
                                                </Button> */}
                                                {questions.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeQuestion(question.id)}
                                                        className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
                                                        disabled={isLoading}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                        <Textarea
                                            id={`question-${question.id}`}
                                            placeholder="Enter your question here..."
                                            value={question.text}
                                            onChange={(e) => updateQuestion(question.id, e.target.value)}
                                            rows={2}
                                            disabled={isLoading}
                                            required
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground">
                                        Answer Options{' '}
                                        {question.answers.length < 2 && (
                                            <span className="text-destructive">(Minimum 2 answers required)</span>
                                        )}
                                        {!question.correctAnswerId && (
                                            <span className="text-destructive ml-2">(Select one correct answer)</span>
                                        )}
                                    </Label>

                                    <RadioGroup
                                        value={question.correctAnswerId}
                                        onValueChange={(value) => handleCorrectAnswerChange(question.id, value)}
                                        className="space-y-3">
                                        {question.answers.map((answer, aIndex) => (
                                            <div
                                                key={answer.id}
                                                className="flex items-center gap-3 p-2 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                                                <RadioGroupItem
                                                    value={answer.id}
                                                    id={`answer-${answer.id}`}
                                                    disabled={isLoading}
                                                />
                                                <Label
                                                    htmlFor={`answer-${answer.id}`}
                                                    className="flex-1 cursor-pointer">
                                                    <Input
                                                        placeholder={`Answer ${aIndex + 1}`}
                                                        value={answer.text}
                                                        onChange={(e) => updateAnswer(question.id, answer.id, e.target.value)}
                                                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                                                        disabled={isLoading}
                                                        required
                                                    />
                                                </Label>
                                                {question.answers.length > 2 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeAnswer(question.id, answer.id)}
                                                        className="h-8 w-8 text-destructive hover:text-destructive shrink-0 cursor-pointer"
                                                        disabled={isLoading}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Label className="text-sm text-muted-foreground">Points</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={10}
                                        placeholder="Points"
                                        value={question.points}
                                        onChange={(e) =>
                                            setLocalQuestions(
                                                questions.map((q) =>
                                                    q.id === question.id ? { ...q, points: parseInt(e.target.value) || 1 } : q
                                                )
                                            )
                                        }
                                        className="max-w-24"
                                        disabled={isLoading}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex gap-3 justify-end border-t pt-6 mt-6">
                    <Button
                        className={'cursor-pointer'}
                        type="button"
                        variant="outline"
                        onClick={() => navigate(`/teacher/quiz/${quizId}`)}
                        disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        className={'cursor-pointer'}
                        type="submit"
                        disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Questions'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default FormAddQuestion;
