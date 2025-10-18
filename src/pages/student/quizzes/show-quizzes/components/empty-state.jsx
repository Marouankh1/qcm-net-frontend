import React from 'react';
import { BookOpen } from 'lucide-react';

export default function EmptyState({ searchTerm }) {
    return (
        <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No quizzes available</h3>
            <p className="text-muted-foreground">
                {searchTerm
                    ? `No quizzes found matching "${searchTerm}"`
                    : 'No quizzes are currently available. Check back later!'}
            </p>
        </div>
    );
}
