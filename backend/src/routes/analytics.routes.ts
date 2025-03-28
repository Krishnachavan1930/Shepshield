import express from "express";

const router = express.Router();
import {protect}from "../middleware/auth.middleware";
import { getDepartmentData, getDetectionRate, getGeneralAnalytics, getMonthlyData, getPatientOutcomes, getRiskDistribution } from "../controllers/analytics.controller";

router.use(protect);

router.get('/', getGeneralAnalytics);
router.get('/monthly', getMonthlyData);
router.get('/departments', getDepartmentData);
router.get('/detection-rate', getDetectionRate);
router.get('/outcomes', getPatientOutcomes);
router.get('/risk-distribution', getRiskDistribution);

export default router;
