const { Router } = require('express');
const { check } = require('express-validator');

const { ValidateMongooseID, ValidatorErrorHelper } = require('../middlewares/validateHelper');
const { ValidateToken, ValidateTokenAndTeacher } = require('../middlewares/Auth');
const ClassroomService = require('../../services/classroom.service');

const router = Router();
const service = new ClassroomService();

//@ ROUTE  POST api/classroom/
//@ DESC   Create a new classroom
//@ ACCESS Private (Teacher)
router.post('/', [
    [check('title').not().isEmpty().withMessage('Please enter a valid Title'),
    check('title').isLength({ min: 5, max: 50 }).withMessage('Title must be between 5 and 50 characters'),
    check('description').not().isEmpty().withMessage('Please enter a valid description'),
    check('description').isLength({ min: 15, max: 150 }).withMessage('Description must be between 5 and 200 characters'),
    check('content').not().isEmpty().withMessage('Please enter a valid content'),
    check('content').isLength({ min: 15, max: 1500 }).withMessage('Content must be between 15 and 200 characters'),
    check('category').isIn(['math', 'science', 'social', 'english', 'computer', 'other']).withMessage('Please enter a valid category'),
    check('tags').isLength({ min: 0, max: 100 }).withMessage('tags must be between 1 and 100 characters'),
    check('level').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Please enter a valid level'),],
    ValidateTokenAndTeacher, ValidatorErrorHelper], async (req, res, next) => {

    const { title, description, category, level, tags, content, classroomImg } = req.body;
    const { id, username } = req.user;

    try {
        const { data } = await service.CreateClassroom({ title, description, content, category, level, userId: id, username, tags, classroomImg });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    };
});

//@ ROUTE  GET api/classroom/
//@ DESC   Get all classrooms
//@ ACCESS Public
router.get('/', async (req, res, next) => {
    //query params page and limit
    const { page, category } = req.query;

    try {
        const { data } = await service.GetClassrooms({page, category});
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    };
});

//@ ROUTE  GET api/classroom/:classroomId
//@ DESC   Get a classroom by id
//@ ACCESS Private (Teacher)
router.get('/:classroomId', [ValidateToken, ValidateMongooseID], async (req, res, next) => {

    const { classroomId } = req.params;
    const { id, username, role } = req.user;

    try {
        const { data } = await service.GetSingleClassroom({ classroomId, userId: id, username, role });
        return res.status(data.status).json(data);
    }
    catch (err) {
        console.error(err);
        next(err);
    };
});

//@ ROUTE  PUT api/classroom/:classroomId
//@ DESC   Update a classroom
//@ ACCESS Private (Teacher)
router.put('/:classroomId', [
    [check('title').not().isEmpty().withMessage('Please enter a valid Title'),
    check('title').isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 50 characters'),
    check('description').not().isEmpty().withMessage('Please enter a valid description'),
    check('description').isLength({ min: 15, max: 200 }).withMessage('Description must be between 5 and 200 characters'),
    check('content').not().isEmpty().withMessage('Please enter a valid content'),
    check('content').isLength({ min: 15, max: 1500 }).withMessage('Content must be between 15 and 200 characters'),
    check('category').isIn(['math', 'science', 'social', 'english', 'computer', 'other']).withMessage('Please enter a valid category'),
    check('tags').isLength({ min: 1, max: 50 }).withMessage('tags must be between 1 and 100 characters'),

    check('level').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Please enter a valid level'),],
    ValidateTokenAndTeacher,ValidateMongooseID, ValidatorErrorHelper], async (req, res, next) => {

    const { classroomId } = req.params;
    const { id, username } = req.user;
    const { title, content, description, category, level, tags, classroomImg } = req.body;

    try {
        const { data } = await service.UpdateClassroom({ classroomId, title, category, level, userId: id, username, tags, classroomImg, content, description });
        return res.status(data.status).json(data);
    }
    catch (err) {
        next(err);
    };
});

//@ ROUTE  DELETE api/classroom/:classroomId
//@ DESC   Delete a classroom
//@ ACCESS Private (Teacher)
router.delete('/:classroomId', [ValidateTokenAndTeacher, ValidatorErrorHelper],async (req, res, next) => {

    const { classroomId } = req.params;
    const { id } = req.user;

    try {
        const { data } = await service.DeleteClassroom({ classroomId, userId: id });
        return res.status(data.status).json(data);
    }
    catch (err) {
        next(err);
    };
});

module.exports = router;

