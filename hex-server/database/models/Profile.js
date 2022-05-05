const mongoose = require('mongoose');

const ProfilleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    favoriteClassroom: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Classroom'
        }
    ],
    quizHistory: [
        {
            quizOfLesson: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Lesson',
                required: true
            },
            scores: {
                type: Number,
                required: true
            },
            timeTaken: {
                type: Number,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
        }
    ],
    recentClassroom: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Classroom'
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
