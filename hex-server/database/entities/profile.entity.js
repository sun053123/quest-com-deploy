const ProfileModel = require('../models/Profile');

//CRUD USER PROFILE
class ProfileEntity{
    //when register
    async createProfile({ userId, firstname, lastname, dob, school, avatar  }) {
        try {
            const Profile = await ProfileModel.create({ 
                user: userId, firstname, lastname, dob, school, avatar
            });
            return Profile;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ProfileEntity;