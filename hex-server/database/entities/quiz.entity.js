const QuizModel = require('../models/Quiz');

class QuizEntity {

    async getQuizes({ lessonId }) {
        try {
            const Quizes = await QuizModel.find({ lesson: lessonId })
                .populate('creator', ['username', 'email'])
                .populate('lesson', ['title','quizCount','quizIsReady','quizIsRandom','quizLimit'])
                .sort({ createdAt: -1 });
            return Quizes;
        }
        catch (error) {
            throw error;
        }
    }

    async createQuiz({ lessonId, userId, question, questionImg, options, answer, explanation, type}) {
        try {
            const NewQuiz = new QuizModel({
                lesson: lessonId,
                creator: userId,
                question,
                questionImg,
                options,
                answer,
                explanation,
                type,
            });
            const CreatedQuiz = await NewQuiz.save();
            return CreatedQuiz;
        }
        catch (error) {
            throw error;
        }
    }

    async updateQuiz({ lessonId, question, questionImg, options, answer, explanation, type }) {
        try {
            const UpdatedQuiz = await QuizModel.findByIdAndUpdate(lessonId, {
                question,
                questionImg,
                options,
                answer,
                explanation,
                type,
                updateAt: Date.now(),
            }, { new: true });

            return UpdatedQuiz;
        }
        catch (error) {
            throw error;
        }
    }

    async getQuizById({ quizId }) {
        try {
            const Quiz = await QuizModel.findById(quizId).populate('creator', ['username', 'email']).populate('lesson', ['title']);
            return Quiz;
        }
        catch (error) {
            throw error;
        }
    }

    async deleteQuiz({ quizId }) {
        try {
            const DeletedQuiz = await QuizModel.findByIdAndDelete(quizId);
            return DeletedQuiz;
        }
        catch (error) {
            throw error;
        }
    }
    
}

module.exports = QuizEntity;

