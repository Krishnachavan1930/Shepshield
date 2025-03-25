
const express = require('express');
const router = express.Router();

// Mock data for demonstration
const patients = [
  { 
    id: 1, 
    name: 'Jane Smith', 
    age: 45, 
    gender: 'Female',
    admissionDate: '2023-09-15',
    status: 'Moderate',
    riskScore: 65,
    vitalSigns: {
      temperature: 38.2,
      heartRate: 92,
      respiratoryRate: 20,
      bloodPressure: '130/85',
      oxygenSaturation: 94
    }
  },
  { 
    id: 2, 
    name: 'John Doe', 
    age: 62, 
    gender: 'Male',
    admissionDate: '2023-09-12',
    status: 'Severe',
    riskScore: 85,
    vitalSigns: {
      temperature: 39.1,
      heartRate: 105,
      respiratoryRate: 24,
      bloodPressure: '145/90',
      oxygenSaturation: 91
    }
  },
  { 
    id: 3, 
    name: 'Alice Johnson', 
    age: 35, 
    gender: 'Female',
    admissionDate: '2023-09-18',
    status: 'Mild',
    riskScore: 40,
    vitalSigns: {
      temperature: 37.5,
      heartRate: 84,
      respiratoryRate: 16,
      bloodPressure: '120/80',
      oxygenSaturation: 98
    }
  }
];

// Get all patients
router.get('/', (req, res) => {
  res.json(patients);
});

// Get single patient
router.get('/:id', (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  res.json(patient);
});

// Add new patient
router.post('/', (req, res) => {
  const newPatient = {
    id: patients.length + 1,
    ...req.body
  };
  patients.push(newPatient);
  res.status(201).json(newPatient);
});

// Update patient
router.put('/:id', (req, res) => {
  const patient = patients.find(p => p.id === parseInt(req.params.id));
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  
  const updatedPatient = { ...patient, ...req.body };
  const index = patients.findIndex(p => p.id === parseInt(req.params.id));
  patients[index] = updatedPatient;
  
  res.json(updatedPatient);
});

// Delete patient
router.delete('/:id', (req, res) => {
  const index = patients.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Patient not found' });
  
  patients.splice(index, 1);
  res.json({ message: 'Patient deleted' });
});

module.exports = router;
