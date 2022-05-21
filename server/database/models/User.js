const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: Boolean,
        required: true,
        default: false
    },
    avatar: {
        type: String,
        required: false,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deletedAt: {
        type: Date,
        default: null
    },
},{
    // this will make sure that the __v, password is not included in the json response
    toJSON: {
        transform(doc, ret){
            delete ret.__v;
            delete ret.password;
        }
    },
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;