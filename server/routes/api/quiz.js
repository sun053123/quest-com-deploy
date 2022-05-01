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
const LessonModel = require('../../model/Lesson');
const QuizModel = require('../../model/Quiz');

// @route   GET api/classroom/:classroomId/lesson/:lessonId/quizzes
// @desc    Get all quizzes
// @access  Private
router.get('/:classroomId/lessons/:lessonId/quizzes', ValidateToken, async (req, res) => {
    const { classroomId, lessonId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classroomId, lessonId)) {
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

        const quizzes = await QuizModel.find({ lesson: lessonId });
        if (!quizzes) {
            return res.status(400).json({ msg: 'Quizzes not found' });
        }

        return res.json(quizzes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/classroom/:classroomId/lesson/:lessonId/quizzes
// @desc    Post a quiz
// @access  Private
router.post('/:classroomId/lessons/:lessonId/quizzes', [ValidateTokenAndTeacher,
[
    expressValidator.check('question', 'Question is required').not().isEmpty(),
    expressValidator.check('answer', 'Answer is required').not().isEmpty(),
    expressValidator.check('explaination', 'explaination is required').not().isEmpty(),
]], async (req, res) => {

    const errors = expressValidator.validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { option1, option2, option3, option4, answer } = req.body;

    if ( option1.length <= 0 && option2.length <= 0 && option3.length <= 0 && option4.length <= 0 ) {
        return res.status(400).json({
            message: 'Please add at least one option'
        });
    }

    if ( answer != option1 && answer != option2 && answer != option3 && answer != option4 ) {
        return res.status(400).json({
            message: 'Please select an answer'
        });
    }

    const { classroomId, lessonId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classroomId, lessonId)) {
        return res.status(400).json({
            message: 'Invalid ID'
        });
    }

    const { question, explaination, questionImg, type } = req.body;


    const options = []

    if(option1) options.push(option1);
    if(option2) options.push(option2);
    if(option3) options.push(option3);
    if(option4) options.push(option4);

    try {
        const classroom = await ClassroomModel.findById(classroomId);

        if (!classroom) {
            return res.status(400).json({ msg: 'Classroom not found' });
        }

        const lesson = await LessonModel.findById(lessonId);

        if (!lesson) {
            return res.status(400).json({ msg: 'Lesson not found' });
        }

        const quiz = new QuizModel({
            question,
            options,
            answer,
            questionImg,
            explaination,
            type,
            lesson: lessonId,
            creator: req.user.id
        });

        await quiz.save();

        return res.json(quiz);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/classroom/:classroomId/lesson/:lessonId/quizzes/:quizId
// @desc    Update a quiz
// @access  Private
router.put('/:classroomId/lessons/:lessonId/quizzes/:quizId', ValidateTokenAndTeacher , async (req, res) => {
    const { classroomId, lessonId, quizId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classroomId, lessonId, quizId)) {
        return res.status(400).json({
            message: 'Invalid ID'
        });
    }

    const { question, explaination, questionImg, type, answer } = req.body;

    const { option1, option2, option3, option4 } = req.body;

    const options = []
    if(option1) options.push(option1);
    if(option2) options.push(option2);
    if(option3) options.push(option3);
    if(option4) options.push(option4);

    if (options.map(option => option.length).includes(0)) {
        return res.status(400).json({
            message: 'Please add at least one option'
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

        const quiz = await QuizModel.findById(quizId);

        if (!quiz) {
            return res.status(400).json({ msg: 'Quiz not found' });
        }

        if (quiz.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        let isHaveAnswer = false;

        if (!answer) {
            isHaveAnswer = options.includes(quiz.answer);
        } else {
            isHaveAnswer = options.includes(answer);
        }

        // console.log(isHaveAnswer);

        if (isHaveAnswer == false) {
            return res.status(400).json({
                message: 'There is no answer in options!' 
            });
        }


        if(question) quiz.question = question;
        if(options.length >= 0) quiz.options = options;
        if(question) quiz.answer = answer;
        if(question) quiz.questionImg = questionImg;
        if(question) quiz.explaination = explaination;
        if(question) quiz.type = type;
        quiz.lesson = lessonId;
        quiz.updatedAt = Date.now();

        await quiz.save();

        lesson.quizCount = lesson.quizCount + 1;
        await lesson.save();

        return res.json(quiz);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/classroom/:classroomId/lesson/:lessonId/quizzes/:quizId
// @desc    Delete a quiz
// @access  Private
router.delete('/:classroomId/lessons/:lessonId/quizzes/:quizId', ValidateTokenAndTeacher , async (req, res) => {
    const { classroomId, lessonId, quizId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classroomId, lessonId, quizId)) {
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

        const quiz = await QuizModel.findById(quizId);

        if (!quiz) {
            return res.status(400).json({ msg: 'Quiz not found' });
        }

        if (quiz.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await quiz.remove();

        lesson.quizCount = lesson.quizCount - 1;
        await lesson.save();

        return res.json({ msg: 'Quiz removed' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
    
module.exports = router;