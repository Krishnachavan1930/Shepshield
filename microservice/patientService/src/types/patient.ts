export interface PatientRecord {
    medicalRecordNumber: string;
    name: string;
    age: number;
    gender: string;
    admissionDate: string;
    department: string;
    status: string;
    riskScore: number;
    riskLevel: string;
  }
  
  export interface VitalSignRecord {
    patientId: string;
    Temp: number;
    HR: number;
    Resp: number;
    SBP: number;
    MAP: number;
    DBP: number;
    O2Sat: number;
    recordedAt: string;
  }
  
  export interface LabResultRecord {
    patientId: string;
    testType: string;
    Glucose: number;
    Lactate: number;
    Magnesium: number;
    recordedAt: string;
  }