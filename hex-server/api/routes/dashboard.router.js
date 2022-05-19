const { Router } = require('express');

const { ValidateToken } = require('../middlewares/Auth');
const { ValidateMongooseID } = require('../middlewares/validateHelper');
const DashBoardService = require('../../services/dashboard.service');

const router = Router();
const service = new DashBoardService()

//@ ROUTE  GET api/classroom/:classroomId/dashboard/maxscoreuser
//@ DESC   Get max score user of a quizgame
//@ ACCESS Private (Teacher)
router.get('/:classroomId/dashboard', [ValidateToken, ValidateMongooseID], async (req, res, next) => {
    const { classroomId } = req.params;
    const { id, username, role } = req.user;

    try {
        const { data } = await service.DashBoardClassroom({ classroomId, userId: id, username, role });
        return res.status(data.status).json(data);
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;

