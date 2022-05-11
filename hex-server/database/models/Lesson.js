const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
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
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    lessonImg: {
        type: String,
        required: false
    },
    isShowLessonImg: {
        type: Boolean,
        required: true,
        default: false
    },
    lessonFile: {
        type: String,
        required: false
    },
    quizCount: {
        type: Number,
        required: true,
        default: 0
    },
    quizIsReady: {
        type: Boolean,
        required: true,
        default: false
    },
    quizIsRandom: {
        type: Boolean,
        default: false,
        required: true
    },
    quizLimit: {
        type: Number,
        default: 20,
        required: true
    },
    quizType: {
        type: String,
        default: 'multiple',
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
            ],
            likeCount: {
                type: Number,
                required: true,
                default: 0
            }
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
    ],
    likeCount: {
        type: Number,
        default: 0,
        required: true
    }   
},{
    toJSON: {
        transform(doc, ret){
            delete ret.__v;
        }
    },
    timestamps: true
});

const Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = Lesson;