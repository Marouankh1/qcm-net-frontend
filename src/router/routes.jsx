import { createBrowserRouter } from 'react-router';
import App from '@/App';
import { Login } from '@/pages/auth/login';
import Signup from '@/pages/auth/signup';
import { ProtectedRoute } from '@/router/protected-route';
import Admin from '@/pages/admin/admin';

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
    {
        path: '/',
        element: <ProtectedRoute element={<App />} />,
        children: [
            {
                path: '/admin',
                element: <Admin />,
            },
        ],
    },
]);
