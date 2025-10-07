import useAuthStore from '@/stores/authStore';
import { Navigate } from 'react-router';

export const ProtectedRoute = ({ element }) => {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return element;
};
