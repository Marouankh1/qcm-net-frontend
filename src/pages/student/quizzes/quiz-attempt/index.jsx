import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import Header from '@/components/header';

// Custom hooks
// import { useQuizTimer, useQuizNavigation, useQuizAnswers, useQuizAttempt } from '@/pages/student/quizzes/quiz-attempt/hooks';

// Sub-components
import QuizHeader from '@/pages/student/quizzes/quiz-attempt/components/QuizHeader';
import QuestionCard from '@/pages/student/quizzes/quiz-attempt/components/QuestionCard';
import QuestionNavigation from '@/pages/student/quizzes/quiz-attempt/components/QuestionNavigation';
import NavigationButtons from '@/pages/student/quizzes/quiz-attempt/components/NavigationButtons';
import QuizLoadingSkeleton from '@/pages/student/quizzes/quiz-attempt/components/QuizLoadingSkeleton';
import { useQuizAttempt } from './hooks/useQuizAttempt';
import { useQuizTimer } from './hooks/useQuizTimer';
import { useQuizNavigation } from './hooks/useQuizNavigation';
import { useQuizAnswers } from './hooks/useQuizAnswers';

function QuizAttemptStudent() {
    const navigate = useNavigate();

    // Custom hooks for separated concerns
    const {
        currentQuiz,
        attempt,
        isLoading,
        isSubmitting,
        submitAnswer,
        handleSubmitQuiz,
        handleAutoSubmit,
        loadExistingAnswers,
    } = useQuizAttempt();

    const { timeLeft, formatTime } = useQuizTimer(30 * 60, handleAutoSubmit);

    const { currentIndex, progress, isFirst, isLast, next, previous, goTo } = useQuizNavigation(
        currentQuiz?.questions?.length || 0
    );

    const { selectedAnswers, handleAnswerSelect, loadExistingAnswers: loadAnswers, hasAnswerFor } = useQuizAnswers(submitAnswer);

    // Load existing answers when attempt is ready
    useEffect(() => {
        if (attempt?.id) {
            loadExistingAnswers(loadAnswers);
        }
    }, [attempt, loadExistingAnswers, loadAnswers]);

    // Validate quiz data
    useEffect(() => {
        if (currentQuiz && (!currentQuiz.questions || currentQuiz.questions.length === 0)) {
            toast.error('This quiz has no questions available.');
            navigate('/student/quizzes');
        }
    }, [currentQuiz, navigate]);

    // Loading state
    if (isLoading || !currentQuiz || !attempt || !currentQuiz.questions || currentQuiz.questions.length === 0) {
        return <QuizLoadingSkeleton />;
    }

    const currentQuestion = currentQuiz.questions[currentIndex];

    return (
        <div>
            <Header title="Taking Quiz" />
            <div className="p-6 mx-3 space-y-6">
                {/* Quiz Header */}
                <QuizHeader
                    title={currentQuiz.title}
                    currentQuestion={currentIndex + 1}
                    totalQuestions={currentQuiz.questions.length}
                    timeLeft={timeLeft}
                    formatTime={formatTime}
                    onBack={() => navigate('/student/quizzes')}
                />

                {/* Progress Bar */}
                <Progress
                    value={progress}
                    className="h-2"
                />

                {/* Current Question */}
                <QuestionCard
                    question={currentQuestion}
                    questionNumber={currentIndex + 1}
                    selectedAnswer={selectedAnswers[currentQuestion?.id]}
                    onAnswerSelect={handleAnswerSelect}
                />

                {/* Navigation Buttons */}
                <NavigationButtons
                    isFirst={isFirst}
                    isLast={isLast}
                    isSubmitting={isSubmitting}
                    onPrevious={previous}
                    onNext={next}
                    onSubmit={handleSubmitQuiz}
                />

                {/* Question Navigation */}
                <QuestionNavigation
                    questions={currentQuiz.questions}
                    currentIndex={currentIndex}
                    hasAnswerFor={hasAnswerFor}
                    onQuestionSelect={goTo}
                />
            </div>
        </div>
    );
}

export default QuizAttemptStudent;
