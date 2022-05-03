const { ClassroomEntity, DashboardEntity, LessonEntity } = require('../database');

const { FormateData } = require('../utils');
const HTTP_STATUS_CODES = require('../utils/HTTPConstant');

class ClassroomService {
    constructor() {
        this.ClassroomEntity = new ClassroomEntity();
        this.DashboardEntity = new DashboardEntity();
        this.LessonEntity = new LessonEntity();
    }

    async CreateClassroom({ title, description, userId, username, classroomImg, category, level, tags }) {

        if (tags) {
            tags = tags.split(',').map(tag => tag.trim());
        }

        try {
            const CreatedClassroom = await this.ClassroomEntity.createClassroom({
                title,
                description,
                userId,
                username,
                classroomImg,
                category,
                level,
                tags,
                isComplete: false
            });

            const CreatedDashboard = await this.DashboardEntity.createDashboard({
                classroomId: CreatedClassroom._id,
                userId,
            });

            if (!CreatedClassroom && !CreatedDashboard) {
                return FormateData({
                    error: [
                        {
                            "msg": "Classroom not created!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
                })
            }

            return FormateData({
                data: {
                    classroom: CreatedClassroom,
                    dashboard: CreatedDashboard
                },
                status: HTTP_STATUS_CODES.CREATED
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async GetClassrooms({page, category}) {
        try {
            // calcurate pagination by page
            const LIMIT = 10;
            const SKIP = (page - 1) * LIMIT;

            const Classrooms = await this.ClassroomEntity.getClassrooms({ SKIP, LIMIT, category });
            // const Classrooms = await this.ClassroomEntity.getClassrooms();
            if(Classrooms.length === 0){
                return FormateData({
                    error: [
                        {
                            "msg": "Out of index pagination!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND,
                })
            }

            return FormateData({
                classrooms: Classrooms,
                status: HTTP_STATUS_CODES.OK
            });
        } catch (error) {
            throw error;
        }
    }

    async GetSingleClassroom({ classroomId, userId, username, role }) {
        try {
            //find and Get Classroom
            const Classroom = await this.ClassroomEntity.getClassroomById({ classroomId });

            //check classroom is exist
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
            }

            //check classroom iscomplete = not (return for who not creator)
            if (Classroom.isComplete === false) {

                //check user is creator of classroom

                //if not creator return unauthorized
                if (userId !== Classroom.creator.user.toString()) {
                    return FormateData({
                        error: [
                            {
                                "msg": "You are not creator of this classroom!",
                                "location": "server"
                            }
                        ],
                        status: HTTP_STATUS_CODES.UNAUTHORIZED
                    });
                }
            }

            //in this case Classroom.iscomplete is always true ( lesson is more than 1)

            //find and Get Lessons in Classroom
            const Lessons = await this.LessonEntity.getLessons({ classroomId });

            //check user is student
            if (role === false) {

                //check user is student of classroom
                const isStudent = await this.DashboardEntity.findStudentClassroomDashboard({ classroomId, userId });

                //isStudent not found (user is first join classroom)
                if (isStudent === null || isStudent === undefined) {
                    //if there is no student then do classroom studentcount + 1 
                    const ClassroomStudentCount = await this.ClassroomEntity.plusStudentCountClassroom({ classroomId });

                    //and DashBoard add student
                    const DashboardStudent = await this.DashboardEntity.addStudentClassroomDashboard({ classroomId, userId, username });

                    return FormateData({
                        data: {
                            classroom: ClassroomStudentCount,
                            lesson: Lessons,
                            dashboard: DashboardStudent
                        },
                        status: HTTP_STATUS_CODES.OK
                    });

                } else {
                    //if user is student of classroom (already join classroom)
                    return FormateData({
                        data: {
                            classroom: Classroom,
                            lesson: Lessons,
                            dashboard: isStudent
                        },
                        status: HTTP_STATUS_CODES.OK
                    });
                }


            } else {
                //if user is teacher or creator of classroom

                //get dashboard 
                const DashBoard = await this.DashboardEntity.getDashboard({ classroomId });
                return FormateData({
                    data: {
                        classroom: Classroom,
                        lesson: Lessons,
                        dashboard: DashBoard
                    },
                    status: HTTP_STATUS_CODES.OK
                });
            }
        } catch (error) {
            throw error;
        }
    }

    async UpdateClassroom({ classroomId, title, description, userId, username, classroomImg, category, level, tags }) {

        if (tags && Array.isArray(tags) === false) {
            console.log("been here");
            tags = tags.split(',').map(tag => tag.trim());
        }

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
            }

            if (userId !== Classroom.creator.user.toString()) {
                return FormateData({
                    error: [
                        {
                            "msg": "You are not creator of this classroom!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.UNAUTHORIZED
                });
            }

            // if (title) Classroom.title = title;
            // if (description) Classroom.description = description;
            // if (classroomImg) Classroom.classroomImg = classroomImg;
            // if (category) Classroom.category = category;
            // if (level) Classroom.level = level;
            // if (tags) Classroom.tags = tags;

            let ClassroomUpdateFields = {};

            title ? ClassroomUpdateFields.title = title : Classroom.title;
            description ? ClassroomUpdateFields.description = description : Classroom.description;
            classroomImg ? ClassroomUpdateFields.classroomImg = classroomImg : Classroom.classroomImg;
            category ? ClassroomUpdateFields.category = category : Classroom.category;
            level ? ClassroomUpdateFields.level = level : Classroom.level;
            tags ? ClassroomUpdateFields.tags = tags : Classroom.tags;


            const UpdatedClassroom = await this.ClassroomEntity.updateClassroom({ classroomId, ClassroomUpdateFields });

            if (!UpdatedClassroom) {
                return FormateData({
                    error: [
                        {
                            "msg": "Classroom not updated!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
                });
            }

            return FormateData({
                classroom: UpdatedClassroom,
                status: HTTP_STATUS_CODES.OK
            });
        } catch (error) {
            throw error;
        }
    }

    async DeleteClassroom({ classroomId, userId }) {
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
            }

            if (userId !== Classroom.creator.user.toString()) {
                return FormateData({
                    error: [
                        {
                            "msg": "You are not creator of this classroom!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.UNAUTHORIZED
                });

            }

            const DeletedClassroom = await this.ClassroomEntity.deleteClassroom({ classroomId });
            if (!DeletedClassroom) {
                return FormateData({
                    error: [
                        {
                            "msg": "Classroom not deleted!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
                });
            }

            return FormateData({
                message: "Classroom deleted successfully!",
                status: HTTP_STATUS_CODES.OK
            });
        } catch (error) {
            throw error;
        }
    }

}

module.exports = ClassroomService;