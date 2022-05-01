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

// @route   POST api/classroom/:classroomId/lessons/:lessonId/comment
// @desc    Add a comment to a lesson
// @access  Private
router.post('/:classroomId/lessons/:lessonId/comment', [ValidateToken,
    [
        expressValidator.check('comment', 'Comment is required').not().isEmpty(),
    ]
], async (req, res) => {

    const errors = expressValidator.validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { classroomId, lessonId } = req.params;
    const { comment } = req.body;

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

        const newComment = {
            comment,
            user: req.user.id,
            date: Date.now()
        }

        lesson.comments.unshift(newComment);

        await lesson.save();

        res.json(lesson.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@ route   DELETE api/classroom/:classroomId/lessons/:lessonId/comment/:commentId
//@ desc    Delete a comment
//@ access  Private
router.delete('/:classroomId/lessons/:lessonId/comment/:commentId', ValidateTokenAndTeacher, async (req, res) => {
    
    const { classroomId, lessonId, commentId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(classroomId, lessonId, commentId)) {
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

        const comment = lesson.comments.find(comment => comment.id === commentId);

        if(!comment) {
            return res.status(400).json({ msg: 'Comment not found' });
        }

        if(comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        lesson.comments = lesson.comments.filter(comment => comment.id !== commentId);

        await lesson.save();

        res.json(lesson.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


