const jwtSecret = '69653f408bdbe574b37cc4e81e3aba43ae6836bff77954e5b0d48f64c1bf3b42';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const authController = {
    async register(req, res){
        try{
            const {email, username, password} = req.body;
            const user = new User();
            const existingUser = await user.getUserByEmail(email);
            if(existingUser){
                return res.status(400).json({message: 'User with this email already exists'});
            }
            const userId = await user.createUser(email, username, password);
            res.status(200).json({userId});
        }catch(err){
            console.error(err);
            res.status(500).json({message: 'Error registering user', err});
        }
    },
    async login(req, res){
        try{
            const {email, password} = req.body;
            const user = new User();
            const dbUser = await user.getUserByEmail(email);
            if(!dbUser){
                return res.status(400).json({message: 'User not found'});
            }
            const match = await bcrypt.compare(password, dbUser.password);
            if(!match){
                return res.status(400).json({message: 'Wrong password. Please try again!'});
            }
            const token = jwt.sign({userId: dbUser.userId}, jwtSecret, {expiresIn: '24h'});
            res.status(200).json({token});
        } catch(err){
            console.error(err);
            res.status(500).json({message: 'Error logging in', err});
        }
    },
    logout(req, res){
        res.json({ message: 'Logged out successfully' });
    },
    async updateProfile(req, res){
        try{
            const userId = req.userId;
            const user = new User();
             
        }catch(err){

        }
    }
}

module.exports = authController;