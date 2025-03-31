import jwt, { JwtPayload } from "jsonwebtoken";
import { promisify } from "util";
import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
declare namespace Express {
    export interface Request {
      user?: any; // You can replace `any` with a proper `User` type if you have it
    }
  }
export const protect = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token){
            res.status(401).json({
                success : false,
                message : "Invalid Authorization. Please login first or strict action will be taken"
            });
        }

        const decoded_token = jwt.verify(token as string, process.env.JWT_SECRET as string) as jwt.JwtPayload;


        const currentUser = await User.findByPk(decoded_token.id);
        if(!currentUser){
            res.status(401).json({
                success : false,
                message : "The user belonging to this token no longer exists"
            });
        }

        req.user = currentUser;
        console.log(req.user);
        next();
    }catch(err){
        res.status(500).json({
            success : false,
            message : "Something went wrong"
        });
    }
}

export const restrictIo = (...roles:any)=>{
    return (req : Request, res : Response, next : NextFunction)=>{
        if(!roles.includes(req.user.role)){
            res.status(403).json({
                success : false,
                message : "You do not have permission to perform this action"
            })
        }

        next();
    }
}