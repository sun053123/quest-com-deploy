const { LessonEntity, ClassroomEntity } = require('../database');

const { FormateData } = require('../utils');
const HTTP_STATUS_CODES = require('../utils/HTTPConstant');

class LessonService {
    constructor() {
        this.LessonEntity = new LessonEntity();
        this.ClassroomEntity = new ClassroomEntity();
    }

    //interal function
    //TeacherCreator Operation Only
    async checkClassroomIsExistandIsCreator({ classroomId, userId }) {
        try {
            const classroom = await this.ClassroomEntity.getClassroomById({ classroomId });

            if (!classroom) {
                return false;
            }
            if (classroom.creator.user.toString() !== userId) {
                return false;
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    //internal function
    //Teacher, Student (not creator) Operation
    async checkClassroomIsExistorIsComplete({ classroomId }) {
        try {
            const classroom = await this.ClassroomEntity.getClassroomById({ classroomId });
            if (!classroom) {
                return false
            }
            if (classroom.isComplete === false) {
                return false
            }
            return true
        } catch (error) {
            throw error;
        }
    }

    async checkClassroomIsExist({ classroomId }) {
        try {
            const classroom = await this.ClassroomEntity.getClassroomById({ classroomId });
            if (!classroom) {
                return false
            }
            return true
        } catch (error) {
            throw error;
        }
    }

    async GetLessons({ classroomId }) {
        try {
            const Lessons = await this.LessonEntity.getLessons({ classroomId });
            return FormateData({
                lessons: Lessons,
                status: HTTP_STATUS_CODES.OK,
            });
        }
        catch (error) {
            throw error;
        }
    }

    async GetSingleLesson({ lessonId, classroomId }) {
        try {
            const isExistClassroom = this.checkClassroomIsExist({ classroomId });
            if (!isExistClassroom) {
                return FormateData({
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                    error: [
                        {
                            "msg": "Classroom not found! or Not Ready!",
                            "location": "server",
                            "type": "error"
                        }
                    ]
                });
            }

            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData({
                    error: [
                        {
                            "msg": "Lesson not found",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                })
            }

            return FormateData({
                lesson: Lesson,
                status: HTTP_STATUS_CODES.OK,
            })
        }
        catch (error) {
            throw error;
        }
    }

    async CreateLesson({ classroomId, userId, title, content, lessonImg, lessonFile }) {
        try {
            const Classroom = await this.ClassroomEntity.getClassroomById({ classroomId });
            if (!Classroom) {
                return FormateData({
                    error: [
                        {
                            "msg": "Classroom not found!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                });
            };

            if (userId != Classroom.creator.user.toString()) {
                return FormateData({
                    error: [
                        {
                            "msg": "You are not the creator of this classroom!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.UNAUTHORIZED,
                });
            };

            const CreatedLesson = await this.LessonEntity.createLesson({
                classroomId,
                userId,
                title,
                content,
                lessonImg,
                lessonFile,
            });
            if (!CreatedLesson) {
                return FormateData({
                    error: [
                        {
                            "msg": "Lesson not created!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
                });
            }
            await this.ClassroomEntity.plusLessonCountClassroom({ classroomId, });

            return FormateData({
                lesson: CreatedLesson,
                status: HTTP_STATUS_CODES.CREATED,
            });
        }
        catch (error) {
            throw error;
        }
    }

    async UpdateLesson({ classroomId, lessonId, userId, title, content, lessonImg }) {
        try {
            const isExistclassroomAndCreator = await this.checkClassroomIsExistandIsCreator({ classroomId, userId });
            if (!isExistclassroomAndCreator) {
                return FormateData({
                    error: [
                        {
                            "msg": "You are not the creator of this classroom!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.UNAUTHORIZED,
                });
            };

            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData({
                    error: [
                        {
                            "msg": "Lesson not found!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                });
            }

            if (userId != Lesson.creator.user.toString()) {
                return FormateData({
                    error: [
                        {
                            "msg": "You are not the creator of this lesson!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.UNAUTHORIZED,
                });
            }

            const UpdatedLesson = await this.LessonEntity.updateLesson({
                lessonId,
                title,
                content,
                lessonImg,
            });
            if (!UpdatedLesson) {
                return FormateData({
                    error: [
                        {
                            "msg": "Lesson not updated!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
                });
            }

            return FormateData({
                lesson: UpdatedLesson,
                status: HTTP_STATUS_CODES.OK,
            });
        } catch (error) {
            throw error;
        }
    }

    async DeleteLesson({ lessonId, classroomId, userId }) {
        try {
            const isExistclassroomAndCreator = await this.checkClassroomIsExistandIsCreator({ classroomId, userId });
            if (!isExistclassroomAndCreator) {
                return FormateData({
                    error: [
                        {
                            "msg": "You are not the creator of this classroom!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.UNAUTHORIZED,
                });
            };

            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData({
                    error: [
                        {
                            "msg": "Lesson not found!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                });
            }

            if (userId != Lesson.creator.user.toString()) {
                return FormateData({
                    error: [
                        {
                            "msg": "You are not the creator of this lesson!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.UNAUTHORIZED,
                });
            }


            const DeletedLesson = await this.LessonEntity.deleteLesson({ lessonId });
            if (!DeletedLesson) {
                return FormateData({
                    error: [
                        {
                            "msg": "Lesson not deleted!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
                });
            }

            await this.ClassroomEntity.minusLessonCountClassroom({ classroomId });

            return FormateData({
                lesson: DeletedLesson,
                status: HTTP_STATUS_CODES.OK,
            });
        } catch (error) {
            throw error;
        }
    }

    async LikeLesson({ classroomId, lessonId, userId }) {
        try {
            const isExistClassroom = this.checkClassroomIsExist({ classroomId });
            if (!isExistClassroom) {
                return FormateData({
                    error: [
                        {
                            "msg": "Classroom not found! or Not Ready!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                });
            };
            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData({
                    error: [
                        {
                            "msg": "Lesson not found!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                });
            }

            const LikedLesson = await this.LessonEntity.pushLikeLesson({ lessonId, userId });

            return FormateData({
                lesson: LikedLesson,
                status: HTTP_STATUS_CODES.OK,
            });
        }
        catch (error) {
            throw error;
        }
    }

    async CreateCommentLesson({ classroomId, lessonId, userId, username, comment }) {
        try {
            const isExistClassroom = this.checkClassroomIsExist({ classroomId });
            if (!isExistClassroom) {
                return FormateData({
                    error: [
                        {
                            "msg": "Classroom not found!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                });
            };
            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData({
                    error: [
                        {
                            "msg": "Lesson not found!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                });
            }

            const CreatedComment = await this.LessonEntity.pushComment({
                lessonId,
                userId,
                username,
                comment,
            });
            if (!CreatedComment) {
                return FormateData({
                    error: [
                        {
                            "msg": "Comment not created!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
                });
            }

            return FormateData({
                lesson: CreatedComment,
                status: HTTP_STATUS_CODES.CREATED,
            });
        } catch (error) {
            throw error;
        }
    }

    async DeleteCommentLesson({ commentId, lessonId, classroomId, userId }) {
        try {
            const isExistClassroom = this.checkClassroomIsExist({ classroomId });
            if (!isExistClassroom) {
                return FormateData({
                    error: [
                        {
                            "msg": "Classroom not found!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                });
            };
            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData({
                    error: [
                        {
                            "msg": "Lesson not found!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                });
            }

            const Comment = await this.LessonEntity.findCommentLessonById({ commentId });
            if (!Comment) {
                return FormateData({
                    error: [
                        {
                            "msg": "Comment not found!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                });
            }

            if (userId != Comment.user.toString()) {
                return FormateData({
                    error: [
                        {
                            "msg": "You are not the creator of this comment!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.UNAUTHORIZED,
                });
            }

            const DeletedComment = await this.LessonEntity.deleteCommentLesson({ commentId });
            if (!DeletedComment) {
                return FormateData({
                    error: [
                        {
                            "msg": "Comment not deleted!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
                });
            }

            return FormateData({
                message: "Comment deleted!",
                status: HTTP_STATUS_CODES.OK,
            });
        } catch (error) {
            throw error;
        }
    }

    async LikeCommentLesson({ commentId, lessonId, classroomId, userId }) {
        try{
            const isExistClassroom = this.checkClassroomIsExist({ classroomId });
            if (!isExistClassroom) {
                return FormateData({
                    error: [
                        {
                            "msg": "Classroom not found!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                });
            }

            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData({
                    error: [
                        {
                            "msg": "Lesson not found!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                });
            };

            const Comment = await this.LessonEntity.findCommentLessonById({ lessonId, commentId });
            if (!Comment) {
                return FormateData({
                    error: [
                        {
                            "msg": "Comment not found!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                });
            };

            const LikedComment = await this.LessonEntity.pushLikeCommentLesson({ lessonId, commentId, userId });

            return FormateData({
                comment: LikedComment,
                status: HTTP_STATUS_CODES.OK,
            });
        }
        catch (error) {
            throw error;
        };
    };

    async EditQuizController({ classroomId, lessonId, userId }) {

        try {
         const isExistClassroom = this.checkClassroomIsExistandIsCreator({ classroomId, userId });
            if (!isExistClassroom) {
                return FormateData({
                    error: [
                        {
                            "msg": "Classroom not found!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                });
            }
            
            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData({
                    error: [
                        {
                            "msg": "Lesson not found!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                });
            }

            const UpdatedQuizController = await this.LessonEntity.updateQuizController({ LessonId, quizIsReday, quizIsRandom, quizLimit });
            if (!UpdatedQuizController) {
                return FormateData({
                    error: [
                        {
                            "msg": "QuizController not updated!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
                });
            }

            return FormateData({
                lesson: UpdatedQuizController,
                status: HTTP_STATUS_CODES.OK,
            });
            
        } catch (error) {
            throw error;
        }
    }   


};

module.exports = LessonService;
