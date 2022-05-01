const jsonwebtoken = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports.FormateData = (data) => {
    if(data){
        return {data}
    }else{
        throw new Error('No data found');
    }
};

module.exports.GenerateToken = (token) => {
    return jsonwebtoken.sign(token, process.env.JWT_SECRET || 'secret',{ expiresIn : '12h' });
};

module.exports.VerifyToken = (token) => {
    return jsonwebtoken.verify(token, process.env.JWT_SECRET || 'secret');
}

module.exports.ValidateSignature = (req) => {
    const signature = req.get('Authorization');

    try {

        if(signature){
            const decoded =  jsonwebtoken.verify(signature.split(' ')[1], process.env.JWT_SECRET || 'secret');
            req.user = decoded.user
            return true;
        }
        
        return false;
        
    } catch (error) {

        console.error(error);
        
    }

}
