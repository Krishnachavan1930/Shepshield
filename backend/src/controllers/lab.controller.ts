import { Request, Response, NextFunction } from "express";
import LabResult from "../models/lab.model";

export const getPatientLab = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        const pid = req.params.id;
        if(!pid){
            res.status(400).json({
                success : false,
                message : "Please enter patient id"
            });
        }
        const { rows: patientLab, count: total } = await LabResult.findAndCountAll({
            where: {patientId : pid},
            order: [[String("recordedAt"), "ASC"]],
            });
        if(!patientLab){
            res.status(404).json({
                success : false,
                message : "Patient Lab details not found"
            });
        }
        res.status(200).json({
            success : true,
            count : total,
            data : patientLab
        });
    }catch(err){
        next(err);
    }
}

export const addLabResult = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        const data = req.body;
        const labResult = await LabResult.create({
            patientId : req.params.id,
            data
        });

        res.status(201).json({
            success : true,
            data : labResult
        });
    }catch(err){
        next(err);
    }
}