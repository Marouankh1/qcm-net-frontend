import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useQuizData(quizStore) {
    const [isLoading, setIsLoading] = useState(false);

    const loadQuizzes = useCallback(async () => {
        setIsLoading(true);
        try {
            await quizStore.fetchAvailableQuizzes();
        } catch (error) {
            toast.error('Failed to load quizzes');
        } finally {
            setIsLoading(false);
        }
    }, [quizStore]);

    return {
        isLoading,
        loadQuizzes,
    };
}
