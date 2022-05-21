const express = require('express');
const router = express.Router();
const { ValidateToken, ValidateTokenAndTeacher } = require('../middlewares/auth');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ClassroomModel = require('../../model/Classroom');
const UserModel = require('../../model/User');
const mongoose = require('mongoose');
const DashboardModel = require('../../model/Dashboard');
const QuizModel = require('../../model/Quiz');
const LessonModel = require('../../model/Lesson');

// @route   GET api/classroom/:classroomId/lessons/:lessonId/quizgame
// @desc    Get a lesson
// @access  Private
router.get('/:classroomId/lessons/:lessonId/quizgame', ValidateToken, async (req, res) => {
    
        const { classroomId, lessonId } = req.params;
    
        if(!mongoose.Types.ObjectId.isValid(classroomId, lessonId)) {
            return res.status(400).json({
                message: 'Invalid ID'
            });
        }
    
        try {
    
            const classroom = await ClassroomModel.findById(classroomId);
    
            if (!classroom) {
                return res.status(400).json({ msg: 'Classroom not found' });
            }
    
            const lesson = await LessonModel.findById(lessonId);
    
            if (!lesson) {
                return res.status(400).json({ msg: 'Lesson not found' });
            }

            const quizgame = await QuizModel.find({ lesson: lessonId }).select('-answer').sort({ createdAt: -1 }).limit(20);

            return res.json(quizgame);
            
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
});


module.exports = router;