const { AuthEntity } = require('../database');
const bcrypt = require('bcrypt');

const { FormateData, GenerateToken } = require('../utils');
const HTTP_STATUS_CODES = require('../utils/HTTPConstant');

class AuthService {

    Packpayload(user) {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role
        }
    }


    constructor() {
        this.AuthEntity = new AuthEntity();
    }

    async RegisterUser({ email, username, password, role }) {
        try {

            const user = await this.AuthEntity.getUserByEmail({ email });

            // user already exists
            if (user) {
                return FormateData({ 
                    error: [
                        {
                            "msg": "User already exists, Email is been taken!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.BAD_REQUEST,
                })
            }

            //check role
            if (role === "teacher") {
                role = true;
            } else {
                role = false;
            }

            //hash password
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);

            //create user 
            const createdUser = await this.AuthEntity.createUser({
                email,
                username,
                hashedPassword,
                role
            });
            
            //if created Failed
            if (!createdUser){
                return FormateData({
                    errors: [
                        {
                            "msg": "Failed to create user!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
                }) 
            }

            //make payload
            const payload = this.Packpayload(createdUser);

            //generate token
            const token = GenerateToken(payload);

            return FormateData({token, status: HTTP_STATUS_CODES.CREATED});

           
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async LoginUser({ email, password }) {
        try {
            const user = await this.AuthEntity.getUserByEmail({ email });

            //user not found
            if (!user) {
                return FormateData({
                    error: [
                        {
                            "msg": "Wrong Credentials!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.BAD_REQUEST,
                })
            }

            //check password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return FormateData({
                    error: [
                        {
                            "msg": "Wrong Credentials!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.BAD_REQUEST,
                })
            }

            //make payload
            const payload = this.Packpayload(user);

            //generate token
            const token = GenerateToken(payload);

            return FormateData({token, status: HTTP_STATUS_CODES.OK});

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}

module.exports = AuthService;