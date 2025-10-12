import axios from 'axios';
import useAuthStore from '@/stores/authStore';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Get the store and force logout
            const store = useAuthStore.getState();
            store.forceLogout();

            // Redirect to login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        if (error.response?.status === 419) {
            await api.get('/sanctum/csrf-cookie');
            return api.request(originalRequest);
        }

        return Promise.reject(error);
    }
);

export default api;
