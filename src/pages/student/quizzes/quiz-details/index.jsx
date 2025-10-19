import React from 'react';
import { useNavigate } from 'react-router';
import Header from '@/components/header';
import useStudentStore from '@/stores/studentStore';
import { useQuizDetails } from '@/pages/student/quizzes/quiz-details/hooks/use-quiz-details';
import { quizDetailsUtils } from '@/pages/student/quizzes/quiz-details/utils/quiz-details-utils';
import { QuizDetailsSkeleton } from '@/pages/student/quizzes/quiz-details/components/quiz-details-skeleton';
import { QuizNotFound } from '@/pages/student/quizzes/quiz-details/components/quiz-not-found';
import { QuizDetailsHeader } from '@/pages/student/quizzes/quiz-details/components/quiz-details-header';
import { QuizInfoCard } from '@/pages/student/quizzes/quiz-details/components/quiz-info-card';
import { InstructionsCard } from '@/pages/student/quizzes/quiz-details/components/instructions-card';
import { StartQuizCard } from '@/pages/student/quizzes/quiz-details/components/start-quiz-card';

function QuizDetailsStudentPage() {
    const navigate = useNavigate();
    const { currentQuiz, isLoading, isStarting, handleStartQuiz } = useQuizDetails(useStudentStore());

    const handleBack = () => navigate('/student/quizzes');

    if (!currentQuiz || isLoading) {
        return <QuizDetailsSkeleton />;
    }

    // if (!currentQuiz) {
    //     return <QuizNotFound onBack={handleBack} />;
    // }

    const questionCount = quizDetailsUtils.getQuestionCount(currentQuiz);
    const hasQuestions = quizDetailsUtils.hasQuestions(currentQuiz);

    if (!hasQuestions && !isLoading) {
        return (
            <div>
                <Header title="Quiz Details" />
                <div className="p-6 mx-3 space-y-6">
                    <QuizDetailsHeader
                        title={currentQuiz.title}
                        description={currentQuiz.description}
                        onBack={handleBack}
                    />
                    <StartQuizCard
                        questionCount={questionCount}
                        hasQuestions={hasQuestions}
                        isStarting={isStarting}
                        isLoading={isLoading}
                        onStartQuiz={handleStartQuiz}
                    />
                </div>
            </div>
        );
    }

    return (
        <div>
            <Header title="Quiz Details" />
            <div className="p-6 mx-3 space-y-6">
                <QuizDetailsHeader
                    title={currentQuiz.title}
                    description={currentQuiz.description}
                    onBack={handleBack}
                />

                <div className="grid gap-6 md:grid-cols-2">
                    <QuizInfoCard quiz={currentQuiz} />
                    <InstructionsCard />
                </div>

                <StartQuizCard
                    questionCount={questionCount}
                    hasQuestions={hasQuestions}
                    isStarting={isStarting}
                    isLoading={isLoading}
                    onStartQuiz={handleStartQuiz}
                />
            </div>
        </div>
    );
}

export default QuizDetailsStudentPage;
