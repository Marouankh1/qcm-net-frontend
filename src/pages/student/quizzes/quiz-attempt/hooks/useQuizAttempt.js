import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';
import api from '@/services/api';
import useStudentStore from '@/stores/studentStore';

export const useQuizAttempt = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentQuiz, fetchQuizDetails, startQuizAttempt, submitAnswer, submitQuiz, isLoading } = useStudentStore();

    const [attempt, setAttempt] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadQuizAndAttempt = useCallback(async () => {
        if (!id) {
            navigate('/student/quizzes');
            return;
        }

        try {
            await fetchQuizDetails(id);
            const attemptData = await startQuizAttempt(id);
            setAttempt(attemptData);
        } catch (error) {
            console.error('Error loading quiz and attempt:', error);
            toast.error('Failed to load quiz');
            navigate('/student/quizzes');
        }
    }, [id, fetchQuizDetails, startQuizAttempt, navigate]);

    const loadExistingAnswers = useCallback(
        async (answersHandler) => {
            if (!attempt?.id) return;

            try {
                const response = await api.get(`/student/attempts/${attempt.id}/answers`);
                if (response.data.success) {
                    answersHandler(response.data.data);
                }
            } catch (error) {
                console.error('Error loading existing answers:', error);
            }
        },
        [attempt]
    );

    const handleSubmitQuiz = useCallback(async () => {
        if (!confirm('Are you sure you want to submit your quiz? You cannot change your answers after submission.')) {
            return;
        }

        if (!attempt?.id) {
            toast.error('No active quiz attempt found');
            return;
        }

        setIsSubmitting(true);
        try {
            await submitQuiz(attempt.id);
            toast.success('Quiz submitted successfully!');
            navigate('/student/results');
        } catch (error) {
            console.error('Submit quiz error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to submit quiz';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }, [attempt, submitQuiz, navigate]);

    const handleAutoSubmit = useCallback(async () => {
        if (!attempt?.id) {
            toast.error('No active quiz attempt found');
            navigate('/student/quizzes');
            return;
        }

        setIsSubmitting(true);
        try {
            await submitQuiz(attempt.id);
            toast.success("Time's up! Quiz submitted automatically.");
            navigate('/student/results');
        } catch (error) {
            console.error('Auto submit error:', error);
            toast.error('Failed to submit quiz automatically');
        } finally {
            setIsSubmitting(false);
        }
    }, [attempt, submitQuiz, navigate]);

    useEffect(() => {
        loadQuizAndAttempt();
    }, [loadQuizAndAttempt]);

    return {
        currentQuiz,
        attempt,
        isLoading,
        isSubmitting,
        submitAnswer,
        handleSubmitQuiz,
        handleAutoSubmit,
        loadExistingAnswers,
    };
};
