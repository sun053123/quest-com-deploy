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

    async checkClassroomAndLessonIsExist({ classroomId, lessonId }) {
        try {
            const classroom = await this.ClassroomEntity.getClassroomById({ classroomId });
            if (!classroom) {
                return false
            }
            const lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!lesson) {
                return false
            }
            return true;
        }
        catch (error) {
            throw error;
        }
    }

    async GetQuizGame({ classroomId, quizId, lessonId }) {
        // this will check limitation of quizgame in Lesson model first
        try {
            const IsExist = await this.checkClassroomAndLessonIsExist({ classroomId, lessonId });
            if(!IsExist){
                return FormateData({
                    error: [
                        {
                            "msg": "Not found Lesson or Classroom!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND
                });
            }
                
            const Lesson = await this.LessonEntity.getLessonById({lessonId});
            if (!Lesson) {
                return FormateData({
                    error: [
                        {
                            "msg": "Not found Lesson!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND
                });
            }

            //check is quizgame are ready to play or not 
            if (Lesson.quizIsReady === false) {
                return FormateData({
                    error: [
                        {
                            "msg": "Quiz is not Ready!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.BAD_REQUEST
                });
            }

            //FIXME: 
            
            //check quiz is Random or not ( Limit is always on and not less than ...)
            let RANDOM = false
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
            // console.log(quizContext)
            const QuizResult = await this.QuizGameEntity.getQuizAnswer({ lessonId, quizContext });
            // console.log(QuizResult)
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