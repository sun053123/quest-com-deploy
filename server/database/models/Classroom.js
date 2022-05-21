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
    content: {
        type: String,
        required: true
    },
    classroomImg: {
        type: String,
        required: false
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
    level: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
    },
    lessonCount: {
        type: Number,
        required: true,
        default: 0
    },
    studentCount: {
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
    deletedAt: {
        type: Date,
        default: null
    },
    isComplete: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: {
        transform(doc, ret){
            delete ret.__v;
        }
    },
    timestamps: true
});

const Classroom = mongoose.model('Classroom', ClassroomSchema);
module.exports = Classroom;

