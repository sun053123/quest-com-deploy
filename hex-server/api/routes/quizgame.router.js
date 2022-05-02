const { Router } = require('express');
const { check } = require('express-validator');

const { ValidateToken } = require('../middlewares/Auth');
const { ValidateMongooseID } = require('../middlewares/validateHelper');
const QuizGameService = require('../../services/quizgame.service');

const router = Router();
const service = new QuizGameService()

//@ ROUTE  GET api/classroom/:classroomId/lesson/:lessonId/quizgame
//@ DESC   Get a quizgame Ready to Play!
//@ ACCESS Private (Basic)
router.get('/:classroomId/lesson/:lessonId/quizgame',
    [ValidateToken, ValidateMongooseID], async (req, res, next) => {

    const { classroomId, lessonId } = req.params;
    const { id, username } = req.user;

    try {
        const { data } = await service.GetQuizGame({ classroomId, lessonId, userId: id, username });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    };
});

//TODO: ADD attempt student in dashboard
    
//@ ROUTE  GET api/classroom/:classroomId/lesson/:lessonId/quizgame/result
//@ DESC   GET a quizgame result and save student's attempt
//@ ACCESS Private (Basic)
router.get('/:classroomId/lesson/:lessonId/quizgame/result',
    [ValidateToken, ValidateMongooseID], async (req, res, next) => {

    const { classroomId, lessonId } = req.params;
    const { id, username } = req.user;

    try {
        const { data } = await service.GetQuizGameResult({ classroomId, lessonId, userId: id, username });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    };
});

//TODO: Add state of user done the quiz

//@ ROUTE  POST api/classroom/:classroomId/lesson/:lessonId/quizgame/result
//@ DESC   Save a quizgame result
//@ ACCESS Private (Basic)
router.post('/:classroomId/lesson/:lessonId/quizgame/result',
    [ValidateToken, ValidateMongooseID], async (req, res, next) => {

    const { classroomId, lessonId } = req.params;
    const { id, username } = req.user;
    const { result } = req.body;

    try {
        const { data } = await service.SaveQuizGameResult({ classroomId, lessonId, userId: id, username, result });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    };
});

module.exports = router;

