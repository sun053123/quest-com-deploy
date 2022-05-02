const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

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
    check('description').not().isEmpty().withMessage('Please enter a valid description'),
    check('category').isIn(['math', 'science', 'society', 'english', 'computer', 'other']).withMessage('Please enter a valid category'),
    check('level').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Please enter a valid level'),],
    ValidateTokenAndTeacher, ValidatorErrorHelper], async (req, res, next) => {

    const { title, description, category, level, tags } = req.body;
    const { id, username } = req.user;

    try {
        const { data } = await service.CreateClassroom({ title, description, category, level, userId: id, username, tags });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    };
});

//@ ROUTE  GET api/classroom/
//@ DESC   Get all classrooms
//@ ACCESS Public
router.get('/', async (req, res, next) => {
    try {
        const { data } = await service.GetClassrooms();
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
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
        return res.status(500).json({
            error: 'Server error'
        });
    };
});

//@ ROUTE  PUT api/classroom/:classroomId
//@ DESC   Update a classroom
//@ ACCESS Private (Teacher)
router.put('/:classroomId', [
    [check('title').not().isEmpty().withMessage('Please enter a valid Title'),
    check('description').not().isEmpty().withMessage('Please enter a valid description'),
    check('category').isIn(['math', 'science', 'society', 'english', 'computer', 'other']).withMessage('Please enter a valid category'),
    check('level').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Please enter a valid level'),],
    ValidateTokenAndTeacher,ValidateMongooseID, ValidatorErrorHelper], async (req, res, next) => {

    const { classroomId } = req.params;
    const { id, username } = req.user;
    const { title, description, category, level, tags, classroomImg } = req.body;

    try {
        const { data } = await service.UpdateClassroom({ classroomId, title, description, category, level, userId: id, username, tags, classroomImg });
        return res.status(data.status).json(data);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
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
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    };
});

module.exports = router;

