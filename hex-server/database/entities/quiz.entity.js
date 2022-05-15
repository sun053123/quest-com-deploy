const QuizModel = require('../models/Quiz');
const LessonModel = require('../models/Lesson');
class QuizEntity {

    async getQuizzes({ lessonId }) {
        try {
            const Quizzes = await QuizModel.find({ lesson: lessonId })
                // .populate('creator', ['username', 'email'])
                // .populate('lesson', ['title','quizCount','quizIsReady','quizIsRandom','quizLimit'])
                .where('deletedAt').equals(null)
                .lean()
                .sort({ createdAt: -1 });

            // console.log(Quizzes);
            return Quizzes;
        }
        catch (error) {
            throw error;
        }
    }

    async getQuizController({ lessonId }) {
        try {
            const QuizController = await LessonModel.findById(lessonId)
                .lean()
                .select('quizCount quizIsReady quizIsRandom quizLimit');
            return QuizController;
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
            const Quiz = await QuizModel.findById(quizId)
            .where('deletedAt').equals(null)
            .lean()
            .populate('creator', ['username', 'email'])
            .populate('lesson', ['title']);
            return Quiz;
        }
        catch (error) {
            throw error;
        }
    }

    async deleteQuiz({ quizId }) {
        try {
            const DeletedQuiz = await QuizModel.findByIdAndUpdate(quizId, {
                deletedAt: Date.now(),
                updateAt: Date.now(),
            }, { new: true });
            return DeletedQuiz;
        }
        catch (error) {
            throw error;
        }
    }

    async updateQuizControl({ lessonId, quizLimit, quizIsRandom  }) {
        try {
            //need only quizLimit , quizIsRandom, quizCount, quizIsReady,
            const UpdatedQuizController = await LessonModel.findByIdAndUpdate(lessonId, {
                quizLimit,
                quizIsRandom,
                updateAt: Date.now(),
            }, { new: true })
            .select('quizCount quizIsReady quizIsRandom quizLimit');

            return UpdatedQuizController;
        } 
        catch (error) {
            throw error;
        }
    }
    
}

module.exports = QuizEntity;

