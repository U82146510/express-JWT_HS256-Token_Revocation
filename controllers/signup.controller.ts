import {type Request, type Response, type NextFunction} from 'express';
import { User } from '../models/User.ts';
import {z} from 'zod';

const signupSchema = z.object({
     email:z.string().email().toLowerCase().trim(),
     password:z.string().min(8),
     role:z.enum(['superadmin' , 'admin' , 'editor' , 'user']).default('user')
});

export const signup = async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    const parsed = signupSchema.safeParse(req.body);
    if(!parsed.success){
        res.status(400).json({status:'error',message:'Malformed user or pass',errors:parsed.error.format()});
        return;
    }
    try {
        const {email,password,role} = parsed.data;
        const userExists = await User.findOne({email:parsed.data.email});
        if(userExists){
            res.status(409).json({status:'error',message:'Email already in use',code:'EMAIL_EXIST'});
            return;
        }
        const user = await User.create({email,password,role}); 
        // password is hashed in at Schema level using .pre('save')

        const userResponse = {
            email:user.email,
            id:user._id,
            role:user.role,
            createdAt:user.createdAt,
        }
        res.status(201).json({status:'success',message:'Registration successful',data:userResponse});
    } catch (error) {
        next(error);
    }
};