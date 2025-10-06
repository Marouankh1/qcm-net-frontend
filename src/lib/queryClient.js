import { QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClientProvider({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                if (error?.response?.status === 401) {
                    return false;
                }
                return failureCount < 3;
            },
            staleTime: 5 * 60 * 1000,
        },
        mutations: {
            retry: 1,
        },
    },
});
