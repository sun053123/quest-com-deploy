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

    async GetQuizGame({classroomId, quizId, lessonId}) {
        // this will check limitation of quizgame in Lesson model first
        const Lesson = await this.LessonEntity.getLessonById(lessonId);
        const QuizGame = await this.QuizGameEntity.getAllQuizGame(quizId);

    }

}

module.exports = QuizGameService;