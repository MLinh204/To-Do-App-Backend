const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = '69653f408bdbe574b37cc4e81e3aba43ae6836bff77954e5b0d48f64c1bf3b42';

const authMiddleware = {
    async verifyToken(req, res, next){
        const token = req.headers['authorization'];
        if(!token){
            return res.status(403).json({message: 'Token is required'});
        }
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if(err){
                return res.status(401).json({message: 'Invalid token'});
            }
            req.userId = decoded.userId;
            next();
        });
    }
};

module.exports = authMiddleware;