import { createBrowserRouter } from 'react-router';
import App from '@/App';
import { Login } from '@/pages/auth/login';
import Signup from '@/pages/auth/signup';
import { ProtectedRoute } from '@/router/protected-route';
import Admin from '@/pages/teacher/teacher';
import Teacher from '@/pages/teacher/teacher';
import Show from '@/pages/teacher/quizzes/show';
import AddQuizze from '@/pages/teacher/quizzes/add';
import ShowQuizzes from '@/pages/teacher/quizzes/show';

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
            {
                path: '/dashboard',
                element: <Teacher />,
            },
            {
                path: '/quizzes',
                element: <ShowQuizzes />,
            },
            {
                path: '/quizzes/create',
                element: <AddQuizze />,
            },
        ],
    },
]);
