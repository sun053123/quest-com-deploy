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
        const { data } = await service.GetUserScores({ userId:id });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//@ ROUTE  GET api/user/ownclassroom
//@ DESC   Get all recent created classrooms of a user
//@ ACCESS Private (Teacher)
router.get('/ownclassroom', ValidateTokenAndTeacher, async (req, res, next) => {
    const { id } = req.user;
    try {
        const { data } = await service.GetUserOwnClassroom({ userId:id });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    }
});




module.exports = router;

