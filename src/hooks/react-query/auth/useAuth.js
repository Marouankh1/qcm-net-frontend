import { useApiMutation } from '@/hooks/react-query/useApi';
import api from '@/services/api';

export const useLogin = () => {
    return useApiMutation((credentials) => api.post('/login', credentials));
};

export const useSignup = () => {
    return useApiMutation((userData) => api.post('/register', userData));
};

export const useLogout = () => {
    return useApiMutation(() => api.post('/logout'));
};
