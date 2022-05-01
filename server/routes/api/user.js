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
const Dashboard = require('../../model/Dashboard');
const LessonModel = require('../../model/Lesson');
const ProfileModel = require('../../model/Profile');

// @route   Put api/user/favorite/:classroomId
// @desc    Add favorite classroom
// @access  Private(basic)
router.put('/favorite/:classroomId', ValidateToken, async (req, res) => {

    const classroomId = req.params.classroomId;
    const userId = req.user.id;

    if(!mongoose.Types.ObjectId.isValid(classroomId)) {
        return res.status(400).json({
            message: 'Invalid ID'
        });
    }

    try {

        const classroom = await ClassroomModel.findById(classroomId);

        if (!classroom) {
            return res.status(400).json({ msg: 'Classroom not found' });
        }

        let userprofile = await ProfileModel.findOne({ user: userId });

        if (!userprofile) {
            return res.status(400).json({ msg: 'User profile not found' });
        }

        if(userprofile.favoriteClassrooms.find(favoriteClassroom => favoriteClassroom.toString() === classroomId)) {
            userprofile.favoriteClassrooms.pull(classroomId);
        } else {
            userprofile.favoriteClassrooms.push(classroomId);
        }

        res.json(userprofile);

        
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            msg: 'Server error'
        });
    }
});

router.get('/score', ValidateToken, async (req, res) => {

    const userId = req.user.id;

    try {

        const userprofile = await ProfileModel.findOne({ user: userId });

        if (!userprofile) {
            return res.status(400).json({ msg: 'User profile not found' });
        }

        let userScore = {}

        userScore.scienceScore = userprofile.science_score; 
        userScore.mathScore = userprofile.math_score;
        userScore.socialScore = userprofile.social_score;
        userScore.englishScore = userprofile.english_score;
        userScore.computerScore = userprofile.computer_score;

        return res.json(userScore);
        
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            msg: 'Server error'
        });
    }
});



module.exports = router;