const { LessonEntity, ClassroomEntity, QuizGameEntity, DashboardEntity } = require('../database');

const { FormateData } = require('../utils');
const HTTP_STATUS_CODES = require('../utils/HTTPConstant');

class QuizGameService {

    constructor() {
        this.LessonEntity = new LessonEntity();
        this.ClassroomEntity = new ClassroomEntity();
        this.QuizGameEntity = new QuizGameEntity();
        this.DashboardEntity = new DashboardEntity();
    }

    async GetQuizGame({ classroomId, quizId, lessonId }) {
        // this will check limitation of quizgame in Lesson model first
        try {
            const Lesson = await this.LessonEntity.getLessonById({lessonId});
            if (!Lesson) {
                return FormateData({
                    error: [
                        {
                            "msg": "Not found Lesson!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE
                });
            }

            if (Lesson.quizIsReady === false) {
                return FormateData({
                    error: [
                        {
                            "msg": "Quiz is not Ready!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE
                });
            }
            const RANDOM = false
            //check quiz is Random or not ( Limit is always on and not less than 1)
            if (Lesson.quizIsRandom === true) {
                RANDOM = true
            } 
            const QuizGame = await this.QuizGameEntity.getAllQuizGame({ lessonId, RANDOM, limit: Lesson.quizLimit });
            return FormateData({
                data: QuizGame,
                status: HTTP_STATUS_CODES.OK
            });
        }
        catch (error) {
            throw error;
        }
    }

    async GetQuizGameResult({ classroomId, quizId, lessonId, quizContext }) {
        try {
            console.log(quizContext)
            const QuizResult = await this.QuizGameEntity.getQuizAnswer({ lessonId, quizContext });
            console.log(QuizResult)
            return FormateData({
                data: QuizResult,
                status: HTTP_STATUS_CODES.OK
            });

        } catch (error) {
            throw error;
        }
    }
}

module.exports = QuizGameService;