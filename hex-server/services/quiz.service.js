const { LessonEntity, ClassroomEntity, QuizEntity } = require('../database');

const { FormateData } = require('../utils');
const HTTP_STATUS_CODES = require('../utils/HTTPConstant');

class QuizService {
    constructor() {
        this.LessonEntity = new LessonEntity();
        this.ClassroomEntity = new ClassroomEntity();
        this.QuizEntity = new QuizEntity();
    }

    //internal function
    async checkClassroomandLessonIsExist({ classroomId, lessonId }) {
        try {
            const classroom = await this.ClassroomEntity.getClassroomById({ classroomId });
            if (!classroom) {
                return false
            }
            const lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!lesson) {
                return false
            }
            return true
        } catch (error) {
            throw error;
        }
    }

    async getQuizes({ classroomId, lessonId, userId }) {
        try {
            //check classroom and lesson is exist
            const isExist = await checkClassroomandLessonIsExist({ classroomId, lessonId });
            if (!isExist) {
                return FormateData({
                    error: [
                        {
                            "msg": "Classroom or Lesson not found!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND
                });
            }
            
            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (userId !== Lesson.creator.user.toString()) {
                return FormateData({
                    status: HTTP_STATUS_CODES.FORBIDDEN,
                    error: [
                        {
                            "msg": "You are not creator of this lesson!",
                            "location": "server"
                        }
                    ]
                });
            }

            const Quizes = await this.QuizEntity.getQuizes({ lessonId });
            return FormateData({
                quiz: Quizes,
                status: HTTP_STATUS_CODES.OK
            });

        } catch (error) {
            throw error;
        }
    }

    async GetSingleQuiz({ classroomId, lessonId, quizId, userId }) {
        
        try {
            //check classroom and lesson is exist
            const isExist = await checkClassroomandLessonIsExist({ classroomId, lessonId });
            if (!isExist) {
                return FormateData({
                    error: [
                        {
                            "msg": "Classroom or Lesson not found!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND
                });
            }
            
            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (userId !== Lesson.creator.user.toString()) {
                return FormateData({
                    status: HTTP_STATUS_CODES.FORBIDDEN,
                    error: [
                        {
                            "msg": "You are not creator of this lesson!",
                            "location": "server"
                        }
                    ]
                });
            }

            const Quiz = await this.QuizEntity.getQuizById({ quizId });
            return FormateData({
                quiz: Quiz,
                status: HTTP_STATUS_CODES.OK
            });

        } catch (error) {
            throw error;
        }
    }

    async CreateNewQuiz({ classroomId, lessonId, userId, title, description, quizImg, quizFile }) {
        
        try {
            //check classroom and lesson is exist
            const isExist = await checkClassroomandLessonIsExist({ classroomId, lessonId });
            if (!isExist) {
                return FormateData({
                    error: [
                        {
                            "msg": "Classroom or Lesson not found!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND
                });
            }
            
            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (userId !== Lesson.creator.user.toString()) {
                return FormateData({
                    status: HTTP_STATUS_CODES.FORBIDDEN,
                    error: [
                        {
                            "msg": "You are not creator of this lesson!",
                            "location": "server"
                        }
                    ]
                });
            }

            const NewQuiz = await this.QuizEntity.createQuiz({
                lessonId,
                title,
                description,
                quizImg,
                quizFile,
            });
            if(!NewQuiz) {
                return FormateData({
                    error: [
                        {
                            "msg": "Cannot create quiz!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE
                });
            }

            // update quizcount on lesson model // and check if is quiz ready?
            const operation = true
            const UpdatedLessonCount = await this.LessonEntity.calculateQuizCountLesson({ lessonId, operation });
            if (!UpdatedLessonCount) {
                return FormateData({
                    error: [
                        {
                            "msg": "Cannot update lesson quiz count!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE
                });
            }

            return FormateData({
                quiz: NewQuiz,
                status: HTTP_STATUS_CODES.OK
            });

        } catch (error) {
            throw error;
        }
    }

    async updateQuiz({ classroomId, lessonId, quizId, userId, title, description, quizImg, quizFile }) {

        try {
            //check classroom and lesson is exist
            const isExist = await checkClassroomandLessonIsExist({ classroomId, lessonId });
            if (!isExist) {
                return FormateData({
                    error: [
                        {
                            "msg": "Classroom or Lesson not found!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND
                });
            }
            
            // check permission to update quiz
            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (userId !== Lesson.creator.user.toString()) {
                return FormateData({
                    status: HTTP_STATUS_CODES.FORBIDDEN,
                    error: [
                        {
                            "msg": "You are not creator of this lesson!",
                            "location": "server"
                        }
                    ]
                });
            }

            const Quiz = await this.QuizEntity.updateQuiz({
                quizId,
                title,
                description,
                quizImg,
                quizFile,
            });
            if(!Quiz) {
                return FormateData({
                    error: [
                        {
                            "msg": "Cannot update quiz!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE
                });
            }
            return FormateData({
                quiz: Quiz,
                status: HTTP_STATUS_CODES.OK
            });

        } catch (error) {
            throw error;
        }
    }

    async DeleteQuiz({ classroomId, lessonId, quizId, userId }) {

        try {
            //check classroom and lesson is exist
            const isExist = await checkClassroomandLessonIsExist({ classroomId, lessonId });
            if (!isExist) {
                return FormateData({
                    error: [
                        {
                            "msg": "Classroom or Lesson not found!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND
                });
            }
            
            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (userId !== Lesson.creator.user.toString()) {
                return FormateData({
                    status: HTTP_STATUS_CODES.FORBIDDEN,
                    error: [
                        {
                            "msg": "You are not creator of this lesson!",
                            "location": "server"
                        }
                    ]
                });
            }

            const Quiz = await this.QuizEntity.deleteQuiz({ quizId });
            if(!Quiz) {
                return FormateData({
                    error: [
                        {
                            "msg": "Cannot delete quiz!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE
                });
            };
            // update quizcount on lesson model // and check if is quiz ready?
            const operation = false
            const UpdatedLessonCount = await this.LessonEntity.calculateQuizCountLesson({ lessonId, operation });
            if (!UpdatedLessonCount) {
                return FormateData({
                    error: [
                        {
                            "msg": "Cannot update lesson quiz count!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE
                });
            };

            return FormateData({
                message: "Quiz deleted successfully!",
                status: HTTP_STATUS_CODES.OK
            });

        } catch (error) {
            throw error;
        }
    }

}

module.exports = QuizService;