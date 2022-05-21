const { Router } = require('express');
const { check } = require('express-validator');

const { ValidatorErrorHelper } = require('../middlewares/validateHelper');
const { ValidateToken, ValidateTokenAndTeacher } = require('../middlewares/Auth');
const ProfileService = require('../../services/profile.service');

const router = Router();
const service = new ProfileService();

//@ ROUTE  GET api/profile
//@ DESC   Get user profile
//@ ACCESS Private (Basic)
router.get('/',  [ValidateToken], async (req, res, next) => {

    const { id,  } = req.user;

    try {
        const { data } = await service.GetUserProfile({ userId: id });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//@ ROUTE  PUT api/profile
//@ DESC   Update user profile
//@ ACCESS Private (Basic)
router.put('/', [
    [check('username').not().isEmpty().withMessage('Please enter a valid First Name'),
    check('role').isIn(['student', 'teacher']).withMessage('Please enter a valid role'),
    check('firstName').not().isEmpty().withMessage('Please enter a valid First Name'),
    check('lastName').not().isEmpty().withMessage('Please enter a valid Last Name'),
    check('dob').not().isEmpty().withMessage('Please enter a valid Email'),
], [ValidateToken]], ValidatorErrorHelper, async (req, res, next) => {
    
    const { username, role, firstname, lastname, dob, avatar } = req.body;
    const { id } = req.user;

    try {
        const { data } = await service.UpdateUserProfile({ userId: id, username, role, firstname, lastname, dob, avatar });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//@ ROUTE  GET api/profile/favorite
//@ DESC   Get user favorite classrooms
//@ ACCESS Private (Basic)
router.get('/favorite', [ValidateToken], async (req, res, next) => {

    const { id } = req.user;
    
    try {
        const { data } = await service.GetFavoriteClassrooms({ userId: id });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//@ ROUTE  PUT api/profile/favorite/:classroomId
//@ DESC   Add a classroom to user favorite classrooms
//@ ACCESS Private (Basic)
router.put('/favorite/:classroomId', [ValidateToken], async (req, res, next) => {

    const { id } = req.user;
    const { classroomId } = req.params;

    try {
        const { data } = await service.AddFavoriteClassrooms({ userId: id, classroomId });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//@ ROUTE  GET api/profile/quizhistory
//@ DESC   Get user quiz history
//@ ACCESS Private (Basic)
router.get('/quizhistory', [ValidateToken], async (req, res, next) => {

    const { id } = req.user;

    try {
        const { data } = await service.GetUserQuizHistory({ userId: id });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//@ ROUTE  GET api/profile/ownclassroom
//@ DESC   Get user own classrooms
//@ ACCESS Private (Basic)
router.get('/ownclassroom', [ValidateTokenAndTeacher], async (req, res, next) => {
    
    const { id } = req.user;

    try {
        const { data } = await service.GetUserOwnClassrooms({ userId: id });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    }
});





   

module.exports = router;

