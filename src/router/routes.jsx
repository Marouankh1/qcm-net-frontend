// import { createBrowserRouter } from 'react-router';
// import App from '@/App';
// import { Login } from '@/pages/auth/login';
// import Signup from '@/pages/auth/signup';
// import { ProtectedRoute } from '@/router/protected-route';
// import Admin from '@/pages/teacher/teacher';
// import Teacher from '@/pages/teacher/teacher';
// import Show from '@/pages/teacher/quizzes/show';
// import AddQuizze from '@/pages/teacher/quizzes/add';
// import ShowQuizzes from '@/pages/teacher/quizzes/show';

// export const router = createBrowserRouter([
//     {
//         path: '/login',
//         element: <Login />,
//     },
//     {
//         path: '/signup',
//         element: <Signup />,
//     },
//     {
//         path: '/',
//         element: <ProtectedRoute element={<App />} />,
//         children: [
//             {
//                 path: '/admin',
//                 element: <Admin />,
//             },
//             {
//                 path: '/dashboard',
//                 element: <Teacher />,
//             },
//             {
//                 path: '/quizzes',
//                 element: <ShowQuizzes />,
//             },
//             {
//                 path: '/quizzes/create',
//                 element: <AddQuizze />,
//             },
//         ],
//     },
// ]);

// router/index.jsx
import { createBrowserRouter, Navigate } from 'react-router';
import App from '@/App';
import { Login } from '@/pages/auth/login';
import Signup from '@/pages/auth/signup';
import { ProtectedRoute } from '@/router/protected-route';
import { RoleRoute } from '@/router/role-route';
// import Unauthorized from '@/pages/errors/unauthorized';

// Pages
// import AdminDashboard from '@/pages/admin/dashboard';
import TeacherDashboard from '@/pages/teacher/teacher';
import StudentDashboard from '@/pages/student/student';
import ShowQuizzes from '@/pages/teacher/quizzes/show';
import AddQuiz from '@/pages/teacher/quizzes/add';
import useAuthStore from '@/stores/authStore';
import NotFound from '@/pages/not-found';
// import StudentQuizzes from '@/pages/student/quizzes';

export const router = createBrowserRouter([
    {
        path: '/*',
        element: <NotFound />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
    // {
    //     path: '/unauthorized',
    //     element: <Unauthorized />,
    // },
    {
        path: '/',
        element: <ProtectedRoute element={<App />} />,
        children: [
            // Admin only routes
            // {
            //     path: '/admin',
            //     element: (
            //         <RoleRoute
            //             element={<AdminDashboard />}
            //             allowedRoles={['admin']}
            //         />
            //     ),
            // },

            // Teacher routes
            {
                path: '/teacher',
                element: (
                    <RoleRoute
                        element={<TeacherDashboard />}
                        allowedRoles={['teacher', 'admin']}
                    />
                ),
            },
            {
                path: '/teacher/quizzes',
                element: (
                    <RoleRoute
                        element={<ShowQuizzes />}
                        allowedRoles={['teacher', 'admin']}
                    />
                ),
            },
            {
                path: '/teacher/quizzes/create',
                element: (
                    <RoleRoute
                        element={<AddQuiz />}
                        allowedRoles={['teacher', 'admin']}
                    />
                ),
            },

            // Student routes
            {
                path: '/student',
                element: (
                    <RoleRoute
                        element={<StudentDashboard />}
                        allowedRoles={['student']}
                    />
                ),
            },
            // {
            //     path: '/student/quizzes',
            //     element: (
            //         <RoleRoute
            //             element={<StudentQuizzes />}
            //             allowedRoles={['student']}
            //         />
            //     ),
            // },

            // Default route based on role
            {
                index: true,
                element: <RoleBasedRedirect />,
            },
        ],
    },
]);

// Component to handle default redirect based on role
function RoleBasedRedirect() {
    const { getUserRole } = useAuthStore();
    const userRole = getUserRole();

    const roleRoutes = {
        admin: '/admin',
        teacher: '/teacher',
        student: '/student',
    };

    const defaultRoute = roleRoutes[userRole] || '/unauthorized';

    return (
        <Navigate
            to={defaultRoute}
            replace
        />
    );
}
