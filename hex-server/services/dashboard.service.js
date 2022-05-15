const { DashboardEntity } = require('../database');

const { FormateData } = require('../utils');
const HTTP_STATUS_CODES  = require('../utils/HTTPConstant');

class DashBoardService {
    constructor() {
        this.DashboardEntity = new DashboardEntity();
    }

    async getUserMaxScorequizDashboard({ classroomId, userId }) {
        try {
            const Dashboard = await this.DashboardEntity.findMaxScoreQuizStudentInClassroom({ classroomId });
            if (!Dashboard) {
                return FormateData({
                    error: [
                        {
                            "msg": "Not found Dashboard!",
                            "location": "server",
                            "status": HTTP_STATUS_CODES.NOT_FOUND
                        }
                    ]
                });
            }

            // if(Dashboard.user._id.toString() === userId){
            //     return FormateData({
            //         error: [
            //             {
            //                 "msg": "Not a Creator!",
            //                 "location": "server",
            //                 "status": HTTP_STATUS_CODES.FORBIDDEN
            //             }
            //         ]
            //     });
            // }

            return FormateData({
                data: Dashboard,
                status: HTTP_STATUS_CODES.OK
            });
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = DashBoardService;



