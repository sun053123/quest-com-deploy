const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    Image: {
        type: String,
        required: false
    },
    creator : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        required: true
    },
    quizCount: {
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
    comments: [
        {
            body: {
                type: String,
                required: true
            },
            username: {
                type: String,
                required: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
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
            likes: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User',
                        required: true
                    }
                }
            ]
        }
    ],
    likes: [
        {
            user: 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }

        }
    ]    
        
});

const Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = Lesson;