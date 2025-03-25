
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: '/placeholder.svg'
  },
  position: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  qualifications: [{
    type: String
  }],
  contactInfo: {
    email: String,
    phone: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
