import { useState, useEffect, useCallback } from 'react';

export function useDebouncedSearch(initialValue = '', delay = 300) {
    const [input, setInput] = useState(initialValue);
    const [debouncedValue, setDebouncedValue] = useState(initialValue);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(input);
        }, delay);

        return () => clearTimeout(timer);
    }, [input, delay]);

    const clear = useCallback(() => {
        setInput('');
        setDebouncedValue('');
    }, []);

    return {
        input,
        setInput,
        debouncedValue,
        clear,
    };
}
