import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export function InstructionsCard() {
    const instructions = [
        'Read each question carefully before answering',
        'You can only select one answer per question',
        'Your progress will be saved automatically',
        'You cannot go back to previous questions once answered',
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Instructions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm">
                    {instructions.map((instruction, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{instruction}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
