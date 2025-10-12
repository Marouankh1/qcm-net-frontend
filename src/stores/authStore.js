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
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),
            login: (userData) => {
                set({
                    user: userData,
                    isAuthenticated: true,
                    error: null,
                });
            },
            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    error: null,
                });
            },
            setDefault: () => set({ user: null, isAuthenticated: false, isLoading: false }),
            getUserRole: () => {
                const { user } = get();
                return user?.role || null;
            },
            hasRole: (role) => {
                const { user } = get();
                return user?.role === role;
            },
            hasAnyRole: (roles) => {
                const { user } = get();
                return roles.includes(user?.role);
            },
            isAdmin: () => get().hasRole('admin'),
            isTeacher: () => get().hasRole('teacher'),
            isStudent: () => get().hasRole('student'),
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
                    const errorMessage = error.response?.data?.message || error.message || 'Logout failed';
                    set({ error: errorMessage, isLoading: false });
                    throw error;
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
