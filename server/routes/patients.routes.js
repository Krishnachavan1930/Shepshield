
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patients.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all patient routes
router.use(authMiddleware.protect);

// Patient routes
router.route('/')
  .get(patientController.getAllPatients)
  .post(patientController.createPatient);

router.route('/:id')
  .get(patientController.getPatient)
  .put(patientController.updatePatient)
  .delete(authMiddleware.restrictTo('admin', 'doctor'), patientController.deletePatient);

// Routes for vital signs
router.route('/:id/vitals')
  .get(patientController.getPatientVitals)
  .post(patientController.addVitalSigns);

// Routes for lab results
router.route('/:id/labs')
  .get(patientController.getPatientLabs)
  .post(patientController.addLabResults);

module.exports = router;
