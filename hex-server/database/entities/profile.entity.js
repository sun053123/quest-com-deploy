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
            const Profile = await ProfileModel.findOne({ user: userId });

            console.log(category)

            if(category === "math"){
                Profile.math_score += expgain;
            }else if(category === "science"){
                Profile.science_score += expgain;
            }else if(category === "english"){
                Profile.english_score += expgain;
            }else if(category === "social"){
                Profile.social_score += expgain;
            }else{
                Profile.computer_score += expgain;
            }

            await Profile.save();
        
        }
        catch{
            throw error;
        }
    }
}

module.exports = ProfileEntity;