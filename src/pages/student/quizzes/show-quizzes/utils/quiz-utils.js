export const quizUtils = {
    getQuestionCount(quiz) {
        return quiz.questions_count || (quiz.questions ? quiz.questions.length : 0);
    },

    getDuration(quiz) {
        return quiz.duration || 30;
    },

    getTeacherName(quiz) {
        if (!quiz.teacher) return null;
        return `${quiz.teacher.first_name} ${quiz.teacher.last_name}`;
    },

    formatQuizCount(count) {
        return `${count} quiz${count !== 1 ? 'zes' : ''}`;
    },
};
