import api from '@/services/api';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '@/stores/authStore';

export const useApiQuery = (key, endpoint, options = {}) => {
    const { isAuthenticated } = useAuthStore();

    return useQuery({
        queryKey: key,
        queryFn: async () => {
            const response = await api.get(endpoint);
            return response.data;
        },
        ...options,
        enabled: isAuthenticated && options.enabled !== false,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export const useApiMutation = (mutationFn, options = {}) => {
    const queryClient = useQueryClient();
    const { logout, setLoading, setDefault } = useAuthStore();

    return useMutation({
        mutationFn,
        ...options,
        retry: false,
        onSuccess: (data, variables, context) => {
            if (options.invalidateQueries) {
                queryClient.invalidateQueries(options.invalidateQueries);
            }

            if (options.onSuccessCustom) {
                options.onSuccessCustom(data, variables, context);
            } else {
                toast.success(data.message || 'Operation successful');
            }
        },
        onError: (error, variables, context) => {
            const errorMessage = error?.response?.data?.message || 'Something went wrong';

            toast.error(errorMessage);
            // // Auto logout on 401 Unauthorized
            if (error?.response?.status === 401) {
                setDefault();
            }
            //     logout();
            //     toast.error('Session expired. Please login again.');
            //     toast.error(errorMessage);
            // } else {
            //     toast.error(errorMessage);
            // }

            if (options.onErrorCustom) {
                options.onErrorCustom(error, variables, context);
            }
        },
    });
};

// // refetchOnWindowFocus : false <=== when open other software in windows and return to the application
// // refetchOnMount : false <==== on load page
// // staleTime: 2000
// // refetchInterval: 2000
// // cacheTime: 2000
