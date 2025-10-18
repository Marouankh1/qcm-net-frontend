import { quizUtils } from '@/pages/student/quizzes/show-quizzes/utils/quiz-utils';

export default function QuizResultsSummary({ filteredQuizzes, searchTerm }) {
    const count = filteredQuizzes.length;
    const formattedCount = quizUtils.formatQuizCount(count);

    return (
        <div className="mb-4 text-sm text-muted-foreground">
            {searchTerm ? (
                <p>
                    Found {formattedCount} matching "{searchTerm}"
                </p>
            ) : (
                <p>Showing {formattedCount}</p>
            )}
        </div>
    );
}
