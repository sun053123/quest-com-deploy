const express = require('express');
const router = express.Router();
const { ValidateToken, ValidateTokenAndTeacher } = require('../middlewares/auth');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ClassroomModel = require('../../model/Classroom');
const UserModel = require('../../model/User');
const mongoose = require('mongoose');
const Dashboard = require('../../model/Dashboard');

// @route   POST api/profile/:userID
// @desc    Get user profile
// @access  Private
router.get('/:userID', ValidateToken, async (req, res) => {
    const { userID } = req.params;

    if(!mongoose.Types.ObjectId.isValid(userID)) {
        return res.status(400).json({
            message: 'Invalid ID'
        });
    }

    try {
        const user = await UserModel.findById(userID);

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});