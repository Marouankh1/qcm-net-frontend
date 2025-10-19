import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/header';

const QuizLoadingSkeleton = () => (
    <div>
        <Header title="Taking Quiz" />
        <div className="p-6 mx-3 space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
    </div>
);

export default QuizLoadingSkeleton;
