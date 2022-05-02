const { ValidateSignature } = require('../../utils');
const HTTP_STATUS_CODES = require('../../utils/HTTPConstant');

module.exports.ValidateToken = async (req, res, next) => {

    const isAuthorized = await ValidateSignature(req);

    if(isAuthorized){
        return next();
    }
    else{
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
            error: [
                {
                    "msg": "Unauthorized, Token is require!",
                    "location": "Auth"
                }
            ],
            status: HTTP_STATUS_CODES.UNAUTHORIZED
        });
    }
};

module.exports.ValidateTokenAndTeacher = async (req, res, next) => {

    const isAuthorized = await ValidateSignature(req);

    if(isAuthorized){
        if(req.user.role == true){
            return next();
        }
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
            error: [
                {
                    "msg": "Unauthorized, Teacher Only!",
                    "location": "Role"
                }
            ],
            status: HTTP_STATUS_CODES.UNAUTHORIZED
        })
    }else{
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
            error: [
                {
                    "msg": "Unauthorized, Token is require!",
                    "location": "Auth"
                }
            ],
            status: HTTP_STATUS_CODES.UNAUTHORIZED
        })
    }
}

