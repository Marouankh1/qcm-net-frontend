// stores/studentResultsStore.js
import api from '@/services/api';
import { create } from 'zustand';

const useStudentResultsStore = create((set, get) => ({
    // État pour la liste des étudiants
    students: [],
    studentsLoading: false,
    studentsError: null,

    // État pour les détails d'un étudiant
    studentDetail: null,
    studentDetailLoading: false,
    studentDetailError: null,

    // État pour les statistiques par quiz
    quizStats: [],
    quizStatsLoading: false,
    quizStatsError: null,

    // État pour les résultats détaillés d'un quiz
    quizResults: null,
    quizResultsLoading: false,
    quizResultsError: null,

    // Pagination
    pagination: {
        current_page: 1,
        total: 0,
        per_page: 10,
    },

    // Filtres
    filters: {
        search: '',
        quiz_id: '',
    },

    // Actions
    // Récupérer la liste des étudiants avec statistiques
    fetchStudentsStats: async (filters = {}) => {
        set({ studentsLoading: true, studentsError: null });

        try {
            const params = new URLSearchParams();

            // CORRECTION : Filtrer les valeurs non valides
            if (filters.search && filters.search.trim() !== '') {
                params.append('search', filters.search.trim());
            }
            if (filters.quiz_id && filters.quiz_id !== 'all') {
                params.append('quiz_id', filters.quiz_id);
            }

            const url = `/student-results?${params.toString()}`;
            console.log('🔍 API URL:', url); // Debug

            const response = await api.get(url);
            console.log('✅ API Response:', response.data); // Debug

            if (response.data.success) {
                set({
                    students: response.data.data.data || [],
                    pagination: response.data.data,
                    filters: filters,
                    studentsLoading: false,
                    studentsError: null,
                });
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch students stats');
            }
        } catch (error) {
            console.error('❌ Error in fetchStudentsStats:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Unknown error';

            set({
                studentsError: errorMessage,
                studentsLoading: false,
                students: [],
            });
            throw error;
        }
    },

    // Récupérer les détails d'un étudiant
    fetchStudentDetail: async (studentId) => {
        set({ studentDetailLoading: true, studentDetailError: null });

        try {
            const response = await api.get(`/student-results/student/${studentId}`);

            if (response.data.success) {
                set({
                    studentDetail: response.data.data,
                    studentDetailLoading: false,
                    studentDetailError: null,
                });
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch student detail');
            }
        } catch (error) {
            console.error('Error fetching student detail:', error);
            set({
                studentDetailError: error.response?.data?.message || error.message,
                studentDetailLoading: false,
                studentDetail: null,
            });
            throw error;
        }
    },

    // Récupérer les statistiques par quiz
    fetchQuizStats: async () => {
        set({ quizStatsLoading: true, quizStatsError: null });

        try {
            const response = await api.get('/student-results/quizzes-stats');

            if (response.data.success) {
                set({
                    quizStats: response.data.data,
                    quizStatsLoading: false,
                    quizStatsError: null,
                });
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch quiz stats');
            }
        } catch (error) {
            console.error('Error fetching quiz stats:', error);
            set({
                quizStatsError: error.response?.data?.message || error.message,
                quizStatsLoading: false,
                quizStats: [],
            });
            throw error;
        }
    },

    // Récupérer les résultats détaillés d'un quiz
    fetchQuizResults: async (studentId, quizId) => {
        set({ quizResultsLoading: true, quizResultsError: null });

        try {
            const response = await api.get(`/student-results/student/${studentId}/quiz/${quizId}`);

            if (response.data.success) {
                set({
                    quizResults: response.data.data,
                    quizResultsLoading: false,
                    quizResultsError: null,
                });
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to fetch quiz results');
            }
        } catch (error) {
            console.error('Error fetching quiz results:', error);
            set({
                quizResultsError: error.response?.data?.message || error.message,
                quizResultsLoading: false,
                quizResults: null,
            });
            throw error;
        }
    },

    // Effacer les erreurs
    clearErrors: () =>
        set({
            studentsError: null,
            studentDetailError: null,
            quizStatsError: null,
            quizResultsError: null,
        }),

    // Réinitialiser les détails de l'étudiant
    clearStudentDetail: () => set({ studentDetail: null }),

    // Réinitialiser les résultats du quiz
    clearQuizResults: () => set({ quizResults: null }),
}));

export default useStudentResultsStore;
