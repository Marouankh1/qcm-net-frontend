import { useApiMutation, useApiQuery } from '@/hooks/react-query/useApi';
import api from '@/services/api';

// export const useCreateQuiz = async () => {
//     return await useApiMutation((quizeData) => api.post('/quizzes', quizeData));
// };

export const quizKeys = {
    all: ['quizzes'],
    lists: () => [...quizKeys.all, 'list'],
    list: (filters) => [...quizKeys.lists(), { filters }],
    details: () => [...quizKeys.all, 'detail'],
    detail: (id) => [...quizKeys.details(), id],
};

// Get all quizzes
export const useQuizzes = (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    const url = queryString ? `/quizzes?${queryString}` : '/quizzes';

    return useApiQuery(quizKeys.list(filters), url, {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};

// Get single quiz by ID
export const useQuiz = (id) => {
    return useApiQuery(quizKeys.detail(id), `/quizzes/${id}`, {
        enabled: !!id, // Only run if ID exists
        staleTime: 5 * 60 * 1000,
    });
};

// Create quiz mutation
export const useCreateQuiz = () => {
    return useApiMutation((quizData) => api.post('/quizzes', quizData), {
        invalidateQueries: quizKeys.lists(),
    });
};

// Update quiz mutation
export const useUpdateQuiz = () => {
    return useApiMutation(({ id, ...quizData }) => api.put(`/quizzes/${id}`, quizData), {
        invalidateQueries: quizKeys.all,
    });
};

// Delete quiz mutation
export const useDeleteQuiz = () => {
    return useApiMutation((id) => api.delete(`/quizzes/${id}`), {
        invalidateQueries: quizKeys.lists(),
    });
};

// Publish quiz mutation
export const usePublishQuiz = () => {
    return useApiMutation((id) => api.patch(`/quizzes/${id}/publish`), {
        invalidateQueries: quizKeys.all,
    });
};
