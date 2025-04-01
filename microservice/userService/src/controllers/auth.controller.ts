import User from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config/config";
const signToken = (id:string, email : string, role : string) =>{
    return jwt.sign({id, role:role , email : email}, JWT_SECRET, {
        expiresIn : '30d'
    });
};

const createSendToken = (user: User, statusCode: number, res: Response): void => {
    const token = signToken(user.getDataValue("id"), user.getDataValue("email"), user.getDataValue("role")); 

    user.setDataValue("password_hash", undefined); 
    console.log(token);
    console.log(res.headersSent);
    if (!res.headersSent) {
        console.log("Sending cookie");
        res.status(statusCode)
            .cookie("token", token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === "production", 
                sameSite: "strict", 
                maxAge: 30 * 24 * 60 * 60 * 1000, 
            })
            .json({
                success: true,
                token,
                user,
            });
    }
};


export const Register = async(req : Request, res : Response, next : NextFunction)=>{
    try{
        console.log("[Register] Route called - Body:", req.body);
        const { name, email, password , role, department}   = req.body;
        
        console.log(name, email, password, role, department);
        console.log("Register Route called");
        if(!name || !email || !password || !role || !department){
            res.status(400).json({
                success : false,
                message : "Please enter all details"
            });
        }
        const existingUser = await User.findOne({ where : {
            email : email
        }});
        if(existingUser){
            res.status(400).json({
                success : false,
                message : "User with this email already exists"
            });
        }
        const hashed_pw = bcrypt.hashSync(password, 12);
        const newUser = await User.create({
            name : name,
            email : email,
            password_hash : hashed_pw,
            role : role,
            department : department
        });

        createSendToken(newUser, 201, res);
    }catch(err){
        next(err);
    }
};



export const Login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Please provide email and password"
            });
        }

        const user = await User.findOne({ where: { email } });
        console.log(user);
        if (!user || !user.getDataValue("password_hash")) {
            res.status(404).json({
                success: false,
                message: "User not found or password missing"
            });
        }

        // ✅ Use bcrypt.compare (async)
        const isCorrect = await bcrypt.compare(password, user!.getDataValue("password_hash"));

        if (!isCorrect) {
            res.status(401).json({
                success: false,
                message: "Incorrect email or password"
            });
        }

        return createSendToken(user!, 200, res);
    } catch (err) {
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
        const {currentPassword, newPassword, confirmPassword} = req.body;

        if (!currentPassword|| !newPassword || !confirmPassword) {
            res.status(400).json({ message: "All fields are required" });
        }

        if (newPassword !== confirmPassword) {
            res.status(400).json({ message: "New passwords do not match" });
          }

        
       
        if(!req.user){
            res.status(404).json({
                success : false,
                message : "User not found"
            });
        }
        console.log("User");
        console.log(req.user);
        const user = await User.findByPk(req.user.dataValues.id);

        const isCorrect = await bcrypt.compare(currentPassword, user!.getDataValue('password_hash'));

        if(!isCorrect){
            res.status(401).json({
                success : false,
                message : "Incorrect password"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user!.password = hashedPassword;
        await user!.save();


        createSendToken(user!, 200, res);

        res.json({ message: "Password updated successfully" });

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