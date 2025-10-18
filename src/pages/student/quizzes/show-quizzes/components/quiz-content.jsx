import QuizResultsSummary from '@/pages/student/quizzes/show-quizzes/components/quiz-results-summary';
import QuizGrid from '@/pages/student/quizzes/show-quizzes/components/quiz-grid';
import NoQuestionsWarning from '@/pages/student/quizzes/show-quizzes/components/no-questions-warning';

export default function QuizContent({ filteredQuizzes, searchTerm, canStartQuiz, onQuizCardClick, hasQuizzesWithoutQuestions }) {
    return (
        <>
            <QuizResultsSummary
                filteredQuizzes={filteredQuizzes}
                searchTerm={searchTerm}
            />
            <QuizGrid
                quizzes={filteredQuizzes}
                canStartQuiz={canStartQuiz}
                onQuizCardClick={onQuizCardClick}
            />
            {hasQuizzesWithoutQuestions && <NoQuestionsWarning />}
        </>
    );
}
