import { create } from 'zustand';
import { authAPI } from '../services/api';

const authStore = create((set, get) => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,

    setUser: (user) => set({ user }),
    setToken: (token) => {
        localStorage.setItem('token', token);
        set({ token });
    },
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    login: async (credentials) => {
        try {
            set({ isLoading: true, error: null });
            const response = await authAPI.login(credentials);
            const { user, access_token } = response.data;

            get().setToken(access_token);
            get().setUser(user);

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            set({ error: errorMessage });
            return { success: false, error: errorMessage };
        } finally {
            set({ isLoading: false });
        }
    },

    register: async (userData) => {
        try {
            set({ isLoading: true, error: null });
            const response = await authAPI.register(userData);
            const { user, access_token } = response.data;

            get().setToken(access_token);
            get().setUser(user);

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            set({ error: errorMessage });
            return { success: false, error: errorMessage };
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('token');
            set({ user: null, token: null });
        }
    },

    fetchUser: async () => {
        try {
            const token = get().token;
            if (!token) return;

            const response = await authAPI.getUser();
            set({ user: response.data });
        } catch (error) {
            console.error('Failed to fetch user:', error);
            get().logout();
        }
    },

    clearError: () => set({ error: null }),
}));

export default authStore;