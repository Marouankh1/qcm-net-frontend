import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/header';

export function QuizDetailsSkeleton() {
    return (
        <div>
            <Header title="Quiz Details" />
            <div className="p-6 mx-3 space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
            </div>
        </div>
    );
}
