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
}

module.exports = ProfileEntity;