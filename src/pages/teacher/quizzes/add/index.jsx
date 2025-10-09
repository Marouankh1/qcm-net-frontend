'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import useAuthStore from '@/stores/authStore';
import { useLogout } from '@/hooks/react-query/auth/useAuth';
import { useNavigate, useOutlet } from 'react-router';
import Header from '@/components/header';
import AddQuizForm from '@/pages/teacher/quizzes/add/components/add-quiz-form';

export default function AddQuizze() {
    const outlet = useOutlet();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([
        {
            id: '1',
            text: '',
            answers: [
                { id: '1a', text: '', isCorrect: false },
                { id: '1b', text: '', isCorrect: false },
                { id: '1c', text: '', isCorrect: false },
                { id: '1d', text: '', isCorrect: false },
            ],
        },
    ]);

    const addQuestion = () => {
        const newQuestion = {
            id: Date.now().toString(),
            text: '',
            answers: [
                { id: `${Date.now()}a`, text: '', isCorrect: false },
                { id: `${Date.now()}b`, text: '', isCorrect: false },
                { id: `${Date.now()}c`, text: '', isCorrect: false },
                { id: `${Date.now()}d`, text: '', isCorrect: false },
            ],
        };
        setQuestions([...questions, newQuestion]);
    };

    const removeQuestion = (questionId) => {
        setQuestions(questions.filter((q) => q.id !== questionId));
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

    const toggleCorrectAnswer = (questionId, answerId) => {
        setQuestions(
            questions.map((q) =>
                q.id === questionId
                    ? {
                          ...q,
                          answers: q.answers.map((a) => (a.id === answerId ? { ...a, isCorrect: !a.isCorrect } : a)),
                      }
                    : q
            )
        );
    };

    return (
        <div>
            {outlet || (
                <>
                    <Header title="Create Quiz" />
                    <div className="p-6 mx-3 space-y-4">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Create New Quiz</h2>
                            <p className="text-muted-foreground">Build a comprehensive quiz for your students</p>
                        </div>

                        <AddQuizForm />

                        {/* <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold">Questions</h3>
                                    <p className="text-sm text-muted-foreground">Add questions and multiple choice answers</p>
                                </div>
                                <Button
                                    onClick={addQuestion}
                                    variant="outline"
                                    className="gap-2 bg-transparent">
                                    <Plus className="h-4 w-4" />
                                    Add Question
                                </Button>
                            </div>

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
                                                    {questions.length > 1 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeQuestion(question.id)}
                                                            className="h-8 w-8 text-destructive hover:text-destructive">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                                <Textarea
                                                    id={`question-${question.id}`}
                                                    placeholder="Enter your question here..."
                                                    value={question.text}
                                                    onChange={(e) => updateQuestion(question.id, e.target.value)}
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Label className="text-sm text-muted-foreground">
                                            Answer Options (check the correct answer)
                                        </Label>
                                        {question.answers.map((answer, aIndex) => (
                                            <div
                                                key={answer.id}
                                                className="flex items-center gap-3">
                                                <Checkbox
                                                    id={`answer-${answer.id}`}
                                                    checked={answer.isCorrect}
                                                    onCheckedChange={() => toggleCorrectAnswer(question.id, answer.id)}
                                                />
                                                <Label
                                                    htmlFor={`answer-${answer.id}`}
                                                    className="sr-only">
                                                    Answer {aIndex + 1}
                                                </Label>
                                                <Input
                                                    placeholder={`Answer ${aIndex + 1}`}
                                                    value={answer.text}
                                                    onChange={(e) => updateAnswer(question.id, answer.id, e.target.value)}
                                                    className={answer.isCorrect ? 'border-primary' : ''}
                                                />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </div> */}
                    </div>
                </>
            )}
        </div>
    );
}
