const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports.ValidateSignature = (req) => {
    const signature = req.get('Authorization');

    try {

        if(signature){
            const decoded =  jwt.verify(signature.split(' ')[1], process.env.SECRET);
            req.user = decoded.user
            return true;
        }
        
        return false;
        
    } catch (error) {

        console.error(error);
        
    }

    
    
}