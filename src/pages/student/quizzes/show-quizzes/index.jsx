import React, { useEffect, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { useQuizFilters } from '@/pages/student/quizzes/show-quizzes/hooks/use-quiz-filters';
import { useQuizData } from '@/pages/student/quizzes/show-quizzes/hooks/use-quiz-data';
import Header from '@/components/header';
import QuizSearchBar from '@/pages/student/quizzes/show-quizzes/components/quiz-search-bar';
import { QuizSkeletonGrid } from '@/pages/student/quizzes/show-quizzes/components/quiz-skeleton';
import useStudentStore from '@/stores/studentStore';
import EmptyState from '@/pages/student/quizzes/show-quizzes/components/empty-state';
import QuizContent from '@/pages/student/quizzes/show-quizzes/components/quiz-content';

function ShowQuizzesStudent() {
    const { availableQuizzes } = useStudentStore();
    const { isLoading, loadQuizzes } = useQuizData(useStudentStore());
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { filteredQuizzes, canStartQuiz, hasQuizzesWithoutQuestions } = useQuizFilters(availableQuizzes, searchTerm);

    useEffect(() => {
        loadQuizzes();
    }, []);

    const handleSearch = useCallback(() => {
        const trimmedInput = searchInput.trim();
        setSearchTerm(trimmedInput);
    }, [searchInput]);

    const handleClearSearch = useCallback(() => {
        setSearchInput('');
        setSearchTerm('');
    }, []);

    const handleRefresh = useCallback(() => {
        loadQuizzes();
        setSearchInput('');
        setSearchTerm('');
    }, []);

    const handleQuizCardClick = useCallback(
        (quiz, e) => {
            if (!canStartQuiz(quiz)) {
                e.preventDefault();
                toast.error('This quiz has no questions available');
            }
        },
        [canStartQuiz]
    );

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        },
        [handleSearch]
    );

    const handleSearchInputChange = useCallback((e) => {
        setSearchInput(e.target.value);
    }, []);

    const shouldShowClearButton = searchInput || searchTerm;
    const hasQuizzes = filteredQuizzes.length > 0;
    const showEmptyState = !isLoading && !hasQuizzes;

    return (
        <div>
            <Header title="Available Quizzes" />
            <div className="p-6 mx-3 space-y-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Available Quizzes</h2>
                        <p className="text-muted-foreground">Choose a quiz to test your knowledge</p>
                    </div>
                    <Button
                        className="cursor-pointer"
                        onClick={handleRefresh}
                        variant="outline"
                        size="icon"
                        disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
                <QuizSearchBar
                    searchInput={searchInput}
                    onSearchInputChange={handleSearchInputChange}
                    onSearch={handleSearch}
                    onClear={shouldShowClearButton ? handleClearSearch : null}
                    onKeyDown={handleKeyDown}
                    isLoading={isLoading}
                />
                {isLoading ? (
                    <QuizSkeletonGrid count={6} />
                ) : showEmptyState ? (
                    <EmptyState searchTerm={searchTerm} />
                ) : (
                    <QuizContent
                        filteredQuizzes={filteredQuizzes}
                        searchTerm={searchTerm}
                        canStartQuiz={canStartQuiz}
                        onQuizCardClick={handleQuizCardClick}
                        hasQuizzesWithoutQuestions={hasQuizzesWithoutQuestions}
                    />
                )}
            </div>
        </div>
    );
}

export default ShowQuizzesStudent;
