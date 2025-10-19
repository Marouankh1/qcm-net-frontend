import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Ban } from 'lucide-react';

export function StartQuizCard({ questionCount, hasQuestions, isStarting, isLoading, onStartQuiz }) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold">{hasQuestions ? 'Ready to start the quiz?' : 'Quiz Not Available'}</h3>

                    {hasQuestions ? (
                        <>
                            <p className="text-muted-foreground">
                                Once you start, the timer will begin and you'll need to complete all {questionCount} questions.
                            </p>
                            <Button
                                size="lg"
                                onClick={onStartQuiz}
                                disabled={isStarting || isLoading}
                                className="gap-2 cursor-pointer">
                                <Play className="h-5 w-5" />
                                {isStarting ? 'Starting...' : 'Start Quiz'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Ban className="h-12 w-12 text-yellow-500 mx-auto" />
                            <p className="text-yellow-700">
                                This quiz has no questions available. Redirecting to available quizzes...
                            </p>
                            <p className="text-sm text-red-500">This quiz cannot be started because it has no questions.</p>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
