const QuizModel = require('../models/Quiz');
const Dashboard = require('../models/Dashboard');

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
                    .sort({ createdAt: 1 })
                    .where('deletedAt').equals(null);
                return QuizGames;
            }
            else {
                //random query by limit and random
                const QuizGames = await QuizModel.find({ lesson: lessonId })
                    .select('-answer')
                    .where('deletedAt').equals(null);
                    // .limit(limit)
                    // .sort({ createdAt: -1 })
                    // .random();

                //shuffle array
                QuizGames.sort(() => Math.random() - 0.5);
                //trim to limit
                QuizGames.splice(limit);

                return QuizGames;
            }
        }
        catch (error) {
            throw error;
        }
    }

    async getQuizAnswer({lessonId, quizIdSelected}) {
        try {
            // select only answer id and question            
            const QuizGamesAnswer = await QuizModel.find({ lesson: lessonId, _id: { $in: quizIdSelected } })
                .select('answer question _id')
                .sort({ createdAt: -1 });

            return QuizGamesAnswer;
        }
        catch (error) {
            throw error;
        }
    }

    async saveUserQuizResult({quizResult, classroomId}) {
        try {
            const dashboard = await Dashboard.findOne({ classroom: classroomId });
            // console.log(UpdatedDashboard);
            dashboard.studentCompleteQuiz.push({
                ...quizResult
            });

            const UpdatedDashboard = await dashboard.save();
               
            return UpdatedDashboard.studentCompleteQuiz;
        } catch (error) {
            throw error;
        }
    }

    async findUserInQuizGame({userId, classroomId, lessonId}) {
        try {
            const dashboard = await Dashboard.findOne({ classroom: classroomId });

            //find if user is in dashboard.studentCompleteQuiz and lesson is same
            const userInQuizGame = dashboard.studentCompleteQuiz.find(student => student.user.toString() === userId && student.lesson.toString() === lessonId);
            if (!userInQuizGame) {
                return false
            }
            return dashboard.studentCompleteQuiz;
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = QuizGameEntity;