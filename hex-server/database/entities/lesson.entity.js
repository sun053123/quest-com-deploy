const LessonModel = require('../models/Lesson');

class LessonEntity {

    async getLessons({ classroomId }) {
        try {
            const Lessons = await LessonModel.find({ classroom: classroomId })
                .select('-comments -__v' -'content' -'lessonImg' -'lessonFile' -'likes')
                .where('deletedAt').equals(null)
                .lean()
                .populate('creator',['username','email'])
                .populate('classroom',['title'])
                .sort({ createdAt: 1 });

            
            return Lessons;
        }
        catch (error) {
            throw error;
        }
    }

    async getLessonById({ lessonId }) {
        try {
            const Lesson = await LessonModel.findById(lessonId)
            .where('deletedAt').equals(null)
            .lean()
            .populate('creator',['username','email','_id'])
            .populate('classroom',['title','content','category']);
            return Lesson;
        }
        catch (error) {
            throw error;
        }
    }

    async getLessonsNavigation({ classroomId}) {
        try {
            const Lessons = await LessonModel.find({ classroom: classroomId })
                .select('-comments -__v -content -lessonImg -lessonFile -likes')
                .lean()
                .where('deletedAt').equals(null)
                .sort({ createdAt: 1 });

            return Lessons;
        }
        catch (error) {
            throw error;
        }
    }

    async createLesson({ classroomId, userId, title, content, lessonImg, lessonFile, isShowLessonImg }) {
        try {
            const NewLesson = new LessonModel({
                classroom: classroomId,
                creator: userId,
                title,
                content,
                lessonImg,
                lessonFile,
                isShowLessonImg,
            });
            const CreatedLesson = await NewLesson.save()
            return CreatedLesson;
        }
        catch (error) {
            throw error;
        }
    }

    async updateLesson({ lessonId, title, content, lessonImg, lessonFile, isShowLessonImg }) {
        try {
            const UpdatedLesson = await LessonModel.findByIdAndUpdate(lessonId, {
                title,
                content,
                lessonImg,
                lessonFile,
                isShowLessonImg,
                updateAt: Date.now(),
            }, { new: true });
          
            return UpdatedLesson;
        }
        catch (error) {
            throw error;
        }
    }

    async deleteLesson({ lessonId }) {
        try {
            const DeletedLesson = await LessonModel.findByIdAndUpdate(lessonId, {
                deletedAt: Date.now(),
            }, { new: true });

            return DeletedLesson;
        }
        catch (error) {
            throw error;
        }
    }

    async pushLikeLesson({ lessonId, userId }) {
        try {
            const Lesson = await LessonModel.findById(lessonId);
            // check if user already liked this lesson
            if (Lesson.likes.find(like => like.user.toString() === userId)) {
                // Lesson Already liked, unlike it
                Lesson.likes = Lesson.likes.filter(like => like.user.toString() !== userId);
                Lesson.likeCount--;
            } else {
                // Lesson not liked, like it
                Lesson.likes.push({ user: userId });
                Lesson.likeCount++;
            }

            const UpdatedLesson = await Lesson.save();
            return UpdatedLesson.likes;
        }

        catch (error) {
            throw error;
        }
    }

    async findCommentLessonById ({ lessonId, commentId }) {
        try {
            
            const Lesson = await LessonModel.findById(lessonId);

            // find Lesson Comment by find 
            // console.log("found ",Lesson.comments.find(comment => comment._id.toString() === commentId)) 
            const Comment = Lesson.comments.find(comment => comment._id.toString() === commentId);
            return Comment;
        }
        catch (error) {
            throw error;
        }
    }

    async pushComment ({ lessonId, userId, username, comment }) {
        try {
            const Lesson = await LessonModel.findById(lessonId);
            Lesson.comments.push({ user: userId, username, body:comment });

            const UpdatedLesson = await Lesson.save();
            return UpdatedLesson.comments;
        }

        catch (error) {
            throw error;
        }
    }

    async deleteComment ({ lessonId, commentId }) {
        try {
            const Lesson = await LessonModel.findById(lessonId);
            Lesson.comments.id(commentId).delete();

            const UpdatedLesson = await Lesson.save();
            return UpdatedLesson;
        }

        catch (error) {
            throw error;
        }
    }

    async pushLikeCommentLesson ({ lessonId, commentId, userId }) {
        try {
            const Lesson = await LessonModel.findById(lessonId);

            // console.log("found ",Lesson.comments.find(comment => comment._id.toString() === commentId)) 

            const Comment = Lesson.comments.find(comment => comment._id.toString() === commentId);
            // check if user already liked this comment
            if (Comment.likes.find(like => like.user.toString() === userId)) {
                // console.log("already like comment, dislike it")
                // Comment Already liked, unlike it
                Comment.likes = Comment.likes.filter(like => like.user.toString() !== userId);
                Comment.likeCount--;
            } else {
                // console.log("not like comment, like it")
                // Comment not liked, like it
                Comment.likes.push({ user: userId });
                Comment.likeCount++;
            }
            const UpdatedLessonComment = await Lesson.save();
            return UpdatedLessonComment.comments;
        }catch (error) {
            throw error;
        }
    }

    async calculateQuizCountLesson({ lessonId, operation }) {
        try {
            const Lesson = await LessonModel.findById(lessonId)
            // if(operation === true){
            //     Lesson.quizCount = Lesson.quizCount + 1;
            // }else{
            //     Lesson.quizCount = Lesson.quizCount - 1;
            // }

            // if (Lesson.quizCount > 0) {
            //     Lesson.quizIsReday = true;
            // } else {
            //     Lesson.quizIsReday = false;
            // }

            operation === true ? Lesson.quizCount = Lesson.quizCount + 1 : Lesson.quizCount = Lesson.quizCount - 1;
            Lesson.quizCount > 4 ? Lesson.quizIsReady = true : Lesson.quizIsReady = false;
            //if quiz count > 4, quiz is ready

            const UpdatedLesson = await Lesson.save();
            return UpdatedLesson;

        }
        catch (error) {
            throw error;
        }
    }

    async updateLessonQuizCtroller({ LessonId, quizIsReady, quizIsRandom, quizLimit }) {
        try {

            const Lesson = await LessonModel.findById(LessonId).lean();
            if(quizIsReady) Lesson.quizIsReady = quizIsReady;
            if(quizIsRandom) Lesson.quizIsRandom = quizIsRandom;
            if(quizLimit) Lesson.quizLimit = quizLimit;

            const UpdatedLesson = await Lesson.save();
            return UpdatedLesson;
            
        }
        catch (error) {
            throw error;
        }
    }

    async getCommentsLesson({ lessonId, SKIP, LIMIT }) {
        try {
            
            const Lesson = await LessonModel.findById(lessonId).lean();
            return  Lesson.comments
        }
        catch (error) {
            throw error;
        }
    }
            

    async uploadLessonPDF({ lessonId, pdfFile }) {
        try {
            const Lesson = await LessonModel.findByIdAndUpdate(lessonId, {
                lessonFile: pdfFile,
                updateAt: Date.now(),
            }, { new: true });
            return Lesson;
        }
        catch (error) {
            throw error;
        }
    }

    async updateLessonPDF({ lessonId, pdfFile }) {
        try {
            const Lesson = await LessonModel.findByIdAndUpdate(lessonId, {
                lessonFile: pdfFile,
                updateAt: Date.now(),
            }, { new: true });
            return Lesson;
        }
        catch (error) {
            throw error;
        }
    }

    async checkLessonExist({ lessonId }) {
        try {
            const Lesson = await LessonModel.findById(lessonId);
            if (!Lesson || Lesson === null) {
               return false;
            }
            return true;
        }
        catch (error) {
            throw error;
        }
    }
            
}

module.exports = LessonEntity;

