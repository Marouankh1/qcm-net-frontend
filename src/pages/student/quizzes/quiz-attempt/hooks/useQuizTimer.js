import { useState, useEffect, useCallback } from 'react';

export const useQuizTimer = (initialTime, onTimeUp) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            onTimeUp();
        }
    }, [timeLeft, onTimeUp]);

    const formatTime = useCallback((seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }, []);

    return { timeLeft, formatTime };
};