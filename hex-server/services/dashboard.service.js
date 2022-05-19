const { DashboardEntity, ClassroomEntity } = require('../database');

const { FormateData, PackedError } = require('../utils');
const HTTP_STATUS_CODES  = require('../utils/HTTPConstant');

class DashBoardService {

    constructor() {
        this.DashboardEntity = new DashboardEntity();
        this.ClassroomEntity = new ClassroomEntity();
    }

    async DashBoardClassroom({ classroomId, userId }) {
        try {
            const Classroom = await this.ClassroomEntity.getClassroomById({ classroomId });


            if(Classroom.creator.user.toString() !== userId){
                return FormateData(PackedError("Not a Creator!", "server", "error", HTTP_STATUS_CODES.UNAUTHORIZED));
            }

            const Dashboard = await this.DashboardEntity.getCheckedInStudent({ classroomId });

            return FormateData({
                dashboard: Dashboard,
                status: HTTP_STATUS_CODES.OK
            });
        }
        catch (error) {
            throw error;
        }
    }
}

module.exports = DashBoardService;