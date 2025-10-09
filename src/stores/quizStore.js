import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useQuizStore = create(
    persist(
        (set, get) => ({
            // State
            quizzes: [],
            currentQuiz: null,
            isLoading: false,
            error: null,
            setQuizzes: (quizzes) => set({ quizzes }),
            addQuiz: (quiz) => set((state) => ({ quizzes: [quiz, ...state.quizzes] })),
            updateQuiz: (updatedQuiz) =>
                set((state) => ({
                    quizzes: state.quizzes.map((quiz) => (quiz.id === updatedQuiz.id ? { ...quiz, ...updatedQuiz } : quiz)),
                })),
            deleteQuiz: (quizId) =>
                set((state) => ({
                    quizzes: state.quizzes.filter((quiz) => quiz.id !== quizId),
                })),
            publishQuiz: (quizId) =>
                set((state) => ({
                    quizzes: state.quizzes.map((quiz) => (quiz.id === quizId ? { ...quiz, is_published: true } : quiz)),
                })),
            setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
            clearCurrentQuiz: () => set({ currentQuiz: null }),
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),
        }),
        {
            name: 'quiz-store',
            partialize: (state) => ({
                quizzes: state.quizzes,
            }),
        }
    )
);

export default useQuizStore;
