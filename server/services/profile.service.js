const { UserEntity, ProfileEntity } = require('../database');

const { FormateData, PackedError } = require('../utils');
const HTTP_STATUS_CODES = require('../utils/HTTPConstant');

class ProfileService {
    constructor() {
        this.UserEntity = new UserEntity();
        this.ProfileEntity = new ProfileEntity();
    }

    async GetUserProfile({ userId }) {
        try {
            const User = await this.UserEntity.getUserById({ userId });
            if (!User) {
                return FormateData(PackedError("User not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            }

            const Profile = await this.ProfileEntity.getProfile({ userId });
            if (!Profile) {
                return FormateData(PackedError("Profile not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            }

            return FormateData({
                data: {
                    user: User,
                    profile: Profile
                },
                status: HTTP_STATUS_CODES.OK
            });
        }
        catch (error) {
            throw error;
        }
    }

    //not use
    async UpdateUserProfile({ userId, username, role, firstname, lastname, dob, avatar }) {
        
        try {
            const User = await this.UserEntity.getUserById({ userId });
            if (!User) {
                return FormateData(PackedError("User not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            }

            if(userId !== User._id.toString()){
                return FormateData(PackedError("Nou User!", "server", "error", HTTP_STATUS_CODES.UNAUTHORIZED));
            }

            const Profile = await this.ProfileEntity.getProfile({ userId });
            if (!Profile) {
                return FormateData(PackedError("Profile not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            }

            const UpdatedProfile = await this.ProfileEntity.updateProfile({ userId, username, role, firstname, lastname, dob });
            if (!UpdatedProfile) {
                return FormateData(PackedError("Profile not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            }

            const UpdatedUser = await this.UserEntity.updateUser({ userId, username, role, avatar });
            if (!UpdatedUser) {
                return FormateData(PackedError("User not found!", "server", "error", HTTP_STATUS_CODES.NOT_FOUND));
            }

            return FormateData({
                data: {
                    user: User,
                    profile: UpdatedProfile
                },
                status: HTTP_STATUS_CODES.OK
            });
        }
        catch (error) {
            throw error;
        }
    }

    async AddFavoriteClassrooms({ userId, classroomId }) {

        try{
            const AddedFavoriteClassroom = await this.ProfileEntity.addFavoriteClassroom({ userId, classroomId });
            if(!AddedFavoriteClassroom){
                return FormateData(PackedError("Added!", "server", "warning", HTTP_STATUS_CODES.NOT_FOUND));
            }

            return FormateData({
                favorite: AddedFavoriteClassroom,
                status: HTTP_STATUS_CODES.OK
            });

        }
        catch(error){
            throw error;
        }
    }

    async GetFavoriteClassrooms({ userId }) {

        try{
            const FavoriteClassrooms = await this.ProfileEntity.getFavoriteClassrooms({ userId });
            return FormateData({
                favorite: FavoriteClassrooms,
                status: HTTP_STATUS_CODES.OK
            });

        }catch(error){
            throw error;
        }
    }

    async GetUserQuizHistory({ userId }) {
        try {
            const QuizHistory = await this.ProfileEntity.getQuizHistory({ userId });
            return FormateData({
                quiz: QuizHistory,
                status: HTTP_STATUS_CODES.OK
            });
        }
        catch (error) {
            throw error;
        }
    }

    async GetUserOwnClassrooms({ userId }) {
        try {
            const OwnClassrooms = await this.ProfileEntity.getOwnClassrooms({ userId });
            return FormateData({
                ownclassroom: OwnClassrooms,
                status: HTTP_STATUS_CODES.OK
            });
        }
        catch (error) {
            throw error;
        }
    }

    
}

module.exports = ProfileService;