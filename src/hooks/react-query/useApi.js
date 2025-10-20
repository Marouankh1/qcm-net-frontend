import api from '@/services/api';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '@/stores/authStore';

export const useApiQuery = (key, url, options = {}) => {
    const { logout, setDefault } = useAuthStore();

    return useQuery({
        queryKey: key,
        queryFn: async () => {
            try {
                const response = await api.get(url);
                return response.data;
            } catch (error) {
                // Extract error message
                const errorMessage =
                    error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Something went wrong';

                toast.error(errorMessage);

                // Auto logout on 401 Unauthorized
                if (error?.response?.status === 401) {
                    setDefault();
                }

                throw error;
            }
        },
        retry: false,
        ...options,
    });
};

export const useApiMutation = (mutationFn, options = {}) => {
    const queryClient = useQueryClient();
    const { setDefault } = useAuthStore();

    return useMutation({
        mutationFn,
        ...options,
        retry: false,
        onSuccess: (axiosResponse, variables, context) => {
            const responseData = axiosResponse.data;

            if (options.invalidateQueries) {
                queryClient.invalidateQueries(options.invalidateQueries);
            }

            if (options.onSuccessCustom) {
                options.onSuccessCustom(responseData, variables, context);
            } else {
                responseData.message && toast.success(responseData.message);
            }
        },
        onError: (error, variables, context) => {
            const errorMessage =
                error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Something went wrong';

            toast.error(errorMessage);

            if (error?.response?.status === 401) {
                setDefault();
            }

            if (options.onErrorCustom) {
                options.onErrorCustom(error, variables, context);
            }
        },
    });
};
