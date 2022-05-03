const QuizModel = require('../models/Quiz');

class QuizGameEntity {

    async getAllQuizGame({lessonId, limit, RANDOM}) {
        try {
            //if limit is not undefined or null, get limit
            if (limit <= 0) {
                return null;
            }

            
            if (!RANDOM || RANDOM === false) {
                // if no Random get all quiz by sort createdAt

                const QuizGames = await QuizModel.find({ lesson: lessonId })
                    .select('-answer')
                    .limit(limit)
                    .sort({ createdAt: -1 });
                return QuizGames;
            }
            else {
                // if Random get all quiz by Random then sort createdAt

                const QuizGames = await QuizModel.find({ lesson: lessonId })
                    .select('-answer')
                    .limit(limit)
                    .random()
                    .sort({ createdAt: -1 });
                return QuizGames;
            }
        }
        catch (error) {
            throw error;
        }
    }

    async getQuizAnswer({lessonId, quizContext}) {
        try {
            // select only answer id and question            
            const QuizGamesAnswer = await QuizModel.find({ lesson: lessonId, _id: { $in: quizContext } })
                .select('answer question _id')
                .sort({ createdAt: -1 });

            return QuizGamesAnswer;
        }
        catch (error) {
            throw error;
        }
    }

}

module.exports = QuizGameEntity;