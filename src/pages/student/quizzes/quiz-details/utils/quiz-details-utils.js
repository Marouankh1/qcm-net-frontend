export const quizDetailsUtils = {
    getQuestionCount(quiz) {
        return quiz?.questions?.length || 0;
    },

    getDuration(quiz) {
        return quiz?.duration || 30;
    },

    getTeacherName(quiz) {
        if (!quiz?.teacher) return null;
        return `${quiz.teacher.first_name} ${quiz.teacher.last_name}`;
    },

    hasQuestions(quiz) {
        return this.getQuestionCount(quiz) > 0;
    },
};
