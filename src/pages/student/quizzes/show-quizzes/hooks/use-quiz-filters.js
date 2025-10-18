import { useMemo, useCallback } from 'react';

export function useQuizFilters(quizzes, searchTerm) {
    const enhanceQuizData = useCallback(
        (quiz) => ({
            ...quiz,
            hasQuestions: (quiz.questions_count && quiz.questions_count > 0) || (quiz.questions && quiz.questions.length > 0),
        }),
        []
    );

    const filteredQuizzes = useMemo(() => {
        if (!searchTerm) {
            return quizzes.map(enhanceQuizData);
        }

        const lowerSearchTerm = searchTerm.toLowerCase();
        return quizzes
            .filter(
                (quiz) =>
                    quiz.title.toLowerCase().includes(lowerSearchTerm) || quiz.description.toLowerCase().includes(lowerSearchTerm)
            )
            .map(enhanceQuizData);
    }, [quizzes, searchTerm, enhanceQuizData]);

    const canStartQuiz = useCallback((quiz) => {
        return (quiz.questions_count && quiz.questions_count > 0) || (quiz.questions && quiz.questions.length > 0);
    }, []);

    const hasQuizzesWithoutQuestions = useMemo(() => {
        return filteredQuizzes.some((quiz) => !canStartQuiz(quiz));
    }, [filteredQuizzes, canStartQuiz]);

    return {
        filteredQuizzes,
        canStartQuiz,
        hasQuizzesWithoutQuestions,
    };
}
