const mongoose = require('mongoose');

const ProfilleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    dob: {
        type: String,
    },
    school: {
        type: String,
    },
    favoriteClassroom: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Classroom'
        }
    ],
    quizHistory: [
        {
            classroom: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Classroom'
            },
            lesson: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Lesson',
                required: true
            },
            expgain:{
                type: Number,
                required: true
            },
            score: {
                type: Number,
                required: true
            },
            timeTaken: {
                type: Number,
                required: true
            },
            attempts: {
                type: Number,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            deletedAt: {
                type: Date,
                default: null
            },
        }
    ],
    ownClassroom: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Classroom'
        }
    ],
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
    math_score: {
        type: Number,
        default: 0,
    },
    english_score: {
        type: Number,
        default: 0,
    },
    computer_score: {
        type: Number,
        default: 0,
    },
    science_score: {
        type: Number,
        default: 0,
    },
    social_score: {
        type: Number,
        default: 0,
    },
});

const Profille = mongoose.model('Profille', ProfilleSchema);

module.exports = Profille;
