const ClassroomModel = require('../models/Classroom');

class ClassroomEntity {

    async createClassroom({ title, description, classroomImg, userId, username, level, tags, isComplete, category }) {
        try {
            // let creator = {}
            // creator.user = userId
            // creator.name = username
            
            const NewClassroom = new ClassroomModel({
                title,
                description,
                classroomImg,
                creator: {
                    user: userId,
                    name: username
                },
                category,
                level,
                tags,
                isComplete
            });
            
            const CreatedClassroom = await NewClassroom.save();
            return CreatedClassroom;
        } catch (error) {
            throw error;
        }
    }

    async updateClassroom({ classroomId, ClassroomUpdateFields }) {
        const { title, description, classroomImg, category, level, tags } = ClassroomUpdateFields
        try {
            const UpdatedClassroom = await ClassroomModel.findOneAndUpdate({ _id: classroomId }, {
                title,
                description,
                classroomImg,
                category,
                level,
                tags,
                updateAt: Date.now()
            }, { new: true });
            return UpdatedClassroom;
        } catch (error) {
            throw error;
        }
    }

    async getClassrooms({ SKIP, LIMIT, category}) {
        try {

            //get all classrooms paginated any category sort by timecreated
            if(category === "all" || category === undefined || category === null) {
                const Classrooms = await ClassroomModel.find({ isComplete : true}).sort({ createdAt: -1 }).skip(SKIP).limit(LIMIT);
                return Classrooms;
            } else {
            //get all classrooms paginated by category sort by timecreated
                const Classrooms = await ClassroomModel.find({ isComplete : true, category  }).sort({ createdAt: -1 }).skip(SKIP).limit(LIMIT);
                return Classrooms;
            }
        }
        catch (error) {
            throw error;
        }
    }

    async getClassroomById({ classroomId }) {
        try {
            const Classroom = await ClassroomModel.findById(classroomId).sort({ createdAt: -1 });
            return Classroom;
        }
        catch (error) {
            throw error;
        }
    }

    async getClassroomByUserId({ userId }) {
        try {
            const Classroom = await ClassroomModel.find({ creator: { user: userId }, isComplete : true }).sort({ createdAt: -1 });
            return Classroom;
        }
        catch (error) {
            throw error;
        }
    }

    async getOwnClassroom({ userId }) {
        try {
            const Classroom = await ClassroomModel.find({ creator: { user: userId }}).sort({ createdAt: -1 });
            return Classroom;
        }
        catch (error) {
            throw error;
        }
    }

    async getClassroomByLevel({ level }) {
        try {
            const Classroom = await ClassroomModel.find({ level }, { isComplete : true });
            return Classroom;
        }
        catch (error) {
            throw error;
        }
    }

    async getClassroomByCategory({ category }) {
        try {
            const Classroom = await ClassroomModel.find({ category });
            return Classroom;
        }
        catch (error) {
            throw error;
        }
    }

    async deleteClassroom({ classroomId }) {
        try {
            const DeletedClassroom = await ClassroomModel.deleteMany(classroomId);
            return DeletedClassroom;
        }
        catch (error) {
            throw error;
        }
    }

    async plusStudentCountClassroom({ classroomId }) {
        try {
            const Classroom = await ClassroomModel.findById(classroomId);
            // console.log("do + student count")

            Classroom.studentCount++;
            const UpdatedClassroom = await Classroom.save();
            return UpdatedClassroom;
        }
        catch (error) {
            throw error;
        }
    }

    async plusLessonCountClassroom({ classroomId }) {
        try {
            const Classroom = await ClassroomModel.findById(classroomId);
            Classroom.lessonCount = Classroom.lessonCount + 1;

            if (Classroom.lessonCount > 0) {
                Classroom.isComplete = true;
            }
            
            const UpdatedClassroom = await Classroom.save();
            return UpdatedClassroom;
        }
        catch (error) {
            throw error;
        }
    }

    async minusLessonCountClassroom({ classroomId }) {
        try {
            const Classroom = await ClassroomModel.findById(classroomId);
            Classroom.lessonCount = Classroom.lessonCount - 1;
            if (Classroom.lessonCount === 0) {
                Classroom.isComplete = false;
            }
            
            const UpdatedClassroom = await Classroom.save();
            return UpdatedClassroom;
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = ClassroomEntity