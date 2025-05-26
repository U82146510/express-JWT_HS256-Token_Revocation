import {Document,model,Schema} from "mongoose";
import bcrypt from 'bcryptjs';
import { jwt } from "zod/v4";

interface IUser extends Document{
    email:string;
    password:string;
    role:'superadmin' | 'admin' | 'editor' | 'user';
    createdAt:Date;
    updatedAt:Date;
    comparePasswords(password:string):Promise<boolean>;
};

const userSchema = new Schema<IUser>({
    email:{
        type:String,lowercase:true,trim:true,unique:true,required:true
    },
    password:{
        type:String,minlength:8,required:true
    },
    role:{type:String,enum:['superadmin' , 'admin' , 'editor' , 'user' ],default:'user'}
},{timestamps:true});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

userSchema.methods.comparePasswords = async function(password:string):Promise<boolean>{
    try {
        return await bcrypt.compare(password,this.password);
    } catch (error) {
        console.error(error);
        return false
    }
}

export const User = model<IUser>('User',userSchema);