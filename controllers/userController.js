const User = require('../models/User'); 

const userController = {
    async getUserById(req, res) {
        try {
            const { userId } = req.params;
            const user = new User();
            const result = await user.getUserById(userId); 
    
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ message: 'Error getting user', err });
        }
    },
    async updateUserById(req, res){
        try{
            const {userId} = req.params;
            const {email, username, password} = req.body;
            const user = new User();

            if(req.file){
                const imagePath = `/uploads/profiles/${req.file.filename}`;
                await user.updateProfilePicture(userId, imagePath);
            }
            const result = await user.updateUserById(userId, email, username, password);
            if(!result){
                return res.status(400).json({message: 'Bad update request'});
            }
           res.status(200).json(result);
        }catch(err){
            res.status(500).json({ message: 'Error updating user', err });
        }
    },
    async deleteUserById(req, res){
        try{
            const {userId} = req.params;
            const user = new User();
            await user.deleteUserById(userId);
            res.status(200).json({ message: `User ${userId} was deleted successfully` });
        } catch(err){
            res.status(500).json({ message: 'Error deleting user', err });
        }
    }
};

module.exports = userController;