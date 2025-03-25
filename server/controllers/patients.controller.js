
const Patient = require('../models/Patient.model');

// Get all patients (with filtering, sorting, and pagination)
exports.getAllPatients = async (req, res, next) => {
  try {
    // Build query
    let query = {};
    
    // Filtering
    if (req.query.status) query.status = req.query.status;
    if (req.query.riskLevel) query.riskLevel = req.query.riskLevel;
    if (req.query.department) query.department = req.query.department;
    if (req.query.search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { medicalRecordNumber: { $regex: req.query.search, $options: 'i' } }
        ]
      };
    }
    
    // Execute query with pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    const patients = await Patient.find(query)
      .populate('assignedDoctor', 'name department')
      .sort(req.query.sort || '-createdAt')
      .skip(skip)
      .limit(limit);
      
    // Get total count for pagination
    const total = await Patient.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: patients.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

// Get single patient
exports.getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate('assignedDoctor', 'name department');
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// Create new patient
exports.createPatient = async (req, res, next) => {
  try {
    // Calculate risk score if not provided
    if (!req.body.riskScore && req.body.vitalSigns) {
      req.body.riskScore = calculateRiskScore(req.body.vitalSigns);
    }
    
    // Create patient
    const patient = await Patient.create(req.body);
    
    res.status(201).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// Update patient
exports.updatePatient = async (req, res, next) => {
  try {
    // Recalculate risk score if vital signs are updated
    if (req.body.vitalSigns && !req.body.riskScore) {
      req.body.riskScore = calculateRiskScore(req.body.vitalSigns);
    }
    
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// Delete patient
exports.deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get patient's vital signs
exports.getPatientVitals = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      count: patient.vitalSigns.length,
      data: patient.vitalSigns
    });
  } catch (error) {
    next(error);
  }
};

// Add vital signs to patient
exports.addVitalSigns = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Add new vital signs
    patient.vitalSigns.push(req.body);
    
    // Update risk score based on new vitals
    patient.riskScore = calculateRiskScore(req.body);
    
    await patient.save();
    
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// Get patient's lab results
exports.getPatientLabs = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      count: patient.labResults.length,
      data: patient.labResults
    });
  } catch (error) {
    next(error);
  }
};

// Add lab results to patient
exports.addLabResults = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    
    // Add new lab results
    patient.labResults.push(req.body);
    await patient.save();
    
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate risk score based on vital signs
const calculateRiskScore = (vitalSigns) => {
  let score = 30; // baseline
  
  // Temperature factor
  if (vitalSigns.temperature > 38.5) score += 20;
  else if (vitalSigns.temperature > 38.0) score += 10;
  
  // Heart rate factor
  if (vitalSigns.heartRate > 100) score += 20;
  else if (vitalSigns.heartRate > 90) score += 10;
  
  // Respiratory rate factor
  if (vitalSigns.respiratoryRate > 22) score += 20;
  else if (vitalSigns.respiratoryRate > 20) score += 10;
  
  // Oxygen saturation factor
  if (vitalSigns.oxygenSaturation < 92) score += 20;
  else if (vitalSigns.oxygenSaturation < 95) score += 10;
  
  return Math.min(score, 100); // Cap at 100
};
