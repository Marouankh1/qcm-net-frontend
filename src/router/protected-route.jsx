import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ element }) => {
    let auth = { token: false };

    if (!auth) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return element;
};
