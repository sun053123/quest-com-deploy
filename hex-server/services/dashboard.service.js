const { DashboardEntity } = require('../database');

const { FormateData, PackedError } = require('../utils');
const HTTP_STATUS_CODES  = require('../utils/HTTPConstant');

class DashBoardService {
    constructor() {
        this.DashboardEntity = new DashboardEntity();
    }

    async getUserMaxScorequizDashboard({ classroomId, userId }) {
        try {
            const Dashboard = await this.DashboardEntity.findMaxScoreQuizStudentInClassroom({ classroomId });
            if (!Dashboard) {
                return FormateData(PackedError("Not found Dashboard!", "server", "error", HTTP_STATUS_CODES.SERVICE_UNAVAILABLE));
            }

            if(Dashboard.user._id.toString() === userId){
                return FormateData(PackedError("Not a Creator!", "server", "error", HTTP_STATUS_CODES.UNAUTHORIZED));
            }

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



