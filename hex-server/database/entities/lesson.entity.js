const LessonModel = require('../models/Lesson');

class LessonEntity {

    async getLessons({ classroomId }) {
        try {
            const Lessons = await LessonModel.find({ classroom: classroomId }).sort({ createdAt: -1 });
            return Lessons;
        }
        catch (error) {
            throw error;
        }
    }

    async createLesson({ classroomId, userId, title, description, lessonImg, lessonFile }) {
        try {
            const NewLesson = new LessonModel({
                classroom: classroomId,
                creator: userId,
                title,
                description,
                lessonImg,
                lessonFile,
            });
            const CreatedLesson = await NewLesson.save();
            return CreatedLesson;
        }
        catch (error) {
            throw error;
        }
    }


}

module.exports = LessonEntity;

