import { useState, useCallback } from 'react';

export const useQuizNavigation = (totalQuestions) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = useCallback(() => {
        setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
    }, [totalQuestions]);

    const previous = useCallback(() => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }, []);

    const goTo = useCallback(
        (index) => {
            setCurrentIndex(Math.max(0, Math.min(index, totalQuestions - 1)));
        },
        [totalQuestions]
    );

    const progress = ((currentIndex + 1) / totalQuestions) * 100;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === totalQuestions - 1;

    return {
        currentIndex,
        progress,
        isFirst,
        isLast,
        next,
        previous,
        goTo,
    };
};
