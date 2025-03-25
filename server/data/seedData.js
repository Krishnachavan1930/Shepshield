
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User.model');
const Patient = require('../models/Patient.model');
const Doctor = require('../models/Doctor.model');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected for seeding data');
  seedData();
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Doctor.deleteMany({});

    console.log('Previous data cleared');

    // Create admin user
    const adminPassword = await bcrypt.hash('password123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      department: 'ICU'
    });

    // Create doctor users
    const doctorPassword = await bcrypt.hash('password123', 12);
    const doctor1 = await User.create({
      name: 'Dr. John Smith',
      email: 'doctor@example.com',
      password: doctorPassword,
      role: 'doctor',
      department: 'ICU'
    });

    const doctor2 = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'sarah@example.com',
      password: doctorPassword,
      role: 'doctor',
      department: 'Emergency'
    });

    // Create nurse user
    const nursePassword = await bcrypt.hash('password123', 12);
    const nurse = await User.create({
      name: 'Nurse Emily',
      email: 'nurse@example.com',
      password: nursePassword,
      role: 'nurse',
      department: 'ICU'
    });

    // Create doctor profiles
    const doctorProfile1 = await Doctor.create({
      name: 'Dr. John Smith',
      specialty: 'Critical Care',
      bio: 'Board-certified intensivist with over 10 years of experience in critical care medicine.',
      position: 'Senior Intensivist',
      experience: 10,
      qualifications: ['MD', 'Board Certified in Critical Care', 'Fellowship in Pulmonary Medicine'],
      contactInfo: {
        email: 'doctor@example.com',
        phone: '555-123-4567'
      },
      userId: doctor1._id
    });

    const doctorProfile2 = await Doctor.create({
      name: 'Dr. Sarah Johnson',
      specialty: 'Emergency Medicine',
      bio: 'Emergency medicine specialist with expertise in early sepsis recognition and management.',
      position: 'Emergency Department Head',
      experience: 8,
      qualifications: ['MD', 'Board Certified in Emergency Medicine'],
      contactInfo: {
        email: 'sarah@example.com',
        phone: '555-987-6543'
      },
      userId: doctor2._id
    });

    // Create sample patients
    const patients = [];

    // Function to generate random vital signs
    const generateVitalSigns = (baseline = {}) => {
      const defaultValues = {
        temperature: 37,
        heartRate: 80,
        respiratoryRate: 16,
        oxygenSaturation: 98
      };

      const values = { ...defaultValues, ...baseline };
      
      // Generate random variations
      return {
        temperature: Math.round((values.temperature + (Math.random() * 2 - 1)) * 10) / 10,
        heartRate: Math.floor(values.heartRate + (Math.random() * 20 - 10)),
        respiratoryRate: Math.floor(values.respiratoryRate + (Math.random() * 6 - 3)),
        bloodPressure: `${Math.floor(120 + (Math.random() * 30 - 15))}/${Math.floor(80 + (Math.random() * 20 - 10))}`,
        oxygenSaturation: Math.min(100, Math.floor(values.oxygenSaturation + (Math.random() * 4 - 2))),
        recordedAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 5)) // Random time in last 5 days
      };
    };

    // Create different types of patients
    const patientTypes = [
      {
        status: 'Active',
        riskLevel: 'Low',
        vitalBaseline: { temperature: 36.8, heartRate: 75, respiratoryRate: 15, oxygenSaturation: 98 },
        count: 15
      },
      {
        status: 'Active',
        riskLevel: 'Medium',
        vitalBaseline: { temperature: 37.5, heartRate: 90, respiratoryRate: 19, oxygenSaturation: 96 },
        count: 8
      },
      {
        status: 'Critical',
        riskLevel: 'High',
        vitalBaseline: { temperature: 38.5, heartRate: 110, respiratoryRate: 24, oxygenSaturation: 92 },
        count: 4
      },
      {
        status: 'Discharged',
        riskLevel: 'Low',
        vitalBaseline: { temperature: 36.9, heartRate: 78, respiratoryRate: 16, oxygenSaturation: 99 },
        count: 10
      }
    ];

    // Generate names
    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Susan', 'Richard', 'Jessica', 'Joseph', 'Sarah', 'Thomas', 'Karen', 'Charles', 'Nancy'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson'];

    // Medical record number generator
    const generateMRN = () => {
      return `MRN${Math.floor(100000 + Math.random() * 900000)}`;
    };

    // Generate patients for each type
    let patientId = 1;
    for (const type of patientTypes) {
      for (let i = 0; i < type.count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${firstName} ${lastName}`;
        
        // Calculate admission date based on status
        let admissionDate;
        if (type.status === 'Discharged') {
          // Discharged patients were admitted 10-30 days ago
          admissionDate = new Date();
          admissionDate.setDate(admissionDate.getDate() - (10 + Math.floor(Math.random() * 20)));
        } else {
          // Active/Critical patients were admitted 1-10 days ago
          admissionDate = new Date();
          admissionDate.setDate(admissionDate.getDate() - (1 + Math.floor(Math.random() * 9)));
        }
        
        // Determine department
        const departments = ['ICU', 'Emergency', 'General Medicine', 'Cardiology', 'Neurology', 'Surgery'];
        const department = departments[Math.floor(Math.random() * departments.length)];
        
        // Calculate risk score based on risk level
        let riskScore;
        if (type.riskLevel === 'Low') {
          riskScore = 20 + Math.floor(Math.random() * 30);
        } else if (type.riskLevel === 'Medium') {
          riskScore = 50 + Math.floor(Math.random() * 25);
        } else {
          riskScore = 75 + Math.floor(Math.random() * 25);
        }
        
        // Generate multiple vital sign records
        const vitalSignsCount = 3 + Math.floor(Math.random() * 5); // 3-7 records
        const vitalSigns = [];
        
        for (let j = 0; j < vitalSignsCount; j++) {
          vitalSigns.push(generateVitalSigns(type.vitalBaseline));
        }
        
        // Generate lab results
        const labResultTypes = [
          { testType: 'WBC Count', unit: 'K/µL', normalRange: '4.5-11.0' },
          { testType: 'Lactate', unit: 'mmol/L', normalRange: '0.5-2.2' },
          { testType: 'CRP', unit: 'mg/L', normalRange: '<10' },
          { testType: 'Procalcitonin', unit: 'ng/mL', normalRange: '<0.15' },
          { testType: 'Blood Culture', unit: '', normalRange: 'Negative' }
        ];
        
        const labResults = [];
        
        for (const lab of labResultTypes) {
          // Determine if this is abnormal based on risk level
          const isAbnormal = Math.random() < (type.riskLevel === 'High' ? 0.8 : type.riskLevel === 'Medium' ? 0.4 : 0.1);
          
          let value;
          if (lab.testType === 'WBC Count') {
            value = isAbnormal ? 
              (Math.random() < 0.5 ? 2 + Math.random() * 2 : 11 + Math.random() * 5).toFixed(1) : 
              (4.5 + Math.random() * 6.5).toFixed(1);
          } else if (lab.testType === 'Lactate') {
            value = isAbnormal ? 
              (2.2 + Math.random() * 3).toFixed(1) : 
              (0.5 + Math.random() * 1.7).toFixed(1);
          } else if (lab.testType === 'CRP') {
            value = isAbnormal ? 
              (10 + Math.random() * 190).toFixed(1) : 
              (Math.random() * 10).toFixed(1);
          } else if (lab.testType === 'Procalcitonin') {
            value = isAbnormal ? 
              (0.15 + Math.random() * 9.85).toFixed(2) : 
              (Math.random() * 0.15).toFixed(2);
          } else if (lab.testType === 'Blood Culture') {
            value = isAbnormal ? 'Positive' : 'Negative';
          }
          
          labResults.push({
            testType: lab.testType,
            value,
            unit: lab.unit,
            normalRange: lab.normalRange,
            isAbnormal,
            recordedAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 3)) // Random time in last 3 days
          });
        }
        
        // Create the patient
        const patient = {
          name,
          age: 30 + Math.floor(Math.random() * 50), // 30-80 years old
          gender: Math.random() > 0.5 ? 'Male' : 'Female',
          admissionDate,
          department,
          medicalRecordNumber: generateMRN(),
          status: type.status,
          riskScore,
          riskLevel: type.riskLevel,
          vitalSigns,
          labResults,
          medicalHistory: `Patient ${patientId} medical history`,
          allergies: Math.random() > 0.7 ? 'Penicillin' : (Math.random() > 0.5 ? 'No known allergies' : 'Sulfa drugs'),
          medications: 'Standard medication regimen',
          notes: `Notes for patient ${patientId}`,
          assignedDoctor: Math.random() > 0.5 ? doctor1._id : doctor2._id
        };
        
        patients.push(patient);
        patientId++;
      }
    }
    
    // Insert all patients
    await Patient.insertMany(patients);
    
    console.log(`Seeded ${patients.length} patients`);
    console.log('Seeded 2 doctors');
    console.log('Seeded 3 users (admin, doctor, nurse)');
    console.log('Database seeding completed successfully!');

    // Disconnect from database
    mongoose.disconnect();
    
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};
