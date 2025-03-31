import { LabResult, Patient, VitalSigns } from "../models/patient.model";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Sequelize } from "sequelize";
import { JWT_SECRET } from "../config/config";
export const getAllPatients = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        let query:Record<string, any> = {};
        if(req.query.status) query.status = req.query.status;
        if(req.query.riskLevel) query.riskLevel = req.query.riskLevel;
        if (req.query.department) query.department = req.query.department;
        if(req.query.search) {
            query = {}
        }       

        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = (page - 1) * limit;

        const { rows: patient, count: total } = await Patient.findAndCountAll({
            where: query,
            order: [[String("id"), "ASC"]],
            limit,
            offset,
            });

        res.status(200).json({
            success : true,
            count : patient.length,
            total,
            totalPages : Math.ceil(total / limit),
            currentPage : page,
            data : patient
        });
    }catch(err){
        next(err);
    }
}


// export const getPatient = async(req : Request, res : Response, next : NextFunction)=>{
//     try {
//         console.log(req.params);
        
//         // Fetch patient
//         let patient = await Patient.findByPk(req.params.id, {
//             include: [
//                 { model: VitalSigns, limit: 1, order: [['createdAt', 'DESC']] },
//                 { model: LabResult, limit: 1, order: [['createdAt', 'DESC']] },
//             ],
//         });
//         if (!patient) {
//             res.status(404).json({
//                 success: false,
//                 message: "Patient not found",
//             });
//         }
//         console.log(patient);
//         // Return response
//         res.status(200).json({
//             success: true,
//             data: patient,
//         });
//     } catch (err) {
//         next(err);
//     }
// }

export const getPatient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Fetch patient
        const patient = await Patient.findByPk(req.params.id);
        if (!patient) {
            res.status(404).json({
                success: false,
                message: "Patient not found",
            });
            return;
        }

        // Convert to plain object
        let patientData = patient.toJSON();

        // Fetch latest vital signs (single object)
        const vitalSigns = await VitalSigns.findOne({
            where: { patientId: req.params.id },
            order: [['createdAt', 'DESC']],
        });
        patientData.VitalSigns = vitalSigns ? vitalSigns.toJSON() : null;

        // Fetch latest lab results (single object)
        const labResults = await LabResult.findOne({
            where: { patientId: req.params.id },
            order: [['createdAt', 'DESC']],
        });
        patientData.LabResults = labResults ? labResults.toJSON() : null;

        // Return response
        res.status(200).json({
            success: true,
            data: patientData,
        });
    } catch (err) {
        next(err);
    }
};



export const createPatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.body.riskScore && req.body.vitalSigns) {
            req.body.riskScore = calculateRiskScore(req.body.vitalSigns);
        }

        console.log("Token from cookies:", req.cookies.token);
        
        if (!req.cookies.token) {
            res.status(401).json({ success: false, message: "Authentication token missing" });
            return;
        }

        // Decode the JWT token
        const decoded = jwt.verify(req.cookies.token, JWT_SECRET) as any;

        console.log("Decoded User:", decoded);
        
        if (!decoded.id) {
            res.status(401).json({ success: false, message: "Invalid token" });
            return;
        }

        // Assign the doctor's ID
        req.body.assigneddoctor = 1;
        console.log(req.body.assigneddoctor);
        console.log("Creating patient");
        const patient = await Patient.create(req.body);
        console.log("Patient created");

        res.status(201).json({
            success: true,
            data: patient
        });
    } catch (err) {
        console.error("Sequelize Error:", err);
    if (err instanceof Sequelize) {
        console.error("Validation Error:", err);
    } else if (err instanceof Sequelize) {
        console.error("Database Error:", err);
    } else {
        console.error("Unexpected Error:", err);
    }
        next(err); // Properly pass errors to Express error handling
    }
};


export const updatePatient = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        if(req.body.vitalSigns && !req.body.riskScore){
            req.body.riskScore = calculateRiskScore(req.body.vitalSigns);
        }

        const patient = await Patient.update(req.body, {where : {id : req.params.id}});
        if(!patient){
            res.status(404).json({
                success : false,
                message : "Patient not found"
            });
        }

        res.status(200).json({
            success : true,
            data : patient
        });
    }catch(err){
        next(err);
    }
}

