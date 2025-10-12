import { create } from 'zustand';
import api from '@/services/api';

const useQuizStore = create((set, get) => ({
    quizzes: [],
    currentQuiz: null,
    isLoading: false,
    error: null,

    // Set loading state
    setLoading: (loading) => set({ isLoading: loading }),

    // Set error state
    setError: (error) => set({ error }),

    // Clear error state
    clearError: () => set({ error: null }),

    // Set quizzes
    setQuizzes: (quizzes) => set({ quizzes }),

    // Set current quiz
    setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),

    // Add quiz to store
    addQuiz: (quiz) =>
        set((state) => ({
            quizzes: [quiz, ...state.quizzes],
        })),

    // Update quiz in store
    updateQuizInStore: (updatedQuiz) =>
        set((state) => ({
            quizzes: state.quizzes.map((q) => (q.id === updatedQuiz.id ? updatedQuiz : q)),
        })),

    // Delete quiz from store
    deleteQuizFromStore: (quizId) =>
        set((state) => ({
            quizzes: state.quizzes.filter((q) => q.id !== quizId),
        })),

    // Get quiz by ID
    getQuizById: (id) => {
        const { quizzes } = get();
        return quizzes.find((q) => q.id === id);
    },

    // API Calls
    fetchQuizzes: async (filters = {}) => {
        try {
            set({ isLoading: true, error: null });
            const queryString = new URLSearchParams(filters).toString();
            const url = queryString ? `/quizzes?${queryString}` : '/quizzes';

            const response = await api.get(url);
            const result = response.data;

            if (result.success) {
                const quizzes = result.data || [];
                set({ quizzes, isLoading: false });
                return quizzes;
            } else {
                throw new Error(result.message || 'Failed to load quizzes');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load quizzes';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    fetchQuiz: async (id) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get(`/quizzes/${id}`);
            const result = response.data;

            if (result.success) {
                const quiz = result.data;
                set({ currentQuiz: quiz, isLoading: false });
                return quiz;
            } else {
                throw new Error(result.message || 'Failed to load quiz');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load quiz';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    createQuiz: async (quizData) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.post('/quizzes', quizData);
            const result = response.data;

            if (result.success) {
                const quiz = result.data.quiz;
                // Add to store
                set((state) => ({
                    quizzes: [quiz, ...state.quizzes],
                    isLoading: false,
                }));
                return { success: true, data: quiz };
            } else {
                throw new Error(result.message || 'Failed to create quiz');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create quiz';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    updateQuiz: async (id, quizData) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.put(`/quizzes/${id}`, quizData);
            const result = response.data;

            if (result.success) {
                const updatedQuiz = result.data.quiz;
                // Update in store
                set((state) => ({
                    quizzes: state.quizzes.map((q) => (q.id === id ? updatedQuiz : q)),
                    currentQuiz: state.currentQuiz?.id === id ? updatedQuiz : state.currentQuiz,
                    isLoading: false,
                }));
                return { success: true, data: updatedQuiz };
            } else {
                throw new Error(result.message || 'Failed to update quiz');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update quiz';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    deleteQuiz: async (id) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.delete(`/quizzes/${id}`);
            const result = response.data;

            if (result.success) {
                // Remove from store
                set((state) => ({
                    quizzes: state.quizzes.filter((q) => q.id !== id),
                    currentQuiz: state.currentQuiz?.id === id ? null : state.currentQuiz,
                    isLoading: false,
                }));
                return { success: true, message: result.message };
            } else {
                throw new Error(result.message || 'Failed to delete quiz');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete quiz';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    publishQuiz: async (id, isPublished) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.patch(`/quizzes/${id}/publish`, {
                is_published: isPublished,
            });
            const result = response.data;

            if (result.success) {
                const updatedQuiz = result.data.quiz;
                // Update in store
                set((state) => ({
                    quizzes: state.quizzes.map((q) => (q.id === id ? updatedQuiz : q)),
                    currentQuiz: state.currentQuiz?.id === id ? updatedQuiz : state.currentQuiz,
                    isLoading: false,
                }));
                return { success: true, data: updatedQuiz };
            } else {
                throw new Error(result.message || 'Failed to update quiz publication status');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update quiz publication status';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },
}));

export default useQuizStore;
