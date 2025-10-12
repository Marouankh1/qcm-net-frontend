import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import useQuizStore from '@/stores/quizStore';
import useQuestionStore from '@/stores/questionStore';
import { toast } from 'sonner';

function QuizDetails() {
    const { currentQuiz, isLoading: quizLoading } = useQuizStore();
    const { id: quizId } = useParams();
    const navigate = useNavigate();

    const { fetchQuiz, updateQuiz, publishQuiz } = useQuizStore();

    const {
        getQuestionsByQuiz,
        getChoicesByQuestion,
        fetchQuestionsByQuiz,
        fetchAllChoices,
        isLoading: questionLoading,
    } = useQuestionStore();

    const [isEditing, setIsEditing] = useState(false);
    const [isEditingQuestions, setIsEditingQuestions] = useState(false);
    const [quizData, setQuizData] = useState({
        title: '',
        description: '',
    });
    const [questions, setQuestions] = useState([]);
    const [originalQuizData, setOriginalQuizData] = useState(null);
    const [originalQuestions, setOriginalQuestions] = useState([]);

    // Load quiz data
    useEffect(() => {
        if (quizId) {
            loadQuizData();
        }
    }, [quizId]);

    const loadQuizData = async () => {
        try {
            await fetchQuiz(quizId);
            await fetchQuestionsByQuiz(quizId);
            await fetchAllChoices();

            // Update local state with quiz data
            if (currentQuiz) {
                const quizData = {
                    title: currentQuiz.title || '',
                    description: currentQuiz.description || '',
                };
                setQuizData(quizData);
                setOriginalQuizData(quizData);
            }

            // Update local state with questions
            const existingQuestions = getQuestionsByQuiz(parseInt(quizId));
            if (existingQuestions.length > 0) {
                const formattedQuestions = existingQuestions.map((q) => {
                    const choices = getChoicesByQuestion(q.id);
                    // Find the correct answer for radio button
                    const correctAnswer = choices.find((c) => c.is_correct);
                    return {
                        id: q.id.toString(),
                        text: q.question_text,
                        points: q.points || 1,
                        correctAnswerId: correctAnswer ? correctAnswer.id.toString() : '',
                        answers: choices.map((c) => ({
                            id: c.id.toString(),
                            text: c.choice_text,
                            isCorrect: c.is_correct,
                        })),
                    };
                });
                setQuestions(formattedQuestions);
                setOriginalQuestions(JSON.parse(JSON.stringify(formattedQuestions)));
            }
        } catch (error) {
            console.error('Error loading quiz data:', error);
            toast.error('Failed to load quiz data');
        }
    };

    const handleEditQuiz = () => {
        setIsEditing(true);
    };

    const handleCancelEditQuiz = () => {
        setQuizData(originalQuizData);
        setIsEditing(false);
    };

    const handleSaveQuiz = async () => {
        try {
            // Only send title and description in the request
            const updateData = {
                title: quizData.title,
                description: quizData.description,
            };

            await updateQuiz(parseInt(quizId), updateData);
            setOriginalQuizData(quizData);
            setIsEditing(false);
            toast.success('Quiz updated successfully!');
        } catch (error) {
            console.error('Error updating quiz:', error);
            toast.error('Failed to update quiz');
        }
    };

    const handleEditQuestions = () => {
        setIsEditingQuestions(true);
    };

    const handleCancelEditQuestions = () => {
        setQuestions(JSON.parse(JSON.stringify(originalQuestions)));
        setIsEditingQuestions(false);
    };

    const handleSaveQuestions = async () => {
        try {
            // Here you would implement the update questions logic
            // For now, just save locally
            setOriginalQuestions(JSON.parse(JSON.stringify(questions)));
            setIsEditingQuestions(false);
            toast.success('Questions updated successfully!');
        } catch (error) {
            console.error('Error updating questions:', error);
            toast.error('Failed to update questions');
        }
    };

    const updateQuestion = (questionId, text) => {
        setQuestions(questions.map((q) => (q.id === questionId ? { ...q, text } : q)));
    };

    const updateAnswer = (questionId, answerId, text) => {
        setQuestions(
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
        setQuestions(
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

    const updateQuizField = (field, value) => {
        setQuizData((prev) => ({ ...prev, [field]: value }));
    };

    const handlePublishToggle = async () => {
        try {
            const newPublishStatus = !currentQuiz?.is_published;
            await publishQuiz(parseInt(quizId), newPublishStatus);
            toast.success(`Quiz ${newPublishStatus ? 'published' : 'unpublished'} successfully!`);
        } catch (error) {
            console.error('Error updating publish status:', error);
            toast.error('Failed to update publish status');
        }
    };

    const isLoading = quizLoading || questionLoading;

    // Check if quiz is published
    const isPublished = currentQuiz?.is_published;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading quiz...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6 w-full">
            {/* Quiz Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{currentQuiz?.title || 'Quiz Details'}</h2>
                    <p className="text-muted-foreground">{currentQuiz?.description || 'View and manage quiz details'}</p>
                    {isPublished && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Published
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/teacher/quizzes')}>
                        Back to Quizzes
                    </Button>
                </div>
            </div>

            {/* Quiz Information Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Quiz Information</CardTitle>
                            <CardDescription>Basic details about your quiz</CardDescription>
                        </div>
                        {!isPublished && !isEditing ? (
                            <Button
                                onClick={handleEditQuiz}
                                variant="outline"
                                className="gap-2"
                                disabled={isEditingQuestions}>
                                <Edit className="h-4 w-4" />
                                Edit Quiz
                            </Button>
                        ) : !isPublished && isEditing ? (
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleCancelEditQuiz}
                                    variant="outline"
                                    className="gap-2">
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveQuiz}
                                    className="gap-2">
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </Button>
                            </div>
                        ) : null}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Quiz Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Network Protocols Fundamentals"
                            value={quizData.title}
                            onChange={(e) => updateQuizField('title', e.target.value)}
                            disabled={!isEditing || isPublished}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Provide a brief description of what this quiz covers..."
                            rows={3}
                            value={quizData.description}
                            onChange={(e) => updateQuizField('description', e.target.value)}
                            disabled={!isEditing || isPublished}
                        />
                    </div>

                    {/* Quiz Metadata (Read-only) */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                            <Label className="text-sm text-muted-foreground">Status</Label>
                            <p className="text-sm font-medium">
                                {currentQuiz?.is_published ? (
                                    <span className="text-green-600">Published</span>
                                ) : (
                                    <span className="text-orange-600">Draft</span>
                                )}
                            </p>
                        </div>
                        <div>
                            <Label className="text-sm text-muted-foreground">Created</Label>
                            <p className="text-sm font-medium">
                                {currentQuiz?.created_at ? new Date(currentQuiz.created_at).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Questions Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Questions ({questions.length})</CardTitle>
                            <CardDescription>Questions and multiple choice answers for this quiz</CardDescription>
                        </div>
                        {!isPublished && !isEditingQuestions ? (
                            <Button
                                onClick={handleEditQuestions}
                                variant="outline"
                                className="gap-2"
                                disabled={isEditing}>
                                <Edit className="h-4 w-4" />
                                Edit Questions
                            </Button>
                        ) : !isPublished && isEditingQuestions ? (
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleCancelEditQuestions}
                                    variant="outline"
                                    className="gap-2">
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveQuestions}
                                    className="gap-2">
                                    <Save className="h-4 w-4" />
                                    Save Questions
                                </Button>
                            </div>
                        ) : null}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {questions.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No questions added yet.</p>
                                {!isPublished && (
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => navigate(`/teacher/quiz/${quizId}/questions/create`)}>
                                        Add Questions
                                    </Button>
                                )}
                            </div>
                        ) : (
                            questions.map((question, qIndex) => (
                                <Card key={question.id}>
                                    <CardHeader>
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <Label className="text-base">
                                                    Question {qIndex + 1} {question.points && `(${question.points} points)`}
                                                </Label>
                                            </div>
                                            <Textarea
                                                placeholder="Enter your question here..."
                                                value={question.text}
                                                onChange={(e) => updateQuestion(question.id, e.target.value)}
                                                rows={2}
                                                disabled={!isEditingQuestions || isPublished}
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Label className="text-sm text-muted-foreground">
                                            Answer Options {isEditingQuestions && !isPublished && '(select the correct answer)'}
                                        </Label>
                                        <div className="space-y-3">
                                            {question.answers.map((answer, aIndex) => (
                                                <div
                                                    key={answer.id}
                                                    className="flex items-center gap-3 p-2 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                                                    {isEditingQuestions && !isPublished ? (
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value={answer.id}
                                                            checked={question.correctAnswerId === answer.id}
                                                            onChange={() => handleCorrectAnswerChange(question.id, answer.id)}
                                                            className="h-4 w-4 text-primary focus:ring-primary"
                                                        />
                                                    ) : (
                                                        <div
                                                            className={`w-4 h-4 rounded-full border-2 ${
                                                                answer.isCorrect ? 'bg-primary border-primary' : 'border-gray-300'
                                                            }`}
                                                        />
                                                    )}
                                                    <Input
                                                        placeholder={`Answer ${aIndex + 1}`}
                                                        value={answer.text}
                                                        onChange={(e) => updateAnswer(question.id, answer.id, e.target.value)}
                                                        className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none ${
                                                            answer.isCorrect ? 'bg-primary/5' : ''
                                                        }`}
                                                        disabled={!isEditingQuestions || isPublished}
                                                    />
                                                    {answer.isCorrect && (isPublished || !isEditingQuestions) && (
                                                        <span className="text-xs text-green-600 font-medium">Correct</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end border-t pt-6">
                <Button
                    variant="outline"
                    onClick={() => navigate('/teacher/quizzes')}>
                    Back to Quizzes
                </Button>
                {!isPublished && <Button onClick={handlePublishToggle}>Publish Quiz</Button>}
            </div>
        </div>
    );
}

export default QuizDetails;
