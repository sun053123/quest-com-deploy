const UserModel = require('../models/User');

class AuthEntity {

    async createUser({ email, username, hashedPassword, role}) {
        try {
            const user = new UserModel({
                email,
                username,
                password: hashedPassword,
                role
            });

            const CreatedUser = await user.save();
            return CreatedUser;
            
        } catch (error) {
            throw error;
        }     
    }

    async getUserByEmail({email}) {
        try {
            const user = await UserModel.findOne({ email });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getMe({email}) {
        try {
            const user = await UserModel.findOne({ email }).select('-password');
            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthEntity;