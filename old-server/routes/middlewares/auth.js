const { ValidateSignature } = require('../../utils');

module.exports.ValidateToken = async (req, res, next) => {

    const isAuthorized = await ValidateSignature(req);

    if(isAuthorized){
        return next();
    }
    else{
        res.status(401).json({
            message: 'Unauthorized'
        })
    }
};

module.exports.ValidateTokenAndTeacher = async (req, res, next) => {

    const isAuthorized = await ValidateSignature(req);

    if(isAuthorized){
        if(req.user.role == true){
            return next();
        }
        res.status(401).json({
            message: 'Cannot Access ( Teacher only )'
        })
    }else{
        res.status(401).json({
            message: 'Unauthorized'
        })
    }
};

