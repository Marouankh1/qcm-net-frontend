import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { BookOpen, Clock, User, Ban, Play } from 'lucide-react';
import { quizUtils } from '@/pages/student/quizzes/show-quizzes/utils/quiz-utils';

export default function QuizCard({ quiz, canStartQuiz, onQuizCardClick }) {
    const hasQuestions = canStartQuiz(quiz);
    const questionCount = quizUtils.getQuestionCount(quiz);
    const duration = quizUtils.getDuration(quiz);
    const teacherName = quizUtils.getTeacherName(quiz);

    return (
        <Card
            className={`flex flex-col hover:shadow-lg transition-shadow ${
                !hasQuestions ? 'opacity-70 border-yellow-200 bg-yellow-50' : ''
            }`}>
            <CardHeader>
                <CardTitle className="text-xl leading-tight">{quiz.title}</CardTitle>
                <CardDescription className="mt-2 line-clamp-3">{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className={`flex items-center gap-2 ${!hasQuestions ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                        <BookOpen className="h-4 w-4" />
                        <span>
                            {questionCount} question{questionCount !== 1 ? 's' : ''}
                            {!hasQuestions && ' (None)'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{duration} min</span>
                    </div>
                </div>
                {teacherName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                        <User className="h-4 w-4" />
                        <span>By {teacherName}</span>
                    </div>
                )}
                {!hasQuestions && (
                    <div className="flex items-center gap-2 text-sm text-yellow-600 pt-2">
                        <Ban className="h-4 w-4" />
                        <span>No questions available</span>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                {hasQuestions ? (
                    <Link
                        to={`/student/quiz/${quiz.id}`}
                        className="w-full">
                        <Button
                            className="w-full gap-2 cursor-pointer"
                            onClick={(e) => onQuizCardClick(quiz, e)}>
                            <Play className="h-4 w-4" />
                            Start Quiz
                        </Button>
                    </Link>
                ) : (
                    <Button
                        className="w-full gap-2 cursor-not-allowed"
                        variant="outline"
                        disabled>
                        <Ban className="h-4 w-4" />
                        Cannot Start
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
