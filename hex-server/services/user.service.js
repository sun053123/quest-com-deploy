const { UserEntity, ProfileEntity, DashboardEntity } = require('../database');

const { FormateData, PackedError } = require('../utils');
const HTTP_STATUS_CODES = require('../utils/HTTPConstant'); 

class UserService{

    constructor() {
        this.UserEntity = new UserEntity();
        this.ProfileEntity = new ProfileEntity();
        this.DashboardEntity = new DashboardEntity();
    }

    async GetUserScores({ userId }) {

        const Users = await this.UserEntity.getUserById({ userId });
        if (!Users) {
           return FormateData(PackedError("Not found User!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
        }

        const UserScores = await this.UserEntity.getUserScores({ userId });
        if (!UserScores) {
            return FormateData(PackedError("Not found UserScores!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
        }

        return FormateData({
            scores: UserScores,
            status: HTTP_STATUS_CODES.OK
        });

    }

    async GetUserOwnClassroom({ userId }) {
            
            const Users = await this.UserEntity.getUserById({ userId });
            if (!Users) {
                return FormateData(PackedError("Not found User!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            }

            const UserOwnClassroom = await this.UserEntity.getUserOwnClassroom({ userId });

            return FormateData({
                ownclassrooms: UserOwnClassroom,
                status: HTTP_STATUS_CODES.OK
            });
        }
}

module.exports = UserService;