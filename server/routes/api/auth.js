const express = require('express');
const router = express.Router();
const { ValidateToken, ValidateTokenAndTeacher } = require('../middlewares/auth');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const UserModel = require('../../model/User');


// @route   GET api/auth/
// @desc    Get user info
// @access  Private (basic)
router.get('/', ValidateToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: err.message
        })
    }
});

// @route   POST api/auth/
// @desc    Login a user
// @access  Public
router.post('/', [
    expressValidator.check('email').isEmail(),
    expressValidator.check('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = expressValidator.validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { email, password } = req.body;

    try {
        let user = await UserModel.findOne({ email });
        if(!user){
            return res.status(400).json({
                message: 'Invalid Credentials'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                message: 'Invalid Credentials'
            })
        }

        const payload = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        }

        const userWithoutPassword = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        }

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
            if(err){
                throw err;
            }
            res.json({
                token, ...userWithoutPassword
            })
        })
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: "server error"
        })
    }
});

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', [
    expressValidator.check('username', 'Name is required!').isLength({ min: 3 }),
    expressValidator.check('email', 'Enter Valid Email!').isEmail(),
    expressValidator.check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    expressValidator.check('role', 'Please choose a role').not().isEmpty()
], async (req, res) => {
    const errors = expressValidator.validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    try {

        let { username, email, password, role } = req.body;

        let user = await UserModel.findOne({ email });

        if(user){
            return res.status(400).json({
                message: 'User already exists'
            })
        }

        let uniquename = await UserModel.findOne({ username });

        if(uniquename){
            return res.status(400).json({
                message: 'Username already exists'
            })
        }

        if( role === "teacher"){
            role = true;
        }else{
            role = false;
        }

        user = new UserModel({
            username,
            email,
            password,
            role: role
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        }

        const userWithoutPassword = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        }

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
            if(err){
                throw err;
            }
            res.json({
                token, ...userWithoutPassword
            })
        })
        
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message
        })
    }
});
        
    
    
module.exports = router;