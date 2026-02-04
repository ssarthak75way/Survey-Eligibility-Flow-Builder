import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { sendTokenResponse, generateAccessToken } from '../utils/generateTokens';
import { z } from 'zod';
import jwt from 'jsonwebtoken';


const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    
    try {
        const validatedData = registerSchema.parse(req.body);
        const { name, email, password } = validatedData;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            sendTokenResponse(user, 201, res);
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
        console.log(error);
        
    }
};


export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = loginSchema.parse(req.body);
        const { email, password } = validatedData;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            sendTokenResponse(user, 200, res);
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            res.status(401);
            throw new Error('Refresh token is required');
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as jwt.JwtPayload;
        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(401);
            throw new Error('User not found');
        }

        const accessToken = generateAccessToken(user._id.toString());

        res.json({
            success: true,
            accessToken,
        });
    } catch (error) {
        res.status(401);
        next(new Error('Invalid refresh token'));
    }
};


export const logout = async (req: Request, res: Response, next: NextFunction) => {
  
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};
