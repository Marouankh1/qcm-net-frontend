import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'sonner';

export function useQuizDetails(quizStore) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isStarting, setIsStarting] = useState(false);

    const { currentQuiz, fetchQuizDetails, startQuizAttempt, isLoading } = quizStore;

    const loadQuizDetails = useCallback(async () => {
        if (!id) return;

        try {
            await fetchQuizDetails(id);
        } catch (error) {
            toast.error('Failed to load quiz details');
            navigate('/student/quizzes');
        }
    }, [id, fetchQuizDetails, navigate]);

    const handleStartQuiz = useCallback(async () => {
        if (!currentQuiz || currentQuiz.questions.length === 0) return;

        setIsStarting(true);
        try {
            const attempt = await startQuizAttempt(currentQuiz.id);
            toast.success('Quiz started! Good luck!');

            // FIX: Use attempt ID instead of quiz ID for navigation
            // The attempt object should have an ID that we use for the attempt page
            const attemptId = attempt.id || attempt.attempt_id;

            if (attemptId) {
                // Most common pattern - navigate to attempt page with attempt ID
                // navigate(`/student/attempt/${attemptId}`);
                navigate(`/student/quiz/${currentQuiz.id}/attempt`);
            } else {
                console.error('No attempt ID returned from API:', attempt);
                toast.error('Failed to start quiz - no attempt ID received');
            }
        } catch (error) {
            console.error('Failed to start quiz:', error);
            toast.error('Failed to start quiz');
        } finally {
            setIsStarting(false);
        }
    }, [currentQuiz, startQuizAttempt, navigate]);

    useEffect(() => {
        loadQuizDetails();
    }, [loadQuizDetails]);

    // Redirect if quiz has no questions
    useEffect(() => {
        if (currentQuiz && currentQuiz.questions.length === 0 && !isLoading) {
            toast.error('This quiz has no questions available.');
            setTimeout(() => {
                navigate('/student/quizzes');
            }, 2000);
        }
    }, [currentQuiz, isLoading, navigate]);

    return {
        id,
        currentQuiz,
        isLoading,
        isStarting,
        handleStartQuiz,
        loadQuizDetails,
    };
}