export const deletePatient = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        const patient = await Patient.findByPk(req.params.id);
        if(!patient){
            next("Patient not found")
        }
        await patient!.destroy();

        res.status(200).json({
            success : true,
            message : "Patient deleted successfully"
        });
    }catch(err){
        next(err);
    }
}

// const calculateSOFAScore = (vital: VitalSigns, lab: LabResult): number => {
//   let sofa = 0;
//   if (vital?.O2Sat && vital.O2Sat < 90) sofa += 2;
//   else if (vital?.O2Sat && vital.O2Sat < 95) sofa += 1;
//   if (vital?.MAP && vital.MAP < 70) sofa += 1;
//   if (lab?.Creatinine && lab.Creatinine > 2.0) sofa += 2;
//   else if (lab?.Creatinine && lab.Creatinine > 1.2) sofa += 1;
//   if (lab?.Bilirubin_total && lab.Bilirubin_total > 2.0) sofa += 2;
//   else if (lab?.Bilirubin_total && lab.Bilirubin_total > 1.2) sofa += 1;
//   if (lab?.Platelets && lab.Platelets < 100) sofa += 2;
//   else if (lab?.Platelets && lab.Platelets < 150) sofa += 1;
//   return sofa;
// };

// const calculateQSOFAScore = (vital: VitalSigns): number => {
//   let qsofa = 0;
//   if (vital?.Resp && vital.Resp >= 22) qsofa += 1;
//   if (vital?.SBP && vital.SBP <= 100) qsofa += 1;
//   return qsofa;
// };

// export const getPatientProgress = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const patientId = parseInt(req.params.id);

//     const patient = await Patient.findByPk(patientId);
//     if (!patient) {
//       res.status(404).json({ success: false, message: 'Patient not found' });
//     }

//     const vitalSigns = await VitalSigns.findAll({
//       where: { patientId },
//       order: [['recordedAt', 'ASC']],
//       limit: 10,
//     });

//     const labResults = await LabResult.findAll({
//       where: { patientId },
//       order: [['recordedAt', 'ASC']],
//       limit: 3,
//     });

//     console.log('Patient:', patient!.toJSON());
//     console.log('VitalSigns:', vitalSigns.map(v => v.toJSON()));
//     console.log('LabResults:', labResults.map(l => l.toJSON()));

//     if (!vitalSigns.length && !labResults.length) {
//       res.json({
//         success: true,
//         data: [],
//         message: 'No vital signs or lab results found for this patient',
//       });
//     }

//     const timestamps = new Set<string>();
//     vitalSigns.forEach(v => {
//       if (v.recordedAt) timestamps.add(v.recordedAt.toISOString());
//     });
//     labResults.forEach(l => {
//       if (l.recordedAt) timestamps.add(l.recordedAt.toISOString());
//     });

//     console.log('Timestamps:', Array.from(timestamps));

//     const progressData = [];
//     for (const timestamp of timestamps) {
//       const vital = vitalSigns.find(v => v.recordedAt && v.recordedAt.toISOString() === timestamp) || {} as VitalSigns;
//       const lab = labResults.find(l => l.recordedAt && l.recordedAt.toISOString() === timestamp) || {} as LabResult;

//       console.log(`Processing timestamp: ${timestamp}`);
//       console.log('Vital for timestamp:', vital.toJSON());
//       console.log('Lab for timestamp:', lab.toJSON());

//       const sofa = calculateSOFAScore(vital, lab);
//       const qsofa = calculateQSOFAScore(vital);

//       progressData.push({
//         date: timestamp ? new Date(timestamp).toLocaleDateString() : 'Unknown',
//         sofa,
//         qsofa,
//         risk: patient?.riskScore ?? 0,
//         lactate: lab.Lactate ?? 0,
//         antibiotics: 'N/A',
//       });
//     }

//     console.log('Progress Data:', progressData);

