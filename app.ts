import express,{type Application} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import {connectDB} from './config/atlas.ts';
const app:Application = express();


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
        app.listen(port,()=>console.log('Server On'));
    } catch (error) {
        console.error(error);
    }
};