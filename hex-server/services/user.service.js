const { UserEntity, ProfileEntity, DashboardEntity } = require('../database');

const { FormateData } = require('../utils');
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
            return FormateData({
                error: [
                    {
                        "msg": "Not found User!",
                        "location": "server",
                        "type": "error"
                    }
                ],
                status: HTTP_STATUS_CODES.NOT_FOUND
            });
        }

        const UserScores = await this.UserEntity.getUserScores({ userId });
        if (!UserScores) {
            return FormateData({
                error: [
                    {
                        "msg": "Not found User Scores!",
                        "location": "server",
                        "type": "error"
                    }
                ],
                status: HTTP_STATUS_CODES.NOT_FOUND
            });
        }

        return FormateData({
            scores: UserScores,
            status: HTTP_STATUS_CODES.OK
        });

    }

    async GetUserOwnClassroom({ userId }) {
            
            const Users = await this.UserEntity.getUserById({ userId });
            if (!Users) {
                return FormateData({
                    error: [
                        {
                            "msg": "Not found User!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.NOT_FOUND
                });
            }

            const UserOwnClassroom = await this.UserEntity.getUserOwnClassroom({ userId });

            return FormateData({
                ownclassrooms: UserOwnClassroom,
                status: HTTP_STATUS_CODES.OK
            });
        }
}

module.exports = UserService;