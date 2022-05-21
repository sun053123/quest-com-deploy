const { LessonEntity, ClassroomEntity, QuizGameEntity, DashboardEntity, ProfileEntity } = require('../database');

const { FormateData, PackedError } = require('../utils');
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
            const classroom = await this.ClassroomEntity.checkClassroomExist({ classroomId });
            if (!classroom) {
                return FormateData(PackedError("Classroom not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 

            }
            const lesson = await this.LessonEntity.checkLessonExist({ lessonId });
            if (!lesson) {
                return FormateData(PackedError("Lesson or Lesson not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
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
                return FormateData(PackedError("Quiz not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }
                
            const Lesson = await this.LessonEntity.getLessonById({lessonId});
            if (!Lesson) {
                return FormateData(PackedError("Lesson not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }

            //check is quizgame are ready to play or not 
            if (Lesson.quizIsReady === false) {
                return FormateData(PackedError("Quiz is not Ready!", "server", "error", HTTP_STATUS_CODES.BAD_REQUEST)); 
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
                AllResult = UserInQuizDashboard// get all result
            }

            const QuizResult = await this.QuizGameEntity.getQuizAnswer({ lessonId, quizIdSelected });
            // console.log(QuizResult)
            const UserMaxScore = await this.DashboardEntity.findUserHightScoreQuiz({ classroomId, lessonId });

            return FormateData({
                data: {
                    highScore: UserMaxScore,
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
            if (!isExistClassroom){
                return FormateData(PackedError("Not found Lesson or Classroom!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
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
                const ClassroomCategory = await this.ClassroomEntity.getClassroomById({ classroomId });
                let category = ClassroomCategory.category

                await this.ProfileEntity.updateUserExp({ userId, expgain, category });

                //update quizhistory on profile
                await this.ProfileEntity.updateUserQuizHistory({ userId, lessonId, classroomId, expgain, score, timeTaken, attempts });
            }
            
            const UserMaxScore = await this.DashboardEntity.findUserHightScoreQuiz({ classroomId, lessonId });

            return FormateData({
                data: {
                    highScore: UserMaxScore,
                    allResult: UserInQuizDashboard,
                    isSummited: true
                },
                status: HTTP_STATUS_CODES.OK
            });
        } catch (error) {
            throw error;
        }
    }

    async GetUserMaxScoreQuizGame({ classroomId, lessonId, userId }) {
        try {
            const isExistClassroom = await this.checkClassroomAndLessonIsExist({classroomId, lessonId})
            if (!isExistClassroom){
                return FormateData(PackedError("Not found Lesson or Classroom!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            }

            //find max user in single lesson //use in result page
            const UserMaxScore = await this.DashboardEntity.findUserHightScoreQuiz({ classroomId, lessonId, userId });
            return FormateData({
                statistic: UserMaxScore,
                status: HTTP_STATUS_CODES.OK
            });
        } catch (error) {
            throw error;
        }
    }

}

module.exports = QuizGameService;