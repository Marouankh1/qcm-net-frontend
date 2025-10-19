import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function QuizDetailsHeader({ title, description, onBack }) {
    return (
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
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </div>
            </div>
        </div>
    );
}
