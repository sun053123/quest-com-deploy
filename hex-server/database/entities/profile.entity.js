const ProfileModel = require('../models/Profile');

//CRUD USER PROFILE
class ProfileEntity{
    //when register
    async createProfile({ userId, firstname, lastname, dob, school  }) {
        try {
            const Profile = await ProfileModel.create({ 
                user: userId, firstname, lastname, dob, school
            });
            return Profile;
        } catch (error) {
            throw error;
        }
    }

    async updateUserExp({ userId, expgain, category }) {
        try{
            const UpdatedExp = await ProfileModel.findOneAndUpdate({ user: userId }, { $inc: { [`${category}_score`]: expgain } });
            return UpdatedExp;
        }
        catch{
            throw error;
        }
    }

    async getProfile({ userId }) {
        try {
            const Profile = await ProfileModel.findOne({ user: userId })
            .lean()
            .select('-favoriteClassroom -recentClassroom -quizHistory -ownClassroom -_id');

            return Profile;
        } catch (error) {
            throw error;
        }
    }

    async updateProfile({ userId, firstname, lastname, dob, school }) {
        try {
            const UpdatedProfile = await ProfileModel.findOneAndUpdate({ user: userId }, { firstname, lastname, dob, school },{
                new: true
            });
            return UpdatedProfile;
        } catch (error) {
            throw error;
        }
    }

    ////// ////// /////// ///////// ///// /////// //////// ////////
    async addFavoriteClassroom({ userId, classroomId }) {
        try {
            const Profile = await ProfileModel.findOne({user: userId});
            
            if(Profile.favoriteClassroom.find(classroom => classroom.toString() === classroomId.toString())){
                return false;//if added already, return warning you already added
            } else {
                Profile.favoriteClassroom.push(classroomId);
            }

            const UpdatedProfile = await Profile.save();
            return UpdatedProfile.favoriteClassroom;
        }
        catch (error) {
            throw error;
        }
    }

    async getFavoriteClassrooms({ userId }) {
        try {
            const Profile = await ProfileModel.findOne({ user: userId })
            .lean()
            .populate('favoriteClassroom', '_id title classroomImg createdAt updatedAt');
            return Profile.favoriteClassroom;
        }
        catch (error) {
            throw error;
        }
    }

//save recent classroom
    async saveRecentClassroom({ userId, classroomId }) {
        try {
            const User = await ProfileModel.findById(userId);
            User.recentClassroom.push(classroomId);
            const UserUpdate = await User.save();
            return UserUpdate;
        }
        catch (error) {
            throw error;
        }
    }


}

module.exports = ProfileEntity;