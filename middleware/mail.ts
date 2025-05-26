import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path:
})

export const emailService = async (to:string,subject:string,text:string,html?:string):Promise<void>=>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{

        }
    })
    try {
        
    } catch (error) {
        console.error(error);
    }
};