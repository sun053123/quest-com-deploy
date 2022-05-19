const { Router } = require('express');
const { check } = require('express-validator');

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
    check('content').not().isEmpty().withMessage('Please enter a valid description'),], 
    ValidateTokenAndTeacher, ValidateMongooseID, ValidatorErrorHelper ], async (req, res, next) => {

    const { title, content, lessonImg, pdfFile, isShowLessonImg } = req.body;
    const { id, username } = req.user;
    const { classroomId } = req.params;
    
    try {
        const { data } = await service.CreateLesson({ title, content, classroomId, userId: id, username, lessonImg,isShowLessonImg, lessonFile:pdfFile });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    };
});

//@ ROUTE  GET api/classroom/:classroomId/lesson
//@ DESC   Get all lessons of a classroom
//@ ACCESS Private (Basic)
router.get('/:classroomId/lesson', [ValidateToken, ValidateMongooseID], async (req, res, next) => {

    const { classroomId } = req.params;

    try {
        const { data } = await service.GetLessons({ classroomId });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    };
});

//@ ROUTE  GET api/classroom/:classroomId/lesson/:lessonId
//@ DESC   Get a single lesson
//@ ACCESS Private (Basic)
router.get('/:classroomId/lesson/:lessonId', [ValidateToken, ValidateMongooseID], async (req, res, next) => {

    const { lessonId, classroomId } = req.params;

    try {
        const { data } = await service.GetSingleLesson({ lessonId, classroomId });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    };
});

//@ ROUTE  PUT api/classroom/:classroomId/lesson/:lessonId
//@ DESC   Update a lesson
//@ ACCESS Private (Teacher)
router.put('/:classroomId/lesson/:lessonId', [
    [check('title').not().isEmpty().withMessage('Please enter a valid Title'),
    check('content').not().isEmpty().withMessage('Please enter a valid description'),],
    ValidateTokenAndTeacher, ValidateMongooseID, ValidatorErrorHelper], async (req, res, next) => {

        const { classroomId, lessonId } = req.params;
        const { title, content, lessonImg, pdfFile, isShowLessonImg } = req.body;
        const { id, username } = req.user;


        try {
            const { data } = await service.UpdateLesson({ userId: id, classroomId, lessonId, title, content, lessonImg, isShowLessonImg, lessonFile: pdfFile });
            return res.status(data.status).json(data);
        } catch (err) {
            console.error(err);
            next(err);
        };
});

//@ ROUTE  PUT api/classroom/:classroomId/lesson/:lessonId/quizcontroller/panel
//@ DESC   Update a lesson
//@ ACCESS Private (Teacher)
router.put('/:classroomId/lesson/:lessonId/quizcontroller/panel', [
    ValidateTokenAndTeacher, ValidateMongooseID], async (req, res, next) => {
    const { classroomId, lessonId } = req.params;
    const { quizIsReday, quizIsRandom, quizLimit } = req.body;
    const { id } = req.user;

    try {
        const { data } = await service.EditQuizController({ userId: id, classroomId, lessonId, quizIsReday, quizIsRandom, quizLimit });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    };
});

//@ ROUTE  DELETE api/classroom/:classroomId/lesson/:lessonId
//@ DESC   Delete a lesson
//@ ACCESS Private (Teacher)
router.delete('/:classroomId/lesson/:lessonId', [ValidateTokenAndTeacher, ValidateMongooseID], async (req, res, next) => {

    const { lessonId, classroomId } = req.params;
    const { id } = req.user;

    try {
        const { data } = await service.DeleteLesson({ userId:id, lessonId, classroomId });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    };
});

//@ ROUTE PUT api/classroom/:classroomId/lesson/:lessonId/like
//@ DESC   Like a lesson
//@ ACCESS Private (Basic)
router.put('/:classroomId/lesson/:lessonId/like', [ValidateToken, ValidateMongooseID], async (req, res, next) => {

    const { lessonId, classroomId } = req.params;
    const { id } = req.user;

    try {
        const { data } = await service.LikeLesson({ userId: id, lessonId, classroomId });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    };
});

//@ ROUTE POST api/classroom/:classroomId/lesson/:lessonId/comment
//@ DESC   Comment on a lesson
//@ ACCESS Private (Basic)
router.post('/:classroomId/lesson/:lessonId/comment', [
    [check('comment').not().isEmpty().withMessage('Please enter a valid comment'),
    check('comment').isLength({ min: 1 }).withMessage('Comment must be at least 5 characters long')]
    ,ValidateToken, ValidateMongooseID, ValidatorErrorHelper], async (req, res, next) => {

    const { lessonId, classroomId } = req.params;
    const { id, username } = req.user;
    const { comment } = req.body;

    try {
        const { data } = await service.CreateCommentLesson({ userId: id, lessonId, classroomId, comment, username });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    };
});

//@ ROUTE DELETE api/classroom/:classroomId/lesson/:lessonId/comment/:commentId
//@ DESC   Delete a comment
//@ ACCESS Private (Basic)
router.delete('/:classroomId/lesson/:lessonId/comment/:commentId', [ValidateToken, ValidateMongooseID], async (req, res, next) => {

    const { lessonId, classroomId, commentId } = req.params;
    const { id } = req.user;

    try {
        const { data } = await service.DeleteCommentLesson({ userId: id, lessonId, classroomId, commentId });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    };
});

//@ ROUTE  PUT api/classroom/:classroomId/lesson/:lessonId/comment/:commentId/like
//@ DESC   Like a comment
//@ ACCESS Private (Basic)
router.put('/:classroomId/lesson/:lessonId/comment/:commentId/like', [ValidateToken, ValidateMongooseID], async (req, res, next) => {

    const { lessonId, classroomId, commentId } = req.params;
    const { id } = req.user;

    try {
        const { data } = await service.LikeCommentLesson({ userId: id, lessonId, classroomId, commentId });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    };
});

//@ ROUTE GET api/classroom/:classroomId/lesson/:lessonId/comment
//@ DESC   Get all comments on a lesson
//@ ACCESS Private (Basic)
router.get('/:classroomId/lesson/:lessonId/comment', [ValidateToken, ValidateMongooseID], async (req, res, next) => {

    const { lessonId, classroomId } = req.params;
    const { id } = req.user;

    try {
        const { data } = await service.GetCommentLesson({ userId: id, lessonId, classroomId });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    };
});

//@ ROUTE PATCH api/classroom/:classroomId/lesson/:lessonId/pdffile
//@ DESC   Upload a pdf file
//@ ACCESS Private (Teacher)
router.patch('/:classroomId/lesson/:lessonId/pdffile', [ValidateTokenAndTeacher, ValidateMongooseID], async (req, res, next) => {

    const { lessonId, classroomId } = req.params;
    const { id } = req.user;
    const { file } = req.files;

    try {
        const { data } = await service.UploadPdf({ userId: id, lessonId, classroomId, pdfFile: file });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    };
});

//@ ROUTE PUT api/classroom/:classroomId/lesson/:lessonId/pdffile
//@ DESC   update a pdf file
//@ ACCESS Private (Teacher)
router.put('/:classroomId/lesson/:lessonId/pdffile', [ValidateTokenAndTeacher, ValidateMongooseID], async (req, res, next) => {

    const { lessonId, classroomId } = req.params;
    const { id } = req.user;
    const { file } = req.files;

    try {
        const { data } = await service.UpdatePdf({ userId: id, lessonId, classroomId, pdfFile: file });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        next(err);
    };
});

module.exports = router;

