// import api from '@/services/api';
// import { useMutation, useQuery, QueryClientProvider } from '@tanstack/react-query';

// export const useApiQuery = (key, endpoint, options = {}) => {
//     return useQuery({
//         queryKey: key,
//         queryFn: async () => {
//             const response = await api.get(endpoint);
//             return response.data;
//         },
//         ...options,
//     });
// };

// export const useApiMutation = (mutationFn, options = {}) => {
//     const queryClient = QueryClientProvider();

//     return useMutation({
//         mutationFn,
//         onSuccess: (data, variables, context) => {
//             if (options.invalidateQueries) {
//                 queryClient.invalidateQueries(options.invalidateQueries);
//             }
//         },
//         ...options,
//     });
// };

// // Specific auth hooks
// export const useLogin = () => {
//     return useApiMutation((credentials) => api.post('/auth/login', credentials).then((res) => res.data));
// };

// export const useUser = () => {
//     return useApiQuery(['user'], '/auth/user', {
//         retry: false,
//         staleTime: 5 * 60 * 1000,
//     });
// };
