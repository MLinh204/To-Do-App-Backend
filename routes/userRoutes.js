const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const User = require('../models/User');
const {verifyToken} = require('../middleware/authMiddleware');

const user = new User();

router.get('/getUser/:userId', verifyToken, userController.getUserById);
router.put('/updateUser/:userId', verifyToken, (req, res, next) => {
  user.getUploadMiddleware()(req, res, (err) => {
      if (err) return res.status(400).json({ message: 'Error uploading profile picture', error: err });
      next();
  });
}, userController.updateUserById);
router.delete('/deleteUser/:userId', verifyToken, userController.deleteUserById);

module.exports = router;