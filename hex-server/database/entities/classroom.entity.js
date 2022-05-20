const ClassroomModel = require('../models/Classroom');

class ClassroomEntity {

    async createClassroom({ title, description, content, classroomImg, userId, username, level, tags, isComplete, category }) {
        try {
            // let creator = {}
            // creator.user = userId
            // creator.name = username
            
            const NewClassroom = new ClassroomModel({
                title,
                description,
                content,
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
        const { title, description, classroomImg, category, level, tags ,content } = ClassroomUpdateFields
        try {
            const UpdatedClassroom = await ClassroomModel.findOneAndUpdate({ _id: classroomId }, {
                title,
                description,
                content,
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
            if (category === "all" || category === undefined || category === null) {
                const Classrooms = await ClassroomModel.find()
                .where('isComplete').equals(true)
                .where('deletedAt').equals(null)
                .select('-__v -classroomImg') //forspeedup query
                .lean()
                .sort({ createdAt: -1 }).skip(SKIP).limit(LIMIT);

                const Count = await ClassroomModel.countDocuments({ isComplete: true, deletedAt: null });
                if (Count === 0) {
                    return { Classrooms, Total: 0 };
                } else {
                    const Total = Count / LIMIT;
                    return { Classrooms, Total };
                }
            } else {
                //get all classrooms paginated by category sort by timecreated
                const Classrooms = await ClassroomModel.find({ category })
                .where('isComplete').equals(true)
                .where('deletedAt').equals(null)
                .select('-__v -classroomImg') //forspeedup query
                .lean()
                .sort({ createdAt: -1 }).skip(SKIP).limit(LIMIT);
                const Count = await ClassroomModel.countDocuments({ isComplete: true, category, deletedAt: null });
                if (Count === 0) {
                    return { Classrooms, Total: 0 };
                } else {
                    const Total = Count / LIMIT;
                    return { Classrooms, Total };
                }
            }
        }
        catch (error) {
            throw error;
        }
    }

    async getClassroomById({ classroomId }) {
        try {
            const Classroom = await ClassroomModel.findById(classroomId)
            .where('deletedAt').equals(null)
            .lean()
            .sort({ createdAt: -1 });
            return Classroom;
        }
        catch (error) {
            throw error;
        }
    }

    async getClassroomByUserId({ userId }) {
        try {
            const Classroom = await ClassroomModel.find({ creator: { user: userId }, isComplete : true, })
            .where('deletedAt').equals(null)
            .lean()
            .sort({ createdAt: -1 });
            return Classroom;
        }
        catch (error) {
            throw error;
        }
    }

    async getOwnClassroom({ userId }) {
        try {
            const Classroom = await ClassroomModel.find({ creator: { user: userId }})
            .where('deletedAt').equals(null)
            .lean()
            .sort({ createdAt: -1 });
            return Classroom;
        }
        catch (error) {
            throw error;
        }
    }

    async getClassroomByKeyWords({ keywords }) {
        try {
            //search by keywords
            const Classrooms = await ClassroomModel.find({
                $text: { $search: keywords }
            })
            .where('deletedAt').equals(null)
            .select('-__v -classroomImg') //forspeedup query
            .lean()
            .sort({ createdAt: -1 });

            return Classrooms;
        }
        catch (error) {
            throw error;
        }
    }

    async getClassroomByCategory({ category }) {
        try {
            const Classroom = await ClassroomModel.find({ category })
            .where('deletedAt').equals(null)
            .lean()
            .sort({ createdAt: -1 });

            return Classroom;
        }
        catch (error) {
            throw error;
        }
    }

    async deleteClassroom({ classroomId }) {
        try {
            //remove classroom
            const DeletedClassroom = await ClassroomModel.findByIdAndUpdate(classroomId, {
                deletedAt: Date.now()
            }, { new: true });

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

    async checkClassroomExist({ classroomId }) {
        try {
            const Classroom = await ClassroomModel.findById(classroomId);
            if (Classroom === null) {
                return false;
            }
            return true;
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = ClassroomEntity