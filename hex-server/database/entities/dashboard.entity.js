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
            const Dashboard = await DashboardModel.findOne({ classroom: classroomId }).lean()
            .populate('classroom',['title','lessonCount','studentCount','level','category'])
            .populate('user',['username','email']);
            return Dashboard;
        } catch (error) {
            throw error;
        }
    }

    async addStudentClassroomDashboard({ classroomId, userId, username }) {
        try {
            const Dashboard = await DashboardModel.findOne({ classroom: classroomId })
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
        }
    }

    async findMaxScoreQuizStudentInClassroom({ classroomId }) {
        // console.log(classroomId);
        try {

            const DashBoards = await DashboardModel.aggregate([
                { $unwind: '$studentCompleteQuiz' },
                { $lookup: {
                    from: 'users',
                    localField: 'studentCompleteQuiz.user',
                    foreignField: '_id',
                    as: 'user',
                    //no password
                } },
                { $lookup: {
                    from: 'lessons',
                    localField: 'studentCompleteQuiz.lesson',
                    foreignField: '_id',
                    as: 'lesson',
                    //only title delete rest of data
                } },
                { $group: { 
                    _id: '$user._id',
                    //not array user
                    //to string user
                    user: {  $first:'$user.username' },
                    lesson: { $first: '$lesson.title' },
                    correctAnswer: { $max: '$studentCompleteQuiz.score' },
                    expgain: { $first: '$studentCompleteQuiz.expgain' },
                    attempt: { $first: '$studentCompleteQuiz.attempts' },
                    timeTaken: { $first: '$studentCompleteQuiz.timeTaken' },
                } }, //group by user , max score of user
                //devide by lesson
                { $sort: { maxScore: -1 } },
                { $sort: { expgain: -1 } },
                { $limit: 100 }
            ]);

            // //format object array to object
            // const aa = await DashboardModel.aggregate([
            //     { $unwind: '$studentCompleteQuiz' },
            //     { $lookup: {
            //         from: 'users',
            //         localField: 'studentCompleteQuiz.user',
            //         foreignField: '_id',
            //         as: 'user',
            //         //no password
            //     } },
            //     { $lookup: {
            //         from: 'lessons',
            //         localField: 'studentCompleteQuiz.lesson',
            //         foreignField: '_id',
            //         as: 'lesson',
            //         //only title delete rest of data
            //     } },
            //     { $group: {
            //         _id: '$user._id',
            //         //not array user
            //         //to string user
            //         user: {  $first:'$user.username' },
            //         lesson: { $first: '$lesson.title' },
            //         correctAnswer: { $max: '$studentCompleteQuiz.score' },
            //         expgain: { $first: '$studentCompleteQuiz.expgain' },
            //         attempt: { $first: '$studentCompleteQuiz.attempts' },
            //         timeTaken: { $first: '$studentCompleteQuiz.timeTaken' },
            //     } }, //group by user , max score of user
            //     //devide by lesson
            //     { $sort: { timeTaken: -1 } },
            //     { $limit: 100 }
            // ]);
            
            
           

            return DashBoards;
        }
        catch (error) {
            throw error;
        }
    }

    // async findFastestStudentInlesson({ classroomId }) {
    //     try {
    //         const DashBoard = await DashboardModel.findOne({ classroom: classroomId })
    //         .lean()
    //         .populate('user',['username','email']);

    //         DashBoard.studentCompleteQuiz.sort((a, b) => {
    //             return a.timeTaken - b.timeTaken;
    //         }
    //         , { timeTaken: 0 });
    //         // console.log(DashBoard);
           





    
}

module.exports = DashboardEntity;
