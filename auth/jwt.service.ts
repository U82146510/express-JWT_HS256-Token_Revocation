import jwt, { JwtPayload } from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
    path:path.join(__dirname,'../../.env')
});


const JWTConfig:{
    algorithm:jwt.Algorithm;
    expiresIn:'15m';
    refreshExpiresIn:'1d';
}={
    algorithm:'HS256',
    expiresIn:'15m',
    refreshExpiresIn:'1d',
};

interface IPayload extends JwtPayload{
    id:string;
    role:'superadmin' | 'admin' | 'editor' | 'user';
};

export class JWTService{
    private loadKey(){
        if(!process.env.jwt_secret){
            throw new Error('missing jwt_secret');
        }
        return process.env.jwt_secret;
    };
    private jwt_secret = this.loadKey();

    signToken(payload:IPayload):string{
        return jwt.sign(payload,this.jwt_secret,{
            algorithm:JWTConfig.algorithm,
            expiresIn:JWTConfig.expiresIn
        });
    };
    refreshSignToken(payload:IPayload):string{
        return jwt.sign(payload,this.jwt_secret,{
            algorithm:JWTConfig.algorithm,
            expiresIn:JWTConfig.refreshExpiresIn
        });
    };
    verify(token:string):IPayload{
        try {
            const verified =  jwt.verify(token,this.jwt_secret,{algorithms:[JWTConfig.algorithm]}) as IPayload;
            if(!verified.id || !verified.role){
                throw new Error('Invalid token payload');
            }
            return verified;
        } catch (error) {
            if(error instanceof jwt.TokenExpiredError){
                throw new Error('Token expired');
            }
            if(error instanceof jwt.JsonWebTokenError){
                throw new Error('Invalid token');
            }
            throw error;
        }
        
    };
};