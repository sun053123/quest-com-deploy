const mongoose = require('mongoose');

const DashboardSchema = new mongoose.Schema({
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    studentsCheckin: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
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
            deletedAt: {
                type: Date,
                default: null
            },
        }
    ],
    studentCompleteQuiz: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            lesson: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Lesson',
                required: true
            },
            result: [
                {
                    gamequizId:{
                        type: mongoose.Schema.Types.ObjectId,
                        ref:'Quiz',
                        required: true
                   },
                    selected:{
                        type: String,
                        required: true
                    },
                    isCorrect:{
                        type: Boolean,
                        required: true
                    },
                    createdAt: {
                        type: Date,
                        default: Date.now
                    },
                    updatedAt: {
                        type: Date,
                        default: Date.now
                    }
                }
            ],
            timeTaken: {
                type: Number,
                required: true
            },
            score: {
                type: Number,
                required: true
            },
            attempts: {
                type: Number,
                required: true
            },
            expgain: {
                type: Number,
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
            deletedAt: {
                type: Date,
                default: null
            },
        }
    ]
},{
    toJSON: {
        transform(doc, ret){
            delete ret.__v;
        }
    },
    timestamps: true
});

const Dashboard = mongoose.model('Dashboard', DashboardSchema);

module.exports = Dashboard;