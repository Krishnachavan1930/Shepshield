import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // Make sure this is installed
import { JWT_SECRET } from "../config/config";
dotenv.config();

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<Response | any> => {
    try {
        let token;

        // Check Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            console.log("Token from Header:", token);
        }

        // Check Cookie if no token found in headers
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
            console.log("Token from Cookie:", token);
        }

        // If no token found
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid Authorization. Please login first."
            });
        }

        // Verify JWT
        const decoded_token = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
        console.log(decoded_token);
        if (!decoded_token) {
            return res.status(401).json({
                success: false,
                message: "Invalid token or session expired"
            });
        }

        // Attach user data to request
        req.user = {
            id: decoded_token.id,
            role: decoded_token.role,
            email: decoded_token.email
        };

        next();
    } catch (err) {
        console.error("JWT Verification Error:", err);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};


export const restrictIo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log("Printing Req user", req.user);
        if (!roles.includes(req.user?.role)) {
            res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action"
            });
        }

        next();
    };
};
