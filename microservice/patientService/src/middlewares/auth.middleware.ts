import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
declare namespace Express {
    export interface Request {
        user?: any;
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Invalid Authorization. Please login first."
            });
        }

        
        const decoded_token = jwt.verify(token as string, process.env.JWT_SECRET as string) as JwtPayload;

        if (!decoded_token) {
            res.status(401).json({
                success: false,
                message: "Invalid token or session expired"
            });
        }

        
        req.user = {
            id: decoded_token.id,
            role: decoded_token.role,
            email: decoded_token.email
        };

        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

export const restrictIo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role)) {
            res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action"
            });
        }

        next();
    };
};
