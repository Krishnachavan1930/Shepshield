import { Patient } from "../models/patient.model";
import { Request, Response, NextFunction } from "express";
export const getAllPatients = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        let query:Record<string, any> = {};
        if(req.query.status) query.status = req.query.status;
        if(req.query.riskLevel) query.riskLevel = req.query.riskLevel;
        
    }
}