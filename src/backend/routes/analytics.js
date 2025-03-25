
const express = require('express');
const router = express.Router();

// Mock analytics data
const sepsisCases = {
  total: 125,
  resolved: 87,
  active: 38,
  monthly: [
    { month: 'Jan', cases: 8 },
    { month: 'Feb', cases: 10 },
    { month: 'Mar', cases: 12 },
    { month: 'Apr', cases: 15 },
    { month: 'May', cases: 9 },
    { month: 'Jun', cases: 12 },
    { month: 'Jul', cases: 14 },
    { month: 'Aug', cases: 16 },
    { month: 'Sep', cases: 18 },
    { month: 'Oct', cases: 11 },
    { month: 'Nov', cases: 0 },
    { month: 'Dec', cases: 0 }
  ],
  byDepartment: [
    { department: 'ICU', cases: 42 },
    { department: 'Emergency', cases: 35 },
    { department: 'General', cases: 28 },
    { department: 'Surgery', cases: 20 }
  ],
  detectionRate: {
    earlyDetection: 68,
    totalCases: 125
  },
  patientOutcomes: {
    recovered: 87,
    underTreatment: 30,
    critical: 8
  }
};

// Get general analytics
router.get('/', (req, res) => {
  res.json(sepsisCases);
});

// Get monthly data
router.get('/monthly', (req, res) => {
  res.json(sepsisCases.monthly);
});

// Get department data
router.get('/departments', (req, res) => {
  res.json(sepsisCases.byDepartment);
});

// Get detection rate
router.get('/detection-rate', (req, res) => {
  res.json(sepsisCases.detectionRate);
});

// Get patient outcomes
router.get('/outcomes', (req, res) => {
  res.json(sepsisCases.patientOutcomes);
});

module.exports = router;
