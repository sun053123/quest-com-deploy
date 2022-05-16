const { Router } = require('express');
const { check } = require('express-validator');

const { ValidateToken } = require('../middlewares/Auth');
const { ValidateMongooseID, ValidatorErrorHelper } = require('../middlewares/validateHelper');
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
    
//@ ROUTE  POST api/classroom/:classroomId/lesson/:lessonId/quizgame/result
//@ DESC   GET a quizgame result (by quiz context (quizID in fetching) ) and save student's attempt 
//@ ACCESS Private (Basic)
router.post('/:classroomId/lesson/:lessonId/quizgame/result',[ValidateToken, ValidateMongooseID, ValidatorErrorHelper], async (req, res, next) => {
    
    const { quizIdSelected } = req.body;
    const { classroomId, lessonId } = req.params;
    const { id, username } = req.user;

    // console.log("quizIdSelectedId",quizIdSelected)

    try {

        const { data } = await service.GetQuizGameResult({ classroomId, lessonId, userId: id, quizIdSelected });
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
router.put('/:classroomId/lesson/:lessonId/quizgame/result',
    [ValidateToken, ValidateMongooseID], async (req, res, next) => {

    const { classroomId, lessonId } = req.params;
    const { id, username } = req.user;
    const { result, timeTaken, expgain, attempts, score } = req.body;

    // console.log(result, timeTaken, expgain, attempts, score)
    try {
        const { data } = await service.SaveQuizGameResult({ classroomId, lessonId, userId: id, username, result, timeTaken, expgain, attempts, score });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    };
});

//@GET api/classroom/:classroomId/lesson/:lessonId/quizgame/result/maxscore
//@DESC Get a user score of a quizgame
//@ACCESS Private (Basic)
router.get('/:classroomId/lesson/:lessonId/quizgame/result/maxscore',
    [ValidateToken, ValidateMongooseID], async (req, res, next) => {

    const { classroomId, lessonId } = req.params;
    const { id, username } = req.user;

    //TODO: get top 10 max user score in a single quizgame
    try {
        const { data } = await service.GetUserMaxScoreQuizGame({ classroomId, lessonId, userId: id, username });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    };
});

module.exports = router;