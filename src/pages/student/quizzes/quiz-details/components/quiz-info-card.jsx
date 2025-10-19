import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, User } from 'lucide-react';
import { quizDetailsUtils } from '@/pages/student/quizzes/quiz-details/utils/quiz-details-utils';

export function QuizInfoCard({ quiz }) {
    const questionCount = quizDetailsUtils.getQuestionCount(quiz);
    const duration = quizDetailsUtils.getDuration(quiz);
    const teacherName = quizDetailsUtils.getTeacherName(quiz);

    return (
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
                    <span className="font-medium">{questionCount}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{duration} minutes</span>
                </div>
                {teacherName && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Teacher:</span>
                        <span className="font-medium">{teacherName}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
