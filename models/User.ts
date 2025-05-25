import {Document,model,Schema} from "mongoose";
import bcrypt from 'bcryptjs';

interface IUser extends Document{
    email:string;
    password:string;
    role:'superadmin' | 'admin' | 'editor' | 'user';
    createdAt:Date;
    updatedAt:Date;
};

const userSchema = new Schema<IUser>({
    email:{
        type:String,lowercase:true,required:true
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

export const User = model<IUser>('User',userSchema);