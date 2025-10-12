import { create } from 'zustand';
import api from '@/services/api';

const useStudentStore = create((set, get) => ({
    availableQuizzes: [],
    myAttempts: [],
    currentQuiz: null,
    currentAttempt: null,
    isLoading: false,
    error: null,

    // Set loading state
    setLoading: (loading) => set({ isLoading: loading }),

    // Set error state
    setError: (error) => set({ error }),

    // Clear error state
    clearError: () => set({ error: null }),

    // API Calls
    fetchAvailableQuizzes: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get('/student/quizzes');
            const result = response.data;

            if (result.success) {
                set({ availableQuizzes: result.data, isLoading: false });
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to load quizzes');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load quizzes';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    fetchMyAttempts: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get('/student/attempts');
            const result = response.data;

            if (result.success) {
                set({ myAttempts: result.data, isLoading: false });
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to load attempts');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load attempts';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    fetchQuizDetails: async (quizId) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get(`/student/quizzes/${quizId}`);
            const result = response.data;

            if (result.success) {
                set({ currentQuiz: result.data, isLoading: false });
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to load quiz details');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load quiz details';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    startQuizAttempt: async (quizId) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.post('/student/attempts', { quiz_id: quizId });
            const result = response.data;

            if (result.success) {
                set({ currentAttempt: result.data, isLoading: false });
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to start quiz');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to start quiz';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    submitAnswer: async (questionId, choiceId) => {
        try {
            const response = await api.post('/student/answers', {
                question_id: questionId,
                choice_id: choiceId,
            });
            const result = response.data;

            if (result.success) {
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to submit answer');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to submit answer';
            throw error;
        }
    },

    submitQuiz: async (attemptId) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.post(`/student/attempts/${attemptId}/submit`);
            const result = response.data;

            if (result.success) {
                set({ currentAttempt: null, isLoading: false });
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to submit quiz');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to submit quiz';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    getQuizResults: async (attemptId) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get(`/student/attempts/${attemptId}/results`);
            const result = response.data;

            if (result.success) {
                set({ isLoading: false });
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to load results');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load results';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },
    getQuizResults: async (attemptId) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get(`/student/attempts/${attemptId}/results`);
            const result = response.data;

            if (result.success) {
                set({ isLoading: false });
                return result.data;
            } else {
                throw new Error(result.message || 'Failed to load results');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load results';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },
}));

export default useStudentStore;
