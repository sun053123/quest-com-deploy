const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creator : {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    category: {
        type: String,
        required: true
    },
    lessonCount: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isComplete: {
        type: Boolean,
        default: false
    }
});

const Classroom = mongoose.model('Classroom', ClassroomSchema);
module.exports = Classroom;

