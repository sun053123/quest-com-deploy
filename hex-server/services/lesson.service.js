const { LessonEntity, ClassroomEntity } = require('../database');

const { FormateData } = require('../utils');
const HTTP_STATUS_CODES = require('../utils/HTTPConstant');

class LessonService {
    constructor() {
        this.LessonEntity = new LessonEntity();
        this.ClassroomEntity = new ClassroomEntity();
    }

    async GetLessons({ classroomId }) {
        try {
            const Lessons = await this.LessonEntity.getLessons({ classroomId });
            return Lessons;
        }
        catch (error) {
            throw error;
        }
    }

    async CreateLesson({ classroomId, userId, title, description, lessonImg, lessonFile }) {
        try {
            const Classroom = await this.ClassroomEntity.getClassroomById({ classroomId });
            if (!Classroom) {
                return FormateData({
                    error: [
                        {
                            "msg": "Classroom not found!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                });
            };

            if( userId != Classroom.creator.user.toString() ){
                return FormateData({
                    error: [
                        {
                            "msg": "You are not the creator of this classroom!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.UNAUTHORIZED,
                });
            };

            const CreatedLesson = await this.LessonEntity.createLesson({
                classroomId,
                userId,
                title,
                description,
                lessonImg,
                lessonFile,
            });
            if (!CreatedLesson) {
                return FormateData({
                    error: [
                        {
                            "msg": "Lesson not created!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
                });
            }
            await this.ClassroomEntity.plusLessonCountClassroom({classroomId,});

            return FormateData({
                lesson: CreatedLesson,
                status: HTTP_STATUS_CODES.CREATED,
                });
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = LessonService;
        