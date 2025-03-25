
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware.protect, authController.getMe);
router.patch('/update-password', authMiddleware.protect, authController.updatePassword);
router.patch('/update-me', authMiddleware.protect, authController.updateMe);

module.exports = router;
