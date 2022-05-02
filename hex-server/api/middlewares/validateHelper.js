const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

const HTTP_STATUS_CODES = require('../../utils/HTTPConstant');


module.exports.ValidatorErrorHelper = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
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
            return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
                error: 'Please enter a valid ID',
                status: 400
            });
        }
    }
    return next();
};
    