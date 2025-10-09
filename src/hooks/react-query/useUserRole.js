import useAuthStore from '@/stores/authStore';

export const useUserRole = () => {
    const { getUserRole, hasRole, hasAnyRole, isAdmin, isTeacher, isStudent } = useAuthStore();

    return {
        userRole: getUserRole(),
        hasRole,
        hasAnyRole,
        isAdmin: isAdmin(),
        isTeacher: isTeacher(),
        isStudent: isStudent(),
    };
};
