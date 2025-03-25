
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctors.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Doctor routes - some are public, some are protected
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctor);

// Protected routes
router.use(authMiddleware.protect);
router.post('/', authMiddleware.restrictTo('admin'), doctorController.createDoctor);
router.put('/:id', authMiddleware.restrictTo('admin'), doctorController.updateDoctor);
router.delete('/:id', authMiddleware.restrictTo('admin'), doctorController.deleteDoctor);

module.exports = router;
