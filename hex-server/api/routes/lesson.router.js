const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const { ValidatorErrorHelper, ValidateMongooseID } = require('../middlewares/validateHelper');
const { ValidateToken, ValidateTokenAndTeacher } = require('../middlewares/Auth');
const LessonService = require('../../services/lesson.service');

const router = Router();
const service = new LessonService();

//@ ROUTE  POST api/classroom/:classroomId/lesson
//@ DESC   Create a new lesson
//@ ACCESS Private (Teacher)
router.post('/:classroomId/lesson', [
    [check('title').not().isEmpty().withMessage('Please enter a valid Title'),
    check('description').not().isEmpty().withMessage('Please enter a valid description'),], 
    ValidateTokenAndTeacher, ValidateMongooseID, ValidatorErrorHelper ], async (req, res, next) => {

    const { title, description } = req.body;
    const { id, username } = req.user;
    const { classroomId } = req.params;

    try {
        const { data } = await service.CreateLesson({ title, description, classroomId, userId: id, username });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    };
});

    


module.exports = router;

