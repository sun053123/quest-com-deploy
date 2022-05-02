const QuizModel = require('../models/Quiz');

class QuizGameEntity {

    async getAllQuizGame(lessonId, limit) {
        try {
            //if limit is not undefined or null, get limit
            if (limit !== undefined || limit !== null || !limit) {
                const QuizGames = await QuizModel.find({ lesson: lessonId })
                    .select('-answer')
                    .limit(limit)
                    .sort({ createdAt: -1 });

                return QuizGames;
            }
            else {
                // if !limit , get all quiz
                const QuizGames = await QuizModel.find({ lesson: lessonId })
                    .select('-answer')
                    .sort({ createdAt: -1 });

                return QuizGames;
            }
        }
        catch (error) {
            throw error;
        }
    }

    async getQuizGameByType(lessonId, type, limit) {
        try {
            //if limit is not undefined or null, get limit
            if (limit !== undefined || limit !== null || limit) {
                const QuizGames = await QuizModel.find({ lesson: lessonId })
                    .where('type').equals(type)
                    .select('-answer')
                    .limit(limit)
                    .sort({ createdAt: -1 });

                return QuizGames;
            } else {
                // if !limit , get all quiz by type
                const QuizGames = await QuizModel.find({ lesson: lessonId, type })
                    .where('type').equals(type)
                    .select('-answer')
                    .sort({ createdAt: -1 });

                return QuizGames;
            }
        }
        catch (error) {
            throw error;
        }
    }

    // query random quiz
    async getRandomQuizGame(lessonId, limit) {
        try {
            //if limit is not undefined or null, get limit
            if (limit !== undefined || limit !== null || limit) {
                const QuizGames = await QuizModel.find({ lesson: lessonId })
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .random();

                return QuizGames;
            }
            else {
                // if !limit , get all random quiz
                const QuizGames = await QuizModel.find({ lesson: lessonId })
                    .select('-answer')
                    .sort({ createdAt: -1 })
                    .random();
                
                return QuizGames;

            }
        }
        catch (error) {
            throw error;
        }
    }


    async getQuizAnswer(lessonId) {
        try {
            const QuizGamesAnswer = await QuizModel.find({ lesson: lessonId })
                .select('answer', 'question', '_id')
                .sort({ createdAt: -1 });

            return QuizGamesAnswer;
        }
        catch (error) {
            throw error;
        }
    }

}

module.exports = QuizGameEntity;