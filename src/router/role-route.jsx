import { Navigate, useLocation } from 'react-router';
import useAuthStore from '@/stores/authStore';

export const RoleRoute = ({ element, allowedRoles = [], fallbackPath = '/unauthorized', redirectTo = '/login' }) => {
    const { isAuthenticated, getUserRole, hasAnyRole } = useAuthStore();
    const location = useLocation();
    const userRole = getUserRole();

    if (!isAuthenticated) {
        return (
            <Navigate
                to={redirectTo}
                state={{ from: location }}
                replace
            />
        );
    }

    if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
        return (
            <Navigate
                to={fallbackPath}
                replace
            />
        );
    }

    return element;
};
