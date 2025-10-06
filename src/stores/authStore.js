import api from '@/services/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (credentials) => {
                try {
                    set({ isLoading: true });

                    const response = await api.post('/login', credentials);

                    set({
                        user: response.data.data.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    return { success: true, user: response.data.data.user };
                } catch (error) {
                    set({ isLoading: false });
                    return {
                        success: false,
                        error: error.response?.data?.message || 'Login failed',
                    };
                }
            },

            register: async (userData) => {
                try {
                    set({ isLoading: true });
                    const response = await api.post('/api/register', userData);

                    set({
                        user: response.data.data.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    return { success: true, user: response.data.data.user };
                } catch (error) {
                    set({ isLoading: false });
                    return {
                        success: false,
                        error: error.response?.data?.message || 'Registration failed',
                    };
                }
            },

            logout: async () => {
                try {
                    await api.post('/api/logout');
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    set({ user: null, isAuthenticated: false, isLoading: false });
                }
            },

            checkAuth: async () => {
                try {
                    set({ isLoading: true });
                    const response = await api.get('/api/user');

                    set({
                        user: response.data.data.user,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            },

            clearError: () => {
                // Clear any auth errors
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;
