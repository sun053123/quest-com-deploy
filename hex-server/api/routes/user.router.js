const { Router } = require('express');
const { check } = require('express-validator');

const { ValidateToken, ValidateTokenAndTeacher } = require('../middlewares/Auth');
const { ValidateMongooseID, ValidatorErrorHelper } = require('../middlewares/validateHelper');
const UserService = require('../../services/user.service');

const router = Router();
const service = new UserService()

//@ ROUTE  GET api/user/scores
//@ DESC   Get all scores of a user
//@ ACCESS Private (Basic)
router.get('/scores', ValidateToken, async (req, res, next) => {
    const { id } = req.user;
    try {
        const { data } = await service.GetScores({ id });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    }
});

//@ ROUTE  GET api/user/ownclassroom
//@ DESC   Get all recent created classrooms of a user
//@ ACCESS Private (Teacher)
router.get('/ownclassroom', ValidateTokenAndTeacher, async (req, res, next) => {
    const { id } = req.user;
    try {
        const { data } = await service.GetOwnClassroom({ id });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    }
});




module.exports = router;

