const { LessonEntity, ClassroomEntity, QuizGameEntity, DashboardEntity, ProfileEntity } = require('../database');

const { FormateData } = require('../utils');
const HTTP_STATUS_CODES = require('../utils/HTTPConstant');

class QuizGameService {

    constructor() {
        this.LessonEntity = new LessonEntity();
        this.ClassroomEntity = new ClassroomEntity();
        this.QuizGameEntity = new QuizGameEntity();
        this.DashboardEntity = new DashboardEntity();
        this.ProfileEntity = new ProfileEntity();
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
            return classroom;
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
    
    async GetQuizGameResult({ classroomId, userId, lessonId, quizIdSelected }) {
        try {
            // console.log(quizContext)
            let isSubmitted = false
            let AllResult = []

            let UserInQuizDashboard = await this.QuizGameEntity.findUserInQuizGame({ userId, lessonId, classroomId });
            if (UserInQuizDashboard) {
                isSubmitted = true
                AllResult = UserInQuizDashboard
            }

            const QuizResult = await this.QuizGameEntity.getQuizAnswer({ lessonId, quizIdSelected });
            // console.log(QuizResult)
            return FormateData({
                data: {
                    quizAnswer: QuizResult,
                    isSummited: isSubmitted,
                    allResult: AllResult
                },
                status: HTTP_STATUS_CODES.OK
            });
        } catch (error) {
            throw error;
        }
    }

    async SaveQuizGameResult({ classroomId, lessonId, result, timeTaken, expgain, attempts, score, userId }) {

        try {
            const isExistClassroom = await this.checkClassroomAndLessonIsExist({classroomId, lessonId})
            console.log(isExistClassroom)
            if (!isExistClassroom){
                return FormateData({
                    error: [
                        {
                            "msg": "Not found Lesson or Classroom!",
                            "location": "server",
                            "type":"error",
                        }
                    ],
                })
            }

            //check user already complete quiz before
            let UserInQuizDashboard = await this.QuizGameEntity.findUserInQuizGame({ userId, lessonId, classroomId });
            if (!UserInQuizDashboard) {

            //if not complete quiz before save and isSubmitted is true
            const quizResult = {}

            quizResult.user = userId
            quizResult.lesson = lessonId
            quizResult.timeTaken = timeTaken
            quizResult.expgain = expgain
            quizResult.attempts = attempts
            quizResult.score = score
            quizResult.result = result

            UserInQuizDashboard = await this.QuizGameEntity.saveUserQuizResult({quizResult, classroomId})

            //update exp to user
            let category = isExistClassroom.category
            await this.ProfileEntity.updateUserExp({ userId, expgain, category });

            }
            
            

            return FormateData({
                data: {
                    allResult: UserInQuizDashboard,
                    isSummited: true
                },
                status: HTTP_STATUS_CODES.OK
            });
            
            
        } catch (error) {
            throw error;
        }
            
        }
}

module.exports = QuizGameService;