import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path:path.resolve(__dirname,'../../.env')
});

const auth = {
    user:process.env.gmail_user,
    pass:process.env.gmail_pass,
} as const;

if(!auth.user||!auth.pass){
    throw new Error("User or pass from gmail.com is missing");
};

export const emailService = async (to:string,subject:string,text:string,html?:string):Promise<void>=>{
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:auth.user,
            pass:auth.pass,
        }
    });

    const mailOptions = {
        from:'snddiaconu@gmail.com',
        to,
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent",info.messageId);   
    } catch (error) {
        console.error(error);
    }
};