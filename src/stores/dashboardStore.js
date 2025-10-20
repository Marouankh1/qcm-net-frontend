// stores/dashboardStore.js
import api from '@/services/api';
import { create } from 'zustand';

const useDashboardStore = create((set, get) => ({
    stats: {
        total_quizzes: 0,
        active_students: 0,
        completion_rate: 0,
        average_score: 0,
        recent_quizzes: [],
        top_performers: [],
        growth_metrics: {
            quizzes_growth: 0,
            last_month_quizzes: 0,
            previous_month_quizzes: 0,
        },
    },
    isLoading: false,
    error: null,

    // Fetch dashboard statistics
    fetchStats: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await api.get('/dashboard/stats');

            if (response.data.success) {
                set({
                    stats: response.data.data,
                    isLoading: false,
                });
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch stats');
            }
        } catch (error) {
            set({
                error: error.response?.data?.message || error.message,
                isLoading: false,
            });
            throw error;
        }
    },

    // Clear errors
    clearError: () => set({ error: null }),
}));

export default useDashboardStore;
