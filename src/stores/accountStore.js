import { create } from 'zustand';
import api from '@/services/api';

const useAccountStore = create((set, get) => ({
    isLoading: false,
    isPasswordLoading: false,
    error: null,

    // Set loading states
    setLoading: (loading) => set({ isLoading: loading }),
    setPasswordLoading: (loading) => set({ isPasswordLoading: loading }),

    // Set error state
    setError: (error) => set({ error }),

    // Clear error state
    clearError: () => set({ error: null }),

    // API Calls
    updateProfile: async (profileData) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.put('/profile', profileData);
            const result = response.data;

            if (result.message === 'Profile updated successfully') {
                set({ isLoading: false });
                return { success: true, data: result.user };
            } else {
                throw new Error(result.message || 'Failed to update profile');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
            const errors = error.response?.data?.errors || {};
            set({ error: errorMessage, isLoading: false });
            throw { message: errorMessage, errors };
        }
    },

    updatePassword: async (passwordData) => {
        try {
            set({ isPasswordLoading: true, error: null });
            const response = await api.put('/password', passwordData);
            const result = response.data;

            if (result.message === 'Password updated successfully') {
                set({ isPasswordLoading: false });
                return { success: true, message: result.message };
            } else {
                throw new Error(result.message || 'Failed to update password');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update password';
            const errors = error.response?.data?.errors || {};
            set({ error: errorMessage, isPasswordLoading: false });
            throw { message: errorMessage, errors };
        }
    },

    updateAccount: async (accountData) => {
        try {
            set({ isLoading: true, isPasswordLoading: true, error: null });
            const response = await api.put('/account', accountData);
            const result = response.data;

            if (result.message === 'Account updated successfully') {
                set({ isLoading: false, isPasswordLoading: false });
                return { success: true, data: result.user };
            } else {
                throw new Error(result.message || 'Failed to update account');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update account';
            const errors = error.response?.data?.errors || {};
            set({ error: errorMessage, isLoading: false, isPasswordLoading: false });
            throw { message: errorMessage, errors };
        }
    },
}));

export default useAccountStore;
