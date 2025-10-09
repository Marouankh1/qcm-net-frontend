import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
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
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
            setDefault: () => set({ user: null, isAuthenticated: false, isLoading: false }),
            clearError: () => set({ error: null }),
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
