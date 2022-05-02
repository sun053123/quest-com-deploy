const { Router } = require('express');
const { check, validationResult } = require('express-validator');

const { ValidatorErrorHelper } = require('../middlewares/validateHelper');
const { ValidateToken } = require('../middlewares/Auth');
const AuthService = require('../../services/auth.service');

const router = Router();
const service = new AuthService();

//@ ROUTE  POST api/auth/register
//@ DESC   Register user
//@ ACCESS Public
router.post('/register', [[
    check('email').isEmail().withMessage('Please enter a valid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('username').not().isEmpty().withMessage('Please enter a valid username'),
    check('role').isIn(['teacher', 'student']).withMessage('Please enter a valid role')
], ValidatorErrorHelper], async (req, res, next) => {

    const { username, email, password, role } = req.body;

    try {
        const { data } = await service.RegisterUser({ email, username, password, role });

        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: 'Server error'
        });
    };
});

//@ ROUTE  POST api/auth/login
//@ DESC   Login user
//@ ACCESS Public
router.post('/', [[
    check('email').isEmail().withMessage('Please enter a valid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], ValidatorErrorHelper], async (req, res, next) => {

    const { email, password } = req.body;

    try {
        const { data } = await service.LoginUser({ email, password });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});

//@ ROUTE  GET api/auth/me
//@ DESC   Get user data
//@ ACCESS Private (Basic)
router.get('/', ValidateToken, async (req, res, next) => {

    try {
        const { email } = req.user;
        const { data } = await service.GetUser({ email });
        return res.status(data.status).json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;