const { AuthEntity, ProfileEntity } = require('../database');
const bcrypt = require('bcrypt');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const dotenv = require('dotenv');
dotenv.config();

const { FormateData, GenerateToken, PackedError } = require('../utils');
const HTTP_STATUS_CODES = require('../utils/HTTPConstant');

class AuthService {

    Packpayload(user) {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            avatar: user.avatar
        }
    }

    constructor() {
        this.AuthEntity = new AuthEntity();
        this.ProfileEntity = new ProfileEntity();
    }

    async RegisterUser({ email, username, password, role, firstname, lastname, dob, school }) {
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
                role,
            });
            
            //if created Failed
            if (!createdUser){
                return FormateData({
                    error: [
                        {
                            "msg": "Failed to create user!",
                            "location": "server"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
                }) 
            }

            //create user profile

            //formate dob date to Datetype
            const createdProfile = await this.ProfileEntity.createProfile({
                userId: createdUser.id, firstname, lastname, dob, school
            });
            if (!createdProfile) {
                return FormateData({
                    error: [
                        {
                            "msg": "Failed to create user profile!",
                            "location": "server",
                            "type": "error"
                        }
                    ],
                    status: HTTP_STATUS_CODES.SERVICE_UNAVAILABLE,
                })
            }

            //make payload
            const payload = this.Packpayload(createdUser);

            //generate token
            const token = GenerateToken(payload);

            return FormateData({
                token, 
                status: HTTP_STATUS_CODES.CREATED
            });

           
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
                return FormateData(PackedError("Wrong Credentials!","server","warning",HTTP_STATUS_CODES.BAD_REQUEST));
            }

            //check password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return FormateData(PackedError("Wrong Credentials!","server","warning",HTTP_STATUS_CODES.BAD_REQUEST));
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

    async GetUser({ email }) {
        try {
            const user = await this.AuthEntity.getMe({ email });

            //user not found
            if (!user) {
                return FormateData(PackedError("User not found!","server","error",HTTP_STATUS_CODES.NOT_FOUND));
            }

            return FormateData({user, status: HTTP_STATUS_CODES.OK});
        }
        catch (error) {
            console.error(error); 
            throw error;
        }
    }

    async GoogleLogin({ tokenId }) {
        try {
            //verify token
            // console.log(tokenId);
            // console.log(process.env.GOOGLE_CLIENT_ID);

            const oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID);
            const verifyIdToken = await oauth2Client.verifyIdToken({
                idToken: tokenId,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const { email_verified, email, name, picture } = verifyIdToken.payload

            if (!email_verified) {
                return FormateData(PackedError("Google token not valid!","server","error",HTTP_STATUS_CODES.BAD_REQUEST));
            }

            //check if user exists
            const User = await this.AuthEntity.getUserByEmail({ email });

            //user not found, Register
            if (!User) {

                let role = false; //default gmail role
                //check kmitlemail 
                const verifyKMITLemail = email.includes("@kmitl.ac.th");
                if (verifyKMITLemail) {
                    //if email is kmitl email
                    //if email is number (61050273@kmitl.ac.th) (student email)
                    const verifyNumber = /^\d+$/.test(email[7]);
                    if (verifyNumber) {
                        //if email is number
                        role = false;
                    } else {
                        //if email is not number (teacher@kmtil.ac.th)
                        role = true;
                    }
                } else {
                    //if email is not kmitl email
                    role = false;
                }

                //generate password
                const password = email + process.env.GOOGLE_CLIENT_ID;
                const salt = await bcrypt.genSalt(12);

                //hash password
                const hashedPassword = await bcrypt.hash(password, salt);

                //create user
                const createdUser = await this.AuthEntity.createUser({
                    email,
                    username: name,
                    role: role,
                    hashedPassword,
                    avatar: picture
                });
                
                //create user profile
                const createdProfile = await this.ProfileEntity.createProfile({
                    userId: createdUser.id,
                });

                //if failed to create user
                if (!createdProfile || !createdUser) {
                    return FormateData(PackedError("Failed to create user profile!","server","error",HTTP_STATUS_CODES.SERVICE_UNAVAILABLE));
                }

                //make payload
                const payload = this.Packpayload(createdUser);

                //generate token
                const token = GenerateToken(payload);

                return FormateData({token, status: HTTP_STATUS_CODES.CREATED});

            } else {
                // if user exists, login
                //make payload
                const payload = this.Packpayload(User);

                //generate token
                const token = GenerateToken(payload);

                return FormateData({token, status: HTTP_STATUS_CODES.OK});
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }

}

module.exports = AuthService;