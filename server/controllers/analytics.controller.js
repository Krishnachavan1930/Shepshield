
const Patient = require('../models/Patient.model');
const mongoose = require('mongoose');

// Get general analytics
exports.getGeneralAnalytics = async (req, res, next) => {
  try {
    // Get total patient count
    const totalPatients = await Patient.countDocuments();
    
    // Get count by status
    const activePatients = await Patient.countDocuments({ status: 'Active' });
    const criticalPatients = await Patient.countDocuments({ status: 'Critical' });
    const dischargedPatients = await Patient.countDocuments({ status: 'Discharged' });
    
    // Get count by risk level
    const highRiskPatients = await Patient.countDocuments({ riskLevel: 'High' });
    const mediumRiskPatients = await Patient.countDocuments({ riskLevel: 'Medium' });
    const lowRiskPatients = await Patient.countDocuments({ riskLevel: 'Low' });
    
    // Calculate detection rate (simplified)
    const earlyDetection = Math.floor(totalPatients * 0.65); // 65% for demo
    
    res.status(200).json({
      success: true,
      data: {
        total: totalPatients,
        resolved: dischargedPatients,
        active: activePatients + criticalPatients,
        detectionRate: {
          earlyDetection,
          totalCases: totalPatients
        },
        patientOutcomes: {
          recovered: dischargedPatients,
          underTreatment: activePatients,
          critical: criticalPatients
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get monthly data
exports.getMonthlyData = async (req, res, next) => {
  try {
    // Get current year
    const currentYear = new Date().getFullYear();
    
    // Aggregate monthly data
    const monthlyData = await Patient.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          cases: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          month: {
            $arrayElemAt: [
              ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              { $subtract: ['$_id', 1] }
            ]
          },
          cases: 1
        }
      }
    ]);
    
    // Fill in missing months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const completeMonthlyData = months.map(month => {
      const found = monthlyData.find(data => data.month === month);
      return found || { month, cases: 0 };
    });
    
    res.status(200).json({
      success: true,
      data: completeMonthlyData
    });
  } catch (error) {
    next(error);
  }
};

// Get department data
exports.getDepartmentData = async (req, res, next) => {
  try {
    const departmentData = await Patient.aggregate([
      {
        $group: {
          _id: '$department',
          cases: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          department: '$_id',
          cases: 1
        }
      },
      {
        $sort: { cases: -1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: departmentData
    });
  } catch (error) {
    next(error);
  }
};

// Get detection rate
exports.getDetectionRate = async (req, res, next) => {
  try {
    // For a real app, this would be calculated based on actual detection times
    // Here we're using a simplified model
    const totalPatients = await Patient.countDocuments();
    const earlyDetection = Math.floor(totalPatients * 0.65); // 65% for demo
    
    res.status(200).json({
      success: true,
      data: {
        earlyDetection,
        totalCases: totalPatients
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get patient outcomes
exports.getPatientOutcomes = async (req, res, next) => {
  try {
    const dischargedPatients = await Patient.countDocuments({ status: 'Discharged' });
    const activePatients = await Patient.countDocuments({ status: 'Active' });
    const criticalPatients = await Patient.countDocuments({ status: 'Critical' });
    
    res.status(200).json({
      success: true,
      data: {
        recovered: dischargedPatients,
        underTreatment: activePatients,
        critical: criticalPatients
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get risk distribution
exports.getRiskDistribution = async (req, res, next) => {
  try {
    const riskData = await Patient.aggregate([
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          value: '$count'
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: riskData
    });
  } catch (error) {
    next(error);
  }
};
