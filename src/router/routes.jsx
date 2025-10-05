import { createBrowserRouter } from 'react-router';
import App from '@/App';
import { Login } from '@/pages/auth/Login';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    // {
    //     element: <ProtectedRoute />,
    //     children: [
    //         {
    //             path: '/',
    //             element: <App />,
    //         },
    //     ],
    // },
]);
