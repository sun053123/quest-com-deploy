const { LessonEntity, ClassroomEntity, QuizEntity } = require('../database');

const { FormateData, PackedError } = require('../utils');
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
            const classroom = await this.ClassroomEntity.checkClassroomExist({ classroomId });
            if (!classroom) {
                return FormateData(PackedError("Classroom not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }
            const lesson = await this.LessonEntity.checkLessonExist({ lessonId });
            if (!lesson) {
                return FormateData(PackedError("Lesson not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }
            if(userId !== lesson.creator._id.toString()) {
                return FormateData(PackedError("Not a Creator!", "server", "error", HTTP_STATUS_CODES.UNAUTHORIZED)); 
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
                return FormateData(PackedError("Quiz not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }
            
            const Quizzes = await this.QuizEntity.getQuizzes({ lessonId });
            const QuizController = await this.QuizEntity.getQuizController({ lessonId });

            return FormateData({
                quiz: Quizzes,
                quizcontroller: QuizController,
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
                return FormateData(PackedError("Quiz not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            };
            
            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (userId !== Lesson.creator._id.toString()) {
                return FormateData(PackedError("Not a Creator", "server", "error", HTTP_STATUS_CODES.UNAUTHORIZED)); 
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
                return FormateData(PackedError("Classroom not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            };

            //check options array doesn't have undefined // if have undefined delete undefined
            if (options.length > 0) {
                //delete undefined and "" from array
                options = options.filter(option => option !== undefined && option !== "");
                if (options.length <2) {
                    return FormateData(PackedError("Options must be more than 2!", "server", "warning", HTTP_STATUS_CODES.BAD_REQUEST)); 
                }
            }


            const checkArray = arr => arr.every((item) => item === arr[0]); //check options is same
            console.log(checkArray(options));

            if (checkArray(options) === true) {
                return FormateData(PackedError("Options must be unique! or not Empty!", "server", "warning", HTTP_STATUS_CODES.BAD_REQUEST)); 
            }

            const NewQuiz = await this.QuizEntity.createQuiz({
                lessonId, userId, question, questionImg, options, answer, explanation, type
            });
            if(!NewQuiz) {
                throw new Error("Quiz not created!");
            };

            // update quizcount on lesson model // and check if is quiz ready?
            const operation = true
            const UpdatedLessonCount = await this.LessonEntity.calculateQuizCountLesson({ lessonId, operation });
            if (!UpdatedLessonCount) {
                throw new Error("Quiz not created!");
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
                return FormateData(PackedError("Classroom or Lesson not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }
            
            // check permission to update quiz
            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (userId !== Lesson.creator.user.toString()) {
                return FormateData(PackedError("Not a Creator!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }

            const Quiz = await this.QuizEntity.updateQuiz({
                quizId,
                title,
                description,
                quizImg,
                quizFile,
            });

            if(!Quiz) {
                throw new Error("Quiz not updated!");
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
                return FormateData(PackedError("Quiz not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }

            const Quiz = await this.QuizEntity.deleteQuiz({ quizId });
            if(!Quiz) {
                throw new Error("Quiz not deleted!");
            };
            // update quizcount on lesson model // and check if is quiz ready?
            const operation = false
            const UpdatedLessonCount = await this.LessonEntity.calculateQuizCountLesson({ lessonId, operation });
            if (!UpdatedLessonCount) {
                throw new Error("Quiz not deleted!");
            };

            return FormateData({
                message: "Quiz deleted successfully!",
                status: HTTP_STATUS_CODES.OK
            });

        } catch (error) {
            throw error;
        };
    };

    async UpdateQuizControl({ classroomId, lessonId, quizId, quizLimit, quizIsRandom, userId }) {
            
            try {
                //check classroom and lesson is exist
                const isExist = await this.checkClassroomandLessonIsExistAndCreator({ classroomId, lessonId, userId });
                if (!isExist) {
                    return FormateData(PackedError("Quiz not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
                }

                const Quiz = await this.QuizEntity.updateQuizControl({ lessonId, quizLimit, quizIsRandom });
                if(!Quiz) {
                    throw new Error("Quiz not updated!");
                }

                return FormateData({
                    quizcontroller: Quiz,
                    status: HTTP_STATUS_CODES.OK
                });
        } catch (error) {
            throw error;
        }
    }

};

module.exports = QuizService;