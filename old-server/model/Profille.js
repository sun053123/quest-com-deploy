const mongoose = require('mongoose');

const ProfilleSchema = new mongoose.Schema({
    user:{
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
    favoriteClassroom: {
        type: Array,
        required: true
    },
    quizHistory: {
        type: Array,
        required: true
    },
    recentClassroom: {
        type: Array,
        required: true
    },
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
        default: 0
    },
    english_score: {
        type: Number,
        default: 0
    },
    computer_score: {
        type: Number,
        default: 0
    },
    science_score: {
        type: Number,
        default: 0
    },
    social_score: {
        type: Number,
        default: 0
    },

});

const Profille = mongoose.model('Profille', ProfilleSchema);

module.exports = Profille;
