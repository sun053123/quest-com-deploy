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

// @route   GET api/classroom/:classroomId/lessons
// @desc    Get all lessons
// @access  Private
router.get('/:classroomId/lessons', ValidateToken, async (req, res) => {

    const { classroomId } = req.params;

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

        const lessons = await LessonModel.find({ classroom: classroomId });
        if (!lessons) {
            return res.status(400).json({ msg: 'Lessons not found' });
        }

        res.json(lessons);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    });

// @route   GET api/classroom/:classroomId/lessons/:lessonId
// @desc    Get a lesson
// @access  Private
router.get('/:classroomId/lessons/:lessonId', ValidateToken, async (req, res) => {

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

        res.json(lesson);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/classroom/:classroomId/lessons
// @desc    Create a lesson
// @access  Private
router.post('/:classroomId/lessons', [ValidateTokenAndTeacher, 
[
    expressValidator.check('title').isLength({ min: 1 }),
    expressValidator.check('description').isLength({ min: 1 }),
]
]
, async (req, res) => {

    const errors = expressValidator.validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { classroomId } = req.params;
    const { title, description } = req.body;

    if(!mongoose.Types.ObjectId.isValid(classroomId)) {
        return res.status(400).json({
            message: 'Invalid ID'
        });
    }

    try {
        let classroom = await ClassroomModel.findById(classroomId);

        if (!classroom) {
            return res.status(400).json({ msg: 'Classroom not found' });
        }

        if (classroom.creator.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const lesson = await LessonModel.create({
            title,
            description,
            classroom: classroomId,
            creator: req.user.id,
            
        });

        if (classroom.isComplete == false) {
            classroom.isComplete = true;
            await classroom.save();
        }

        classroom.lessonCount++;
        await classroom.save();

        res.json(lesson);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/classroom/:classroomId/lessons/:lessonId
// @desc    Update a lesson
// @access  Private
router.put('/:classroomId/lessons/:lessonId', [ValidateTokenAndTeacher,
[
    expressValidator.check('title').isLength({ min: 1 }),
    expressValidator.check('description').isLength({ min: 1 }),
]
]
, async (req, res) => {

    const errors = expressValidator.validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { classroomId, lessonId } = req.params;
    const { title, description } = req.body;

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

        const lesson = await LessonModel.findById(lessonId);
        if (!lesson) {
            return res.status(400).json({ msg: 'Lesson not found' });
        }

        if(title) lesson.title = title;
        if(lesson) lesson.description = description;

        await lesson.save();

        res.json(lesson);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/classroom/:classroomId/lessons/:lessonId
// @desc    Delete a lesson
// @access  Private
router.delete('/:classroomId/lessons/:lessonId', ValidateTokenAndTeacher, async (req, res) => {

    const { classroomId, lessonId } = req.params;

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

        const lesson = await LessonModel.findById(lessonId);
        if (!lesson) {
            return res.status(400).json({ msg: 'Lesson not found' });
        }

        if(lesson.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await lesson.deleteMany();

        const lessons = await LessonModel.find({ classroom: classroomId });
        if (!lessons) {
            classroom.isComplete = false;
            await classroom.save();
        }

        classroom.lessonCount = classroom.lessonCount - 1;

        if(classroom.lessonCount == 0) {
            classroom.isComplete = false;
        }
        await classroom.save();

        return res.json({ msg: 'Lesson removed' });
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;