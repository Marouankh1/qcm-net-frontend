import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock } from 'lucide-react';

const QuizHeader = ({ title, currentQuestion, totalQuestions, timeLeft, formatTime, onBack }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button
                className={'cursor-pointer'}
                variant="outline"
                size="icon"
                onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                <p className="text-muted-foreground">
                    Question {currentQuestion} of {totalQuestions}
                </p>
            </div>
        </div>

        <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                timeLeft < 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}>
            <Clock className="h-4 w-4" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
        </div>
    </div>
);

export default QuizHeader;
