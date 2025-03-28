import User from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
const signToken = (id:string) =>{
    return jwt.sign({id}, process.env.JWT_SECRET as string, {
        expiresIn : '30d'
    });
};

const createSendToken = (user: User, statusCode: number, res: Response) => {
    const token = signToken(user.getDataValue("id")); // Use Sequelize's getter

    user.setDataValue("password", undefined); // Hide password before sending

    res.status(statusCode).json({
        success: true,
        token,
        user,
    });
};


export const Register = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        const {name, email, password, role, department} = req.body;

        const existingUser = await User.findOne({ where : {
            email : email
        }});
        if(existingUser){
            res.status(400).json({
                success : false,
                message : "User with this email already exists"
            });
        }

        const newUser = await User.create({
            name : name,
            email : email,
            password : password,
            role : role,
            department : department
        });

        createSendToken(newUser, 201, res);
    }catch(err){
        next(err);
    }
};


export const Login = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            res.status(400).json({
                success : false,
                message : "Please provide email and password"
            });
        }

        const user = await User.findOne({where : {
            email : email
        }});
        if(!user){
            res.status(404).json({
                success : false,
                message : "User not found"
            });
        }

        const isCorrect = await bcrypt.compare(password, user!.getDataValue("password"));
        if(!isCorrect){
            res.status(401).json({
                success : false,
                message : "Incorrect email or password"
            });
        }

        createSendToken(user!, 200, res);
    }catch(err){
        next(err);
    }
};

export const Logout = (req : Request, res : Response)=>{
    res.status(200).json({
        success : true,
        message : "Logged out successfully"
    });
}

export const GetMe = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        const user = await User.findByPk(req.user.id);
        res.status(200).json({
            success : true,
            user
        });
    }catch(err){
        next(err);
    }
};


export const updatePassword = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        const {curretPassword, newPassword} = req.body;
        const user = await User.findByPk(req.user.id);
        if(!user){
            res.status(404).json({
                success : false,
                message : "User not found"
            });
        }
        const isCorrect = await bcrypt.compare(curretPassword, user!.getDataValue('password'));
        if(!isCorrect){
            res.status(401).json({
                success : false,
                message : "Incorrect password"
            });
        }

        user!.password = newPassword;
        await user!.save();
        createSendToken(user!, 200, res);
    }catch(err){
        next(err);
    }
};

export const updateMe = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        if(req.body.password){
            res.status(400).json({
                success : false,
                message : "This is not for password updates, Please use /updatePassword route"
            });
        }

        const filteredBody:Record<string, any> = {};
        const allowedFields = ['name', 'email', 'department', 'avatar'];
        Object.keys(req.body).forEach(key =>{
            if(allowedFields.includes(key)){
                filteredBody[key] = req.body[key];
            }
        });

        const updatedUser = await User.update(filteredBody, {
            where : { id : req.user.id },
            returning : true
        });
        res.status(200).json({
            sucess : true,
            user : updatedUser
        });
    }catch(err){
        next(err);
    }
};