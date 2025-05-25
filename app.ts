import express,{type Application} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import {connectDB} from './config/atlas.ts';
import {RedisClient} from './config/redis.ts';


const app:Application = express();
export const redisClient = new RedisClient(); 

app.use(helmet());
app.use(cors({
    origin:'*',
    methods:['GET','PUT','DELETE','POST','OPTIONS'],
    allowedHeaders:['Content-Type','Authorization']
}));

app.use(express.json());

const port:number = 3000;

const start = async ()=>{
    try {
        await connectDB();
        await redisClient.connect();
        app.listen(port,()=>console.log('Server On'));
    } catch (error) {
        console.error(error);
    }
};