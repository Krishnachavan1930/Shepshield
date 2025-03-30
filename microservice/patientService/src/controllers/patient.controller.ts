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
            order: [[String(req.query.sort || "name"), "ASC"]],
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
            res.status(404).json({
                success : false,
                message : "Patient not found"
            });
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
  