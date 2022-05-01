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
const DashboardModel = require('../../model/Dashboard');
const LessonModel = require('../../model/Lesson');


// @route   POST api/classroom/
// @desc    Create a classroom
// @access  Private (teacher)
router.post('/', [ValidateTokenAndTeacher,
[
    expressValidator.check('title').isLength({ min: 6 }),
    expressValidator.check('description').isLength({ min: 6 }),
    expressValidator.check('category').isIn(['Math', 'Science', 'English', 'Society', 'Computer'])
    
]], async (req, res) => {
    const errors = expressValidator.validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { title, description, tags, category } = req.body;

    if(tags){
        splittags = tags.split(',').map(tag => tag.trim());
    }

    try {

        let ClassroomFields = {};
        ClassroomFields.title = title;
        ClassroomFields.description = description;
        ClassroomFields.tags = splittags;
        ClassroomFields.category = category;

        ClassroomFields.creator = {}

        ClassroomFields.creator.user = req.user.id;
        ClassroomFields.creator.name = req.user.username;

        // console.log(ClassroomFields);


        const newClassroom = new ClassroomModel(ClassroomFields);
        await newClassroom.save();

        const DashboardFields = {};
        DashboardFields.classroom = newClassroom._id;
        DashboardFields.user = req.user.id;

        const newDashboard = new DashboardModel(DashboardFields);
        await newDashboard.save();

        return res.status(201).json({
            message: 'Classroom created successfully',
            classroom: newClassroom,
            dashboard: newDashboard
        })

        
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: err.message
        })
    }
});

// @route   Put api/classroom/:id
// @desc    Update a classroom
// @access  Private (teacher)
router.put('/:classroomId', [ValidateTokenAndTeacher,
[
    expressValidator.check('title').isLength({ min: 1 }),
    expressValidator.check('description').isLength({ min: 1 }),
    expressValidator.check('category').not().isEmpty()
]
], async (req, res) => {
    const errors = expressValidator.validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { classroomId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(classroomId)) {
        return res.status(400).json({
            message: 'Invalid ID'
        });
    }

    const { title, description, tags, category } = req.body;

    try {
        const classroom = await ClassroomModel.findById(classroomId);
        if(!classroom){
            return res.status(404).json({
                message: 'Classroom not found'
            })
        }

        if(classroom.creator.user.toString() !== req.user.id){
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }

        if(tags) splittags = tags.split(',').map(tag => tag.trim());


        if(title) classroom.title = title;
        if(description) classroom.description = description;
        if(tags) classroom.tags = splittags;
        if(category) classroom.category = category;
        classroom.updatedAt = Date.now();

        await classroom.save();


        res.json(classroom);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        })
    }
    });


// @route   GET api/classroom/
// @desc    Get all classrooms
// @access  Public
router.get('/', async (req, res) => {
    try {
        const classrooms = await ClassroomModel.find({isComplete : true}).sort({ createdAt: -1 });
        // const classrooms = await ClassroomModel.find().sort({ createdAt: -1 });

        res.json(classrooms);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/classroom/:id
// @desc    Get a classroom
// @access  Private (basic)
router.get('/:classroomId', ValidateToken, async (req, res) => {
    const { classroomId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(classroomId)) {
        return res.status(400).json({
            message: 'Invalid ID'
        });
    }

    try {
        const classroom = await ClassroomModel.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({
                message: 'Classroom not found'
            });
        }

        const dashboard = await DashboardModel.findOne({ classroom: classroomId });


        const lesson = await LessonModel.find({ classroom: classroomId }).sort({ createdAt: -1 });

        return res.json({
            classroom,
            dashboard,
            lesson
        });

    }catch(err){
        console.error(err);
        res.status(500).json({
            message: err.message
        })
    }
});

// @route   Delete api/classroom/:classroomId 
// @desc    Delete a classroom
// @access  Private (teacher)
router.delete('/:classroomId', [ValidateTokenAndTeacher], async (req, res) => {
    const { classroomId } = req.params;

    if(!mongoose.Types.ObjectId.isValid(classroomId)) {
        return res.status(400).json({
            message: 'Invalid ID'
        });
    }

    try {
        const classroom = await ClassroomModel.findById(classroomId);
        if (!classroom) {
            return res.status(404).json({
                message: 'Classroom not found'
            });
        }

        if(classroom.creator.user.toString() !== req.user.id){
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }

        await ClassroomModel.deleteMany({ _id: classroomId }); 

        return res.json({
            message: 'Classroom removed'
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            message: err.message
        })
    }
});


module.exports = router;