const { LessonEntity, ClassroomEntity } = require('../database');

const { FormateData, PackedError } = require('../utils');
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
                return FormateData(PackedError("Classroom not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            }
            if (classroom.creator.user.toString() !== userId) {
                return FormateData(PackedError("Not Creator!", "server", "error", HTTP_STATUS_CODES.UNAUTHORIZED));
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
                return FormateData(PackedError("Classroom not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            }
            if (classroom.isComplete === false) {
                return FormateData(PackedError("Classroom not Ready!", "server", "error", HTTP_STATUS_CODES.BAD_REQUEST));
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
                return FormateData(PackedError("Classroom not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
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
                return FormateData(PackedError("Classroom not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            }

            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData(PackedError("Lesson not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            }
            const LessonNav = await this.LessonEntity.getLessonsNavigation({ classroomId });

            return FormateData({
                data: {
                    lesson: Lesson,
                    lessons: LessonNav,
                },
                status: HTTP_STATUS_CODES.OK,
            })
        }
        catch (error) {
            throw error;
        }
    }

    async CreateLesson({ classroomId, userId, title, content, lessonImg, lessonFile, isShowLessonImg }) {
        try {
            const Classroom = await this.ClassroomEntity.getClassroomById({ classroomId });
            if (!Classroom) {
                return FormateData(PackedError("Classroom not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            };

            if (userId != Classroom.creator.user.toString()) {
                return FormateData(PackedError("You are not the creator of this classroom!", "server", "error", HTTP_STATUS_CODES.UNAUTHORIZED));
            };

            const CreatedLesson = await this.LessonEntity.createLesson({
                classroomId,
                userId,
                title,
                content,
                lessonImg,
                lessonFile,
                isShowLessonImg
            });
            if (!CreatedLesson) {
                throw new Error("Lesson not created!");
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

    async UpdateLesson({ classroomId, lessonId, userId, title, content, lessonImg, lessonFile, isShowLessonImg }) {
        try {
            const isExistclassroomAndCreator = await this.checkClassroomIsExistandIsCreator({ classroomId, userId });
            if (!isExistclassroomAndCreator) {
                return FormateData(PackedError("You are not the creator of this classroom!", "server", "error", HTTP_STATUS_CODES.UNAUTHORIZED)); 
            };

            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData(PackedError("Lesson not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }

            if (userId != Lesson.creator._id.toString()) {
                return FormateData(PackedError("You are not the creator of this lesson!", "server", "error", HTTP_STATUS_CODES.UNAUTHORIZED)); 
            }

            const UpdatedLesson = await this.LessonEntity.updateLesson({
                lessonId,
                title,
                content,
                lessonImg,
                isShowLessonImg,
                lessonFile
            });
            if (!UpdatedLesson) {
                throw new Error("Can't update lesson!");
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
                return FormateData(PackedError("You are not the creator of this Classroom!", "server", "error", HTTP_STATUS_CODES.UNAUTHORIZED)); 
            };

            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData(PackedError("Lesson not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            }

            if (userId != Lesson.creator._id.toString()) {
                return FormateData(PackedError("You are not the creator of this lesson!", "server", "error", HTTP_STATUS_CODES.UNAUTHORIZED));
            }


            const DeletedLesson = await this.LessonEntity.deleteLesson({ lessonId });
            if (!DeletedLesson) {
                throw new Error("Can't delete lesson!");
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
                return FormateData(PackedError("Classroom not found! or Not Ready!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            };
            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData(PackedError("Lesson not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            }

            const LikedLesson = await this.LessonEntity.pushLikeLesson({ lessonId, userId });
            if (!LikedLesson) {
                throw new Error("Can't like lesson!");
            }

            return FormateData({
                likes: LikedLesson,
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
                return FormateData(PackedError("Classroom not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            };
            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData(PackedError("Lesson not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            }

            const CreatedComment = await this.LessonEntity.pushComment({
                lessonId,
                userId,
                comment,
            });
            if (!CreatedComment) {
                throw new Error("Can't create comment!");
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
                return FormateData(PackedError("Classroom not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            };

            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData(PackedError("Lesson not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }

            const Comment = await this.LessonEntity.findCommentLessonById({ commentId });
            if (!Comment) {
                return FormateData(PackedError("Comment not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }

            if (userId != Comment.user.toString()) {
                return FormateData(PackedError("You are not the creator of this comment!", "server", "error", HTTP_STATUS_CODES.UNAUTHORIZED)); 
            }

            const DeletedComment = await this.LessonEntity.deleteCommentLesson({ commentId });
            if (!DeletedComment) {
                throw new Error("Can't delete comment!");
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
        try {
            const isExistClassroom = this.checkClassroomIsExist({ classroomId });
            if (!isExistClassroom) {
                return FormateData(PackedError("Classroom not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }

            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData(PackedError("Lesson not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            };

            const Comment = await this.LessonEntity.findCommentLessonById({ lessonId, commentId });
            if (!Comment) {
                return FormateData(PackedError("Comment not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            };

            const LikedComment = await this.LessonEntity.pushLikeCommentLesson({ lessonId, commentId, userId });
            if (!LikedComment) {
                throw new Error("Can't like comment!");
            };

            return FormateData({
                likes: LikedComment,
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
                return FormateData(PackedError("Classroom not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            };

            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData(PackedError("Lesson not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }

            const UpdatedQuizController = await this.LessonEntity.updateQuizController({ lessonId, quizIsReady, quizIsRandom, quizLimit });
            if (!UpdatedQuizController) {
                throw new Error("Can't update quiz controller!");
            }

            return FormateData({
                lesson: UpdatedQuizController,
                status: HTTP_STATUS_CODES.OK,
            });

        } catch (error) {
            throw error;
        }
    }

    async GetCommentLesson({ lessonId, classroomId, userId, page }) {
        try {
            const isExistClassroom = this.checkClassroomIsExist({ classroomId });
            if (!isExistClassroom) {
                return FormateData(PackedError("Classroom not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }
            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData(PackedError("Lesson not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }

            // pagination comment
            if (page <= 0) {
                page = 1;
            }

            const LIMIT = 10;
            const SKIP = (page - 1) * LIMIT;

            const Comments = await this.LessonEntity.getCommentsLesson({ lessonId, LIMIT, SKIP });
            if (!Comments) {
                throw new Error("Can't get comments!");
            }

            return FormateData({
                comments: Comments,
                status: HTTP_STATUS_CODES.OK,
            });
        } catch (error) {
            throw error;
        }
    }

    //Upload Pdffile
    async UploadFilePDF({ classroomId, lessonId, userId, pdfFile }) {
        try {
            const isExistClassroom = this.checkClassroomIsExistandIsCreator({ classroomId, userId });
            if (!isExistClassroom) {
                return FormateData(PackedError("Classroom not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }

            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData(PackedError("Lesson not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }
            const UpdatedLessonPDF = await this.LessonEntity.uploadLessonPDF({ lessonId, pdfFile });

            return FormateData({
                pdffile: UpdatedLessonPDF,
                status: HTTP_STATUS_CODES.OK,
            });
        } catch (error) {
            throw error;
        }
    }

    //UpdatePDF file
    async UpdateFilePDF({ classroomId, lessonId, userId, pdfFile }) {
        try {

            const isExistClassroom = this.checkClassroomIsExistandIsCreator({ classroomId, userId });
            if (!isExistClassroom) {
                return FormateData(PackedError("Calssroom not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }

            const Lesson = await this.LessonEntity.getLessonById({ lessonId });
            if (!Lesson) {
                return FormateData(PackedError("Lesson not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND)); 
            }

            const UpdatedLessonPDF = await this.LessonEntity.updateLessonPDF({ lessonId, pdfFile });
            if (!UpdatedLessonPDF) {
                throw new Error("Can't update pdf file!");
            }

            return FormateData({
                pdffile: UpdatedLessonPDF,
                status: HTTP_STATUS_CODES.OK,
            });
        } catch (error) {
            throw error;
        }
    }

};

module.exports = LessonService;
