import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/services/api';

const useQuestionStore = create(
    persist(
        (set, get) => ({
            // State
            questions: [],
            choices: [],
            isLoading: false,
            error: null,
            currentQuestion: null,

            // Questions Actions
            setQuestions: (questions) => set({ questions }),

            addQuestion: (question) =>
                set((state) => ({
                    questions: [question, ...state.questions],
                })),

            updateQuestion: (updatedQuestion) =>
                set((state) => ({
                    questions: state.questions.map((question) =>
                        question.id === updatedQuestion.id ? { ...question, ...updatedQuestion } : question
                    ),
                })),

            deleteQuestion: (questionId) =>
                set((state) => ({
                    questions: state.questions.filter((question) => question.id !== questionId),
                    choices: state.choices.filter((choice) => choice.question_id !== questionId),
                })),

            // Get questions by quiz ID
            getQuestionsByQuiz: (quizId) => {
                const state = get();
                return state.questions.filter((question) => question.quiz_id === parseInt(quizId));
            },

            // Choices Actions
            setChoices: (choices) => set({ choices }),

            addChoice: (choice) =>
                set((state) => ({
                    choices: [...state.choices, choice],
                })),

            updateChoice: (updatedChoice) =>
                set((state) => ({
                    choices: state.choices.map((choice) =>
                        choice.id === updatedChoice.id ? { ...choice, ...updatedChoice } : choice
                    ),
                })),

            deleteChoice: (choiceId) =>
                set((state) => ({
                    choices: state.choices.filter((choice) => choice.id !== choiceId),
                })),

            // Get choices by question ID
            getChoicesByQuestion: (questionId) => {
                const state = get();
                return state.choices.filter((choice) => choice.question_id === parseInt(questionId));
            },

            // Get correct choices for a question
            getCorrectChoicesByQuestion: (questionId) => {
                const state = get();
                return state.choices.filter((choice) => choice.question_id === parseInt(questionId) && choice.is_correct);
            },

            // Loading and error states
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
            clearError: () => set({ error: null }),

            // Current question management
            setCurrentQuestion: (question) => set({ currentQuestion: question }),
            clearCurrentQuestion: () => set({ currentQuestion: null }),

            // API Calls
            fetchQuestionsByQuiz: async (quizId) => {
                try {
                    set({ isLoading: true, error: null });
                    const response = await api.get(`/questions/quiz/${quizId}`);
                    const questions = response.data.data || response.data;
                    set({ questions, isLoading: false });
                    return questions;
                } catch (error) {
                    const errorMessage = error.response?.data?.message || error.message || 'Failed to load questions';
                    set({ error: errorMessage, isLoading: false });
                    throw error;
                }
            },

            fetchAllChoices: async () => {
                try {
                    set({ isLoading: true, error: null });
                    const response = await api.get('/choices');
                    const result = response.data;

                    if (result.success) {
                        const choices = result.data || [];
                        set({ choices, isLoading: false });
                        return choices;
                    } else {
                        throw new Error(result.message || 'Failed to load choices');
                    }
                } catch (error) {
                    const errorMessage = error.response?.data?.message || error.message || 'Failed to load choices';
                    set({ error: errorMessage, isLoading: false });
                    throw error;
                }
            },

            createQuestionsWithChoices: async (questionsData) => {
                try {
                    set({ isLoading: true, error: null });

                    const createdQuestions = [];

                    for (const questionData of questionsData) {
                        const { choices, ...question } = questionData;

                        // Create question
                        const questionResponse = await api.post('/questions', question);
                        const questionResult = questionResponse.data;

                        if (!questionResult.success) {
                            throw new Error(questionResult.message || 'Failed to create question');
                        }

                        const createdQuestion = questionResult.data;

                        // Create choices for this question
                        let createdChoices = [];
                        if (choices && choices.length > 0) {
                            const choicesPromises = choices.map((choiceData) =>
                                api.post('/choices', {
                                    ...choiceData,
                                    question_id: createdQuestion.id,
                                })
                            );

                            const choicesResponses = await Promise.all(choicesPromises);
                            createdChoices = choicesResponses.map((response) => response.data.data || response.data);

                            // Update store with new choices
                            set((state) => ({
                                choices: [...state.choices, ...createdChoices],
                            }));
                        }

                        createdQuestions.push({
                            ...createdQuestion,
                            choices: createdChoices,
                        });

                        // Update store with new question
                        set((state) => ({
                            questions: [...state.questions, createdQuestion],
                        }));
                    }

                    return {
                        success: true,
                        data: createdQuestions,
                        message: 'Questions and choices created successfully',
                    };
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.message || error.message || 'Failed to create questions and choices';
                    set({ error: errorMessage, isLoading: false });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            createQuestion: async (questionData) => {
                try {
                    set({ isLoading: true, error: null });
                    const response = await api.post('/questions', questionData);
                    const result = response.data;

                    if (result.success) {
                        const question = result.data;
                        set((state) => ({
                            questions: [question, ...state.questions],
                            isLoading: false,
                        }));
                        return { success: true, data: question };
                    } else {
                        throw new Error(result.message || 'Failed to create question');
                    }
                } catch (error) {
                    const errorMessage = error.response?.data?.message || error.message || 'Failed to create question';
                    set({ error: errorMessage, isLoading: false });
                    throw error;
                }
            },

            createChoice: async (choiceData) => {
                try {
                    set({ isLoading: true, error: null });
                    const response = await api.post('/choices', choiceData);
                    const result = response.data;

                    if (result.success) {
                        const choice = result.data;
                        set((state) => ({
                            choices: [...state.choices, choice],
                            isLoading: false,
                        }));
                        return { success: true, data: choice };
                    } else {
                        throw new Error(result.message || 'Failed to create choice');
                    }
                } catch (error) {
                    const errorMessage = error.response?.data?.message || error.message || 'Failed to create choice';
                    set({ error: errorMessage, isLoading: false });
                    throw error;
                }
            },

            refreshQuizData: async (quizId) => {
                try {
                    set({ isLoading: true });
                    await get().fetchQuestionsByQuiz(quizId);
                    await get().fetchAllChoices();
                } catch (error) {
                    const errorMessage = error.response?.data?.message || error.message;
                    set({ error: errorMessage });
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            // Reset entire store
            reset: () =>
                set({
                    questions: [],
                    choices: [],
                    currentQuestion: null,
                    error: null,
                }),
        }),
        {
            name: 'question-store',
            partialize: (state) => ({
                questions: state.questions,
                choices: state.choices,
            }),
        }
    )
);

export default useQuestionStore;
