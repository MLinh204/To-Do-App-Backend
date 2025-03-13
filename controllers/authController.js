const jwtSecret = '69653f408bdbe574b37cc4e81e3aba43ae6836bff77954e5b0d48f64c1bf3b42';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const authController = {
  async register(req, res) {
    try {
      const { email, username, password } = req.body;
      const user = new User();
      const existingUser = await user.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      const userId = await user.createUser(email, username, password);
      res.status(200).json({ userId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error registering user', err });
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = new User();
      const dbUser = await user.getUserByEmail(email);
      console.log("User from database:", dbUser);
      if (!dbUser) {
        return res.status(400).json({ message: 'User not found' });
      }
      const match = await bcrypt.compare(password, dbUser.password);
      if (!match) {
        return res.status(400).json({ message: 'Wrong password. Please try again!' });
      }
      const token = jwt.sign({
        id: dbUser.id,         
        username: dbUser.username,
        email: dbUser.email,
        password: dbUser.password,
        profilePicture: dbUser.profile_picture,
      }, jwtSecret, { expiresIn: '24h' });
      res.status(200).json({ token, user: dbUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error logging in', err });
    }
  },
  logout(req, res) {
    res.json({ message: 'Logged out successfully' });
  },
  async updateProfile(req, res) {
    try {
      const userId = req.params.userId;
      const user = new User();

      const { username, email } = req.body;
      let profilePicture = null;

      if (req.file) {
        profilePicture = `/uploads/profiles/${req.file.filename}`;
        await user.updateProfilePicture(userId, profilePicture);
      }

      if (username || email) {
        const updateQuery = [];
        const updateValues = [];

        if (username) {
          updateQuery.push('username = ?');
          updateValues.push(username);
        }
        if (email) {
          updateQuery.push('email = ?');
          updateValues.push(email);
        }

        updateValues.push(userId);
        await user.pool.query(`UPDATE users SET ${updateQuery.join(', ')} WHERE id = ?`, updateValues);
      }

      const updatedUser = await user.getUserById(userId);
      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating user', err });
    }
  },
  async refreshToken(req, res) {
    try {
        const userId = req.user.id;
        const user = new User();
        const dbUser = await user.getUserById(userId);
        
        const newToken = jwt.sign({
            id: dbUser.id,         
            username: dbUser.username,
            email: dbUser.email,
            profilePicture: dbUser.profile_picture,
        }, jwtSecret, { expiresIn: '24h' });
        
        res.status(200).json({ token: newToken });
    } catch (err) {
        res.status(500).json({ message: 'Error refreshing token' });
    }
  },
}

module.exports = authController;