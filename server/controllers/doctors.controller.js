
const Doctor = require('../models/Doctor.model');

// Get all doctors
exports.getAllDoctors = async (req, res, next) => {
  try {
    // Build query with optional filters
    let query = {};
    
    if (req.query.specialty) {
      query.specialty = req.query.specialty;
    }
    
    // Execute query with pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    const doctors = await Doctor.find(query)
      .sort(req.query.sort || 'name')
      .skip(skip)
      .limit(limit);
      
    // Get total count for pagination
    const total = await Doctor.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

// Get single doctor
exports.getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// Create new doctor
exports.createDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.create(req.body);
    
    res.status(201).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// Update doctor
exports.updateDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
