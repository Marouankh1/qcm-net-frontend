import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/services/api';

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Set loading state
            setLoading: (loading) => set({ isLoading: loading }),

            // Set error state
            setError: (error) => set({ error }),

            // Clear error state
            clearError: () => set({ error: null }),

            // Login action
            login: (userData) => {
                set({
                    user: userData,
                    isAuthenticated: true,
                    error: null,
                });
            },

            // Logout action
            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            // Force logout (for token expiration)
            forceLogout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    error: 'Session expired. Please log in again.',
                });
            },

            // Set default state
            setDefault: () => set({ user: null, isAuthenticated: false, isLoading: false }),

            // Get user role
            getUserRole: () => {
                const { user } = get();
                return user?.role || null;
            },

            // Check if user has specific role
            hasRole: (role) => {
                const { user } = get();
                return user?.role === role;
            },

            // Check if user has any of the specified roles
            hasAnyRole: (roles) => {
                const { user } = get();
                return roles.includes(user?.role);
            },

            // Role check helpers
            isAdmin: () => get().hasRole('admin'),
            isTeacher: () => get().hasRole('teacher'),
            isStudent: () => get().hasRole('student'),

            // API Calls
            loginUser: async (credentials) => {
                try {
                    set({ isLoading: true, error: null });
                    const response = await api.post('/login', credentials);
                    const result = response.data;

                    if (result.success) {
                        set({
                            user: result.data.user,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
                        return result;
                    } else {
                        throw new Error(result.message || 'Login failed');
                    }
                } catch (error) {
                    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
                    set({ error: errorMessage, isLoading: false });
                    throw error;
                }
            },

            signupUser: async (userData) => {
                try {
                    set({ isLoading: true, error: null });
                    const response = await api.post('/register', userData);
                    const result = response.data;

                    if (result.success) {
                        set({
                            user: result.data.user,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                        });
                        return result;
                    } else {
                        throw new Error(result.message || 'Signup failed');
                    }
                } catch (error) {
                    const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
                    set({ error: errorMessage, isLoading: false });
                    throw error;
                }
            },

            logoutUser: async () => {
                try {
                    set({ isLoading: true });
                    await api.post('/logout');
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    });
                    return { success: true, message: 'Logged out successfully' };
                } catch (error) {
                    // Even if logout API fails, clear local state
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    });
                    return { success: true, message: 'Logged out successfully' };
                }
            },

            // Validate token on app start
            validateToken: async () => {
                try {
                    const { isAuthenticated } = get();
                    if (!isAuthenticated) return false;

                    // Make a simple API call to validate token
                    const response = await api.get('/profile');
                    return response.data.success;
                } catch (error) {
                    if (error.response?.status === 401) {
                        get().forceLogout();
                    }
                    return false;
                }
            },
        }),
        {
            name: 'AuthStore',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;