//     res.json({
//       success: true,
//       data: progressData,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// Simplified SOFA score calculation
const calculateSOFAScore = (vital: any, lab: any): number => {
    let sofa = 0;
    if (vital?.O2Sat && vital.O2Sat < 90) sofa += 2;
    else if (vital?.O2Sat && vital.O2Sat < 95) sofa += 1;
    if (vital?.MAP && vital.MAP < 70) sofa += 1;
    if (lab?.Creatinine && lab.Creatinine > 2.0) sofa += 2;
    else if (lab?.Creatinine && lab.Creatinine > 1.2) sofa += 1;
    if (lab?.Bilirubin_total && lab.Bilirubin_total > 2.0) sofa += 2;
    else if (lab?.Bilirubin_total && lab.Bilirubin_total > 1.2) sofa += 1;
    if (lab?.Platelets && lab.Platelets < 100) sofa += 2;
    else if (lab?.Platelets && lab.Platelets < 150) sofa += 1;
    return sofa;
  };
  
  // Simplified qSOFA score calculation
  const calculateQSOFAScore = (vital: any): number => {
    let qsofa = 0;
    if (vital?.Resp && vital.Resp >= 22) qsofa += 1;
    if (vital?.SBP && vital.SBP <= 100) qsofa += 1;
    return qsofa;
  };
  
  export const getPatientProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patientId = parseInt(req.params.id);
  
      const patient = await Patient.findByPk(patientId);
      // Removed: return res.status(404).json({ success: false, message: 'Patient not found' });
      // If patient is null, we'll still proceed but log it
  
      const vitalSigns = await VitalSigns.findAll({
        where: { patientId },
        order: [['recordedAt', 'ASC']],
        limit: 10,
        raw: true, // Raw data to avoid Sequelize instance issues
      });
  
      const labResults = await LabResult.findAll({
        where: { patientId },
        order: [['recordedAt', 'ASC']],
        limit: 3,
        raw: true, // Raw data
      });
  
      console.log('Patient (raw):', patient ? patient.toJSON() : 'No patient found');
      console.log('VitalSigns (raw):', vitalSigns);
      console.log('LabResults (raw):', labResults);
  
      if (!labResults.length) {
        res.json({
          success: true,
          data: [],
          message: 'No lab results found for this patient',
        });
        return;
      }
  
      const progressData = labResults.map(lab => {
        const vital = vitalSigns.length
          ? (vitalSigns.find(v =>
              v.recordedAt && lab.recordedAt &&
              new Date(v.recordedAt).getTime() === new Date(lab.recordedAt).getTime()
            ) || vitalSigns[vitalSigns.length - 1]) // Fallback to latest vital
          : {};
  
        console.log('Lab Record (raw):', lab);
        console.log('Matched Vital (raw):', vital);
  
        const sofa = calculateSOFAScore(vital, lab);
        const qsofa = calculateQSOFAScore(vital);
  
        return {
          date: lab.recordedAt
            ? new Date(lab.recordedAt).toLocaleDateString()
            : (patient && patient.admissionDate
                ? new Date(patient.admissionDate).toLocaleDateString()
                : 'No Date Recorded'),
          sofa,
          qsofa,
          risk: lab.risk_percent ?? (patient ? patient.riskScore : 0) ?? 0,
          lactate: lab.Lactate ?? 0,
          antibiotics: patient && patient.medications && patient.medications !== 'None' ? patient.medications : 'N/A',
        };
      });
  
      console.log('Progress Data:', progressData);
  
      res.json({
        success: true,
        data: progressData,
      });
    } catch (err) {
      console.error('Error:', err);
      next(err);
    }
  };
const calculateRiskScore = (vitalSigns : VitalSigns) => {
    let score = 30;
    
    if (vitalSigns.Temp > 38.5) score += 20;
    else if (vitalSigns.Temp > 38.0) score += 10;
    
    if (vitalSigns.HR! > 100) score += 20;
    else if (vitalSigns.HR! > 90) score += 10;
    
    if (vitalSigns.Resp! > 22) score += 20;
    else if (vitalSigns.Resp! > 20) score += 10;
    
    if (vitalSigns.O2Sat < 92) score += 20;
    else if (vitalSigns.O2Sat < 95) score += 10;
    
    return Math.min(score, 100);
  };
  