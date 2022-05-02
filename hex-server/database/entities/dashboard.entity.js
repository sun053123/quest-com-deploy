const DashboardModel = require('../models/Dashboard');

class DashboardEntity {

    async createDashboard({ classroomId, userId }) {
        try {
            const NewDashboard = new DashboardModel({
                classroom: classroomId,
                user: userId
            });
            const CreatedDashboard = await NewDashboard.save();
            return CreatedDashboard;
        } catch (error) {
            throw error;
        }
    }

    async getDashboard({ classroomId }) {
        try {
            const Dashboard = await DashboardModel.findOne({ classroom: classroomId })
            .populate('classroom',['title','lessonCount','studentCount','level','category'])
            .populate('user',['username','email']);
            return Dashboard;
        } catch (error) {
            throw error;
        }
    }

    async addStudentClassroomDashboard({ classroomId, userId, username }) {
        try {
            const Dashboard = await DashboardModel.findOne({ classroom: classroomId });
            Dashboard.studentsCheckin.push({
                user: userId,
                name: username
            });

            const UpdatedDashboard = await Dashboard.save();
            return UpdatedDashboard;
        } catch (error) {
            throw error;
        }
    }

    async findStudentClassroomDashboard({ classroomId, userId }) {
        try {
            const Dashboard = await DashboardModel.findOne({ classroom: classroomId });

            //find student in studentsCheckin
            const Student = Dashboard.studentsCheckin.find(student => student.user.toString() === userId);
            // console.log("found",Student);
            return Student;
        } catch (error) {
            throw error;
        }c
    }

    
}

module.exports = DashboardEntity;
