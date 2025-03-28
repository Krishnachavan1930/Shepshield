import Doctor from "../models/doctor.model";
import { Request, Response, NextFunction } from "express";
export const GetAllDoctors = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        let query:Record<string, any> = {};
        if(req.query.speciality){
            query.speciality = req.query.speciality;
        }
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = (page - 1) * limit;
    
    
        const { rows: doctors, count: total } = await Doctor.findAndCountAll({
        where: query,
        order: [[String(req.query.sort || "name"), "ASC"]],
        limit,
        offset,
        });

        res.status(200).json({
            success: true,
            count: doctors.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: doctors,
        });
    }catch(err){
        next(err);
    }
}

export const createDoctor = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        const doctor = await Doctor.create(req.body);
        res.status(201).json({
            success : true,
            data : doctor
        });
    }catch(err){
        next(err);
    }
};


export const updateDoctor = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        const doctor = await Doctor.update(req.body, {where : {id : req.params.id}});
        if(!doctor){
            res.status(404).json({
                success : false,
                message : "Doctor not found"
            });
        }
    }catch(err){
        next(err);
    }
}


export const deleteDoctor = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        const doctor = await Doctor.findByPk(req.user.id);
        if(!doctor){
            res.status(404).json({
                success : false,
                message : "Doctor not found"
            });
        }
        await doctor!.destroy();
        doctor?.save();
        res.status(200).json({
            success : true,
            message : "Doctor deleted successfully"
        });
    }catch(err){
        next(err);
    }
}


export const getDoctor = async(req : Request, res : Response, next :  NextFunction)=>{
    try{
        const doctor = await Doctor.findByPk(req.params.id);
        if(!doctor){
            res.status(404).json({
                success : false,
                message : "Doctor not found"
            });
        }

        res.status(200).json({
            success : true,
            data : doctor
        });
    }catch(err){
        next(err);
    }
}