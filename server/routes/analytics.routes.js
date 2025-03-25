
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all analytics routes
router.use(authMiddleware.protect);

// Analytics routes
router.get('/', analyticsController.getGeneralAnalytics);
router.get('/monthly', analyticsController.getMonthlyData);
router.get('/departments', analyticsController.getDepartmentData);
router.get('/detection-rate', analyticsController.getDetectionRate);
router.get('/outcomes', analyticsController.getPatientOutcomes);
router.get('/risk-distribution', analyticsController.getRiskDistribution);

module.exports = router;
