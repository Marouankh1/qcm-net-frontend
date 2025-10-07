import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // window.location.href = '/login';
        }

        if (error.response?.status === 419) {
            await api.get('/sanctum/csrf-cookie');
            return api.request(originalRequest);
        }

        return Promise.reject(error);
    }
);

export default api;
