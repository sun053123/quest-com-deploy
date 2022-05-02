const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

module.exports.ValidatorErrorHelper = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: errors.array(),
            status: 400
        });
    } else {
        return next();
    }   
};

module.exports.ValidateMongooseID = async (req, res, next) => {
    //object req.params to array
    const params = Object.values(req.params);
    // console.log(params)
    //loop through array
    for (let i = 0; i < params.length; i++) {
        //check if mongoose id
        if (!mongoose.Types.ObjectId.isValid(params[i])) {
            return res.status(400).json({
                error: 'Please enter a valid ID',
                status: 400
            });
        }
    }
    return next();
};
    