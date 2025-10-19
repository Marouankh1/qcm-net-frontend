import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export function QuizNotFound({ onBack }) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Quiz Not Found</h2>
                <p className="text-muted-foreground mb-4">The quiz you're looking for doesn't exist.</p>
                <Button
                    className={'cursor-pointer'}
                    onClick={onBack}>
                    Back to Quizzes
                </Button>
            </div>
        </div>
    );
}
