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
    
    async checkClassroomandLessonIsExistAndCreator({ classroomId, lessonId, userId }) {

        try {
            const classroom = await this.ClassroomEntity.getClassroomById({ classroomId });
            if (!classroom) {
                console.log("classroom not found");
                return false
            }
            const lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!lesson) {
                console.log("lesson not found");
                return false
            }
            if(userId !== lesson.creator.id.toString()) {
                console.log("user not creator");
                return false
            }

            return true
        } catch (error) {
            throw error;
        }
    }

    async GetAllQuizzes({ classroomId, lessonId, userId }) {

        try {
            //check classroom and lesson is exist
            const isExist = await this.checkClassroomandLessonIsExistAndCreator({ classroomId, lessonId, userId });
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
            
            // const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            // if (userId !== Lesson.creator.user.toString()) {
            //     return FormateData({
            //         status: HTTP_STATUS_CODES.FORBIDDEN,
            //         error: [
            //             {
            //                 "msg": "You are not creator of this lesson!",
            //                 "location": "server"
            //             }
            //         ]
            //     });
            // }

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
            const isExist = await this.checkClassroomandLessonIsExistAndCreator({ classroomId, lessonId, userId });
            if (!isExist) {
                return FormateData({
                    error: [
                        {
                            "msg": "Quiz control not found!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND
                });
            };
            
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
            };

            const Quiz = await this.QuizEntity.getQuizById({ quizId });
            return FormateData({
                quiz: Quiz,
                status: HTTP_STATUS_CODES.OK
            });

        } catch (error) {
            throw error;
        }
    }

    async CreateNewQuiz({ classroomId, lessonId, userId, question, questionImg, options, answer, explanation, type }) {
        
        try {
            //check classroom and lesson is exist
            const isExist = await this.checkClassroomandLessonIsExistAndCreator({ classroomId, lessonId, userId });
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
            };

            const NewQuiz = await this.QuizEntity.createQuiz({
                lessonId, userId, question, questionImg, options, answer, explanation, type
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
            };

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
            };

            return FormateData({
                quiz: NewQuiz,
                status: HTTP_STATUS_CODES.OK
            });

        } catch (error) {
            throw error;
        };
    };

    async updateQuiz({ classroomId, lessonId, quizId, userId, title, description, quizImg, quizFile }) {

        try {
            //check classroom and lesson is exist
            const isExist = await this.checkClassroomandLessonIsExistAndCreator({ classroomId, lessonId, userId });
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
            };

            return FormateData({
                quiz: Quiz,
                status: HTTP_STATUS_CODES.OK
            });

        } catch (error) {
            throw error;
        };
    };

    async DeleteQuiz({ classroomId, lessonId, quizId, userId }) {

        try {
            //check classroom and lesson is exist
            const isExist = await this.checkClassroomandLessonIsExistAndCreator({ classroomId, lessonId, userId });
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
        };
    };

};

module.exports = QuizService;