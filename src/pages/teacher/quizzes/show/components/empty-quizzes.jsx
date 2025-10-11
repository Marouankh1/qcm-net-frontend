import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { FileQuestion, Plus } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

function EmptyQuizzes({ searchTerm, setSearchTerm, setSearchInput }) {
    return (
        <Empty className="border">
            <EmptyHeader>
                <EmptyMedia>
                    <FileQuestion className="h-12 w-12" />
                </EmptyMedia>
                <EmptyTitle>No Quizzes Found</EmptyTitle>
                <EmptyDescription>
                    {searchTerm
                        ? `No quizzes match your search "${searchTerm}". Try a different search term or create a new quiz.`
                        : "You haven't created any quizzes yet. Get started by creating your first quiz."}
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Link to="/teacher/quizzes/create">
                    <Button className="gap-2 cursor-pointer">
                        <Plus className="h-4 w-4" />
                        Create Quiz
                    </Button>
                </Link>
                {searchTerm && (
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchInput('');
                            setSearchTerm('');
                        }}>
                        Clear Search
                    </Button>
                )}
            </EmptyContent>
        </Empty>
    );
}

export default EmptyQuizzes;
