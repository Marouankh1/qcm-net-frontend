import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useQuizAnswers = (submitAnswer) => {
    const [selectedAnswers, setSelectedAnswers] = useState({});

    const handleAnswerSelect = useCallback(
        async (questionId, choiceId) => {
            setSelectedAnswers((prev) => ({
                ...prev,
                [questionId]: choiceId,
            }));

            try {
                await submitAnswer(questionId, choiceId);
            } catch (error) {
                toast.error('Failed to save answer');
                // Revert on error
                setSelectedAnswers((prev) => {
                    const newAnswers = { ...prev };
                    delete newAnswers[questionId];
                    return newAnswers;
                });
            }
        },
        [submitAnswer]
    );

    const loadExistingAnswers = useCallback((answers) => {
        const existingAnswers = {};
        answers.forEach((answer) => {
            existingAnswers[answer.question_id] = answer.choice_id;
        });
        setSelectedAnswers(existingAnswers);
    }, []);

    const hasAnswerFor = useCallback(
        (questionId) => {
            return !!selectedAnswers[questionId];
        },
        [selectedAnswers]
    );

    return {
        selectedAnswers,
        handleAnswerSelect,
        loadExistingAnswers,
        hasAnswerFor,
    };
};
