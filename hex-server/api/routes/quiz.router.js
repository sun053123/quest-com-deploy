const { Router } = require('express');
const { check } = require('express-validator');

const { ValidateMongooseID, ValidatorErrorHelper } = require('../middlewares/validateHelper');
const { ValidateToken, ValidateTokenAndTeacher } = require('../middlewares/Auth');
const QuizService = require('../../services/quiz.service');

const router = Router();
const service = new QuizService();

//*** This section is operate for teacher (who created) only ****//

//@ ROUTE  POST api/classroom/:classroomId/lesson/:lessonId/quizcontrol
//@ DESC   Create a new quiz
//@ ACCESS Private (Teacher)
router.post('/:classroomId/lesson/:lessonId/quizcontrol', [
    [check('question').not().isEmpty().withMessage('Please enter a valid Question'),
    // check('type').isIn(['4q1a', '4qma', 'mqma', 'mq1a', 'other']).withMessage('Please enter a valid type'),
    check('explanation').not().isEmpty().withMessage('Please enter a valid explanation'),
    // check('options').isArray().withMessage('Please enter a valid options')
    check('options').not().isEmpty().withMessage('Please enter a valid options'),
    check('answer').not().isEmpty().withMessage('Please enter a valid answer'),
    //isnotin options
    check('answer').not().isIn(this.options).withMessage('Please enter a valid answer'),
    //custom
//    check('options').custom((value, { req }) => {
//     const checkArray = optionsArray.filter((item, index) => optionsArray.indexOf(item) !== index);
//         if (checkArray.length > 0) {
//             throw new Error('Please enter a valid options');
//         }
//         return true;
//     }
//     ).withMessage('Cannot have duplicate options'),
],
    ValidateTokenAndTeacher,ValidateMongooseID, ValidatorErrorHelper], async (req, res, next) => {

    const { classroomId, lessonId } = req.params;
    const { id } = req.user;
    const { question, questionImg, options, answer, explanation, type } = req.body;

    // console.log(question, options, answer, explanation, type);

    //object array to string array
    const optionsArray = options.map(option => option.questionoption);
        
    try {
        const { data } = await service.CreateNewQuiz({ classroomId, lessonId, userId:id, question, questionImg, options: optionsArray, answer, explanation, type:'mq1a' });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    };
});

//@ ROUTE  GET api/classroom/:classroomId/lesson/:lessonId/quizcontrol
//@ DESC   Get all quizzes
//@ ACCESS Private (Teacher)
router.get('/:classroomId/lesson/:lessonId/quizcontrol',
ValidateTokenAndTeacher ,ValidateMongooseID, async (req, res, next) => {

    const { classroomId, lessonId } = req.params;
    const { id } = req.user;
    const { username } = req.user;

    try {
        const { data } = await service.GetAllQuizzes({ classroomId, lessonId, userId: id, username });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    };
});

//@ ROUTE  GET api/classroom/:classroomId/lesson/:lessonId/quizcontrol/:quizId
//@ DESC   Get a quiz
//@ ACCESS Private (Teacher)
router.get('/:classroomId/lesson/:lessonId/quizcontrol/:quizId',
ValidateTokenAndTeacher ,ValidateMongooseID, async (req, res, next) => {

    const { classroomId, lessonId, quizId } = req.params;
    const { id } = req.user;

    try {
        const { data } = await service.GetSingleQuiz({ classroomId, lessonId, quizId, userId: id });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    };
});

//@ ROUTE  PUT api/classroom/:classroomId/lesson/:lessonId/quizcontrol/:quizId
//@ DESC   Update a quiz
//@ ACCESS Private (Teacher)
router.put('/:classroomId/lesson/:lessonId/quizcontrol/:quizId', [
    [check('question').not().isEmpty().withMessage('Please enter a valid Question'),
    check('type').isIn(['4q1a', '4qma', 'mqma', 'mq1a', 'other']).withMessage('Please enter a valid type'),
    check('explanation').not().isEmpty().withMessage('Please enter a valid explanation'),
    check('options').isArray().withMessage('Please enter a valid options')],
    ValidateTokenAndTeacher,ValidateMongooseID, ValidatorErrorHelper], async (req, res, next) => {

    const { classroomId, lessonId, quizId } = req.params;
    const { id, username } = req.user;
    const { question, type, explanation, options } = req.body;

    try {
        const { data } = await service.UpdateQuiz({ classroomId, lessonId, quizId, question, type, explanation, options, userId: id, username });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    };
});

//@ ROUTE  DELETE api/classroom/:classroomId/lesson/:lessonId/quizcontrol/:quizId
//@ DESC   Delete a quiz
//@ ACCESS Private (Teacher)
router.delete('/:classroomId/lesson/:lessonId/quizcontrol/:quizId',
    ValidateTokenAndTeacher ,ValidateMongooseID, async (req, res, next) => {

    const { classroomId, lessonId, quizId } = req.params;
    const { id } = req.user;

    try {
        const { data } = await service.DeleteQuiz({ classroomId, lessonId, quizId, userId: id });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    };
});

//@ ROUTE  PUT api/classroom/:classroomId/lesson/:lessonId/quizcontrol/
//@ DESC   Update a quiz contorl
//@ ACCESS Private (Teacher)
router.put('/:classroomId/lesson/:lessonId/quizcontrol', ValidateMongooseID, ValidateTokenAndTeacher, async (req, res, next) => {

    const { classroomId, lessonId } = req.params;
    const { id } = req.user;
    const { quizIsRandom, quizLimit } = req.body;

    console.log(quizIsRandom, quizLimit);

    try {
        const { data } = await service.UpdateQuizControl({ classroomId, lessonId, quizIsRandom, quizLimit, userId: id });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    };
});

//*** This section is operate for student (who take the quiz) only ****//

module.exports = router;

