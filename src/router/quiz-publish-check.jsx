import { Navigate, useParams } from 'react-router';
import useQuizStore from '@/stores/quizStore';
import { useEffect } from 'react';

export const QuizPublishCheck = ({ element }) => {
    const { id: quizId } = useParams();
    const { currentQuiz, fetchQuiz } = useQuizStore();

    useEffect(() => {
        if (quizId) {
            fetchQuiz(quizId);
        }
    }, [quizId]);

    if (currentQuiz?.is_published) {
        return (
            <Navigate
                to={`/teacher/quiz/${quizId}`}
                replace
            />
        );
    }

    return element;
};
