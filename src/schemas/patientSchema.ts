
import { z } from 'zod';

export const patientSchema = z.object({
  name: z.string().min(2, 'Name must contain at least 2 characters'),
  age: z.coerce.number().int().min(0, 'Age must be a positive number'),
  gender: z.string().min(1, 'Gender is required'),
  admissionDate: z.string().min(1, 'Admission date is required'),
  department: z.string().optional(),
  medicalRecordNumber: z.string().optional(),
  
  // Vital signs
  temperature: z.coerce.number().optional(),
  heartRate: z.coerce.number().int().optional(),
  respiratoryRate: z.coerce.number().int().optional(),
  bloodPressureSystolic: z.coerce.number().int().optional(),
  bloodPressureDiastolic: z.coerce.number().int().optional(),
  oxygenSaturation: z.coerce.number().int().min(0).max(100, 'Oxygen saturation must be between 0 and 100').optional(),
  
  // Additional
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  notes: z.string().optional(),
});

export type PatientFormValues = z.infer<typeof patientSchema>;
