// hooks/useQuestions.js
import { useApiMutation, useApiQuery } from '@/hooks/react-query/useApi';
import useQuestionStore from '@/stores/questionStore';
import api from '@/services/api';

// Questions hooks
export const useGetQuestions = (quizId = null) => {
    const { setQuestions, setLoading, setError } = useQuestionStore();

    return useApiQuery(['questions', quizId], quizId ? `/questions/quiz/${quizId}` : '/questions', {
        onSuccess: (data) => {
            setQuestions(Array.isArray(data) ? data : data.data || []);
        },
        onError: (error) => {
            setError(error.message);
        },
        onSettled: () => {
            setLoading(false);
        },
    });
};

export const useCreateQuestion = () => {
    const { addQuestion } = useQuestionStore();

    return useApiMutation((questionData) => api.post('/questions', questionData), {
        onSuccessCustom: (data) => {
            addQuestion(data.data);
        },
        invalidateQueries: ['questions'],
    });
};

export const useUpdateQuestion = () => {
    const { updateQuestion } = useQuestionStore();

    return useApiMutation(({ id, ...data }) => api.put(`/questions/${id}`, data), {
        onSuccessCustom: (data, variables) => {
            updateQuestion(data.data);
        },
        invalidateQueries: ['questions'],
    });
};

export const useDeleteQuestion = () => {
    const { deleteQuestion } = useQuestionStore();

    return useApiMutation((id) => api.delete(`/questions/${id}`), {
        onSuccessCustom: (data, variables) => {
            deleteQuestion(variables);
        },
        invalidateQueries: ['questions'],
    });
};

// Choices hooks
export const useGetChoices = (questionId = null) => {
    const { setChoices } = useQuestionStore();

    return useApiQuery(['choices', questionId], questionId ? `/choices/question/${questionId}` : '/choices', {
        onSuccess: (data) => {
            setChoices(Array.isArray(data) ? data : data.data || []);
        },
    });
};

export const useCreateChoice = () => {
    const { addChoice } = useQuestionStore();

    return useApiMutation((choiceData) => api.post('/choices', choiceData), {
        onSuccessCustom: (data) => {
            addChoice(data.data);
        },
        invalidateQueries: ['choices'],
    });
};

export const useUpdateChoice = () => {
    const { updateChoice } = useQuestionStore();

    return useApiMutation(({ id, ...data }) => api.put(`/choices/${id}`, data), {
        onSuccessCustom: (data, variables) => {
            updateChoice(data.data);
        },
        invalidateQueries: ['choices'],
    });
};

export const useDeleteChoice = () => {
    const { deleteChoice } = useQuestionStore();

    return useApiMutation((id) => api.delete(`/choices/${id}`), {
        onSuccessCustom: (data, variables) => {
            deleteChoice(variables);
        },
        invalidateQueries: ['choices'],
    });
};

export const useCreateQuestionsWithChoices = () => {
    return useApiMutation(async (questionsData) => {
        // Create all questions first
        const createdQuestions = [];

        for (const questionData of questionsData) {
            const { choices, ...question } = questionData;
            const questionResponse = await api.post('/questions', question);
            const createdQuestion = questionResponse.data.data;

            // Then create choices for this question
            if (choices && choices.length > 0) {
                const choicesPromises = choices.map((choiceData) =>
                    api.post('/choices', {
                        ...choiceData,
                        question_id: createdQuestion.id,
                    })
                );

                await Promise.all(choicesPromises);
            }

            createdQuestions.push({
                ...createdQuestion,
                choices: choices || [],
            });
        }

        return { data: createdQuestions, success: true };
    });
};