
const mongoose = require('mongoose');

const vitalSignsSchema = new mongoose.Schema({
  temperature: {
    type: Number,
    required: true
  },
  heartRate: {
    type: Number,
    required: true
  },
  respiratoryRate: {
    type: Number,
    required: true
  },
  bloodPressure: {
    type: String,
    required: true
  },
  oxygenSaturation: {
    type: Number,
    required: true
  },
  recordedAt: {
    type: Date,
    default: Date.now
  }
});

const labResultSchema = new mongoose.Schema({
  testType: {
    type: String,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  unit: String,
  normalRange: String,
  isAbnormal: Boolean,
  recordedAt: {
    type: Date,
    default: Date.now
  }
});

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Patient age is required']
  },
  gender: {
    type: String,
    required: [true, 'Patient gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  admissionDate: {
    type: Date,
    required: [true, 'Admission date is required']
  },
  department: {
    type: String,
    enum: ['ICU', 'Emergency', 'General Medicine', 'Cardiology', 'Neurology', 'Surgery', 'Pediatrics'],
    required: true
  },
  medicalRecordNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['Active', 'Discharged', 'Critical'],
    default: 'Active'
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  vitalSigns: [vitalSignsSchema],
  labResults: [labResultSchema],
  medicalHistory: {
    type: String,
    trim: true
  },
  allergies: {
    type: String,
    trim: true
  },
  medications: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Virtual for current vitals (most recent recording)
patientSchema.virtual('currentVitals').get(function() {
  if (this.vitalSigns && this.vitalSigns.length > 0) {
    return this.vitalSigns.sort((a, b) => b.recordedAt - a.recordedAt)[0];
  }
  return null;
});

// Update risk level based on risk score
patientSchema.pre('save', function(next) {
  if (this.riskScore >= 75) {
    this.riskLevel = 'High';
  } else if (this.riskScore >= 50) {
    this.riskLevel = 'Medium';
  } else {
    this.riskLevel = 'Low';
  }
  next();
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
