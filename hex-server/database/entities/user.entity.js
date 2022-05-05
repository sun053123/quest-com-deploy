//use profile MODEL
const UserModel = require('../models/User');
const ProfileModel = require('../models/Profile');

//FIXME: there is something wrong ( favorite push to profile )

class UserEntity {
//get user score
    async getUserScores({ userId }) {
        try {
            const UserScore = await ProfileModel.findOne({ user: userId })

            const UserScores = {
                math_score: UserScore.math_score,
                english_score: UserScore.english_score,
                science_score: UserScore.science_score,
                society_score: UserScore.society_score,
                computer_score: UserScore.computer_score,
            }
            return UserScores;
        }
        catch (error) {
            throw error;
        }
    }

    async getUserByEmail({ email }) {
        try {
            const User = await UserModel.findOne({ email }).select('-password');
            return User;
        } catch (error) {
            throw error;
        }
    }

    async getUserById({ userId }) {
        try {
            const User = await UserModel.findById(userId).select('-password');
            return User;
        } catch (error) {
            throw error;
        }
    }

    async updateScoreToUser({ userId, score, category }) {
        try {
            const UserScore = await ProfileModel.findOne({ user: userId });
            if(category === "science"){
                UserScore.science_score++;
            }else if(category === "math"){
                UserScore.math_score++;
            }else if(category === "english"){
                UserScore.english_score++;
            }else if(category === "society"){
                UserScore.society_score++;
            }else if(category === "computer"){
                UserScore.computer_score++;
            } else {
                return null;
            }

            const UserScoreUpdate = await UserScore.save();
            return UserScoreUpdate;
        }
        catch (error) {
            throw error;
        }
    }

//save fav classroom
    async saveFavClassroom({ userId, classroomId }) {
        try {
            const User = await ProfileModel.findById(userId);
            User.favClassroom.push(classroomId);
            const UserUpdate = await User.save();
            return UserUpdate;
        }
        catch (error) {
            throw error;
        }
    }

    async getFavClassroom({ userId }) {
        try {
            const User = await ProfileModel.findById(userId);
            return User.favClassroom;
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

    async getRecentClassroom({ userId }) {
        try {
            const User = await ProfileModel.findById(userId);
            return User.recentClassroom;
        }
        catch (error) {
            throw error;
        }
    }

    async getUserOwnClassroom({ userId }) {
        try {
            const Classroom = await ClassroomModel.find({ creator: { user: userId } }).sort({ createdAt: -1 });
            return Classroom;
        }
        catch (error) {
            throw error;
        }
    }

//save recent quiz score


}

module.exports = UserEntity;