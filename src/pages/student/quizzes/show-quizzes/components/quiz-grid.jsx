import React from 'react';
import QuizCard from '@/pages/student/quizzes/show-quizzes/components/quiz-card';

export default function QuizGrid({ quizzes, canStartQuiz, onQuizCardClick }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
                <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    canStartQuiz={canStartQuiz}
                    onQuizCardClick={onQuizCardClick}
                />
            ))}
        </div>
    );
}
