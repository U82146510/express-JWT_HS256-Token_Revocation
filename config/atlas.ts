import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const atlas_db = process.env.uri_string;
if(!atlas_db){
    throw new Error('missing connection string');
}

export const connectDB = async()=>{
    try {
        await mongoose.connect(atlas_db,{
            serverSelectionTimeoutMS:5000,
            socketTimeoutMS:30000,
            maxPoolSize:50,
            minPoolSize:5,
            retryWrites:true,
            retryReads:true,
            connectTimeoutMS:10000,
            heartbeatFrequencyMS:30000,
            tls:true,
            tlsAllowInvalidCertificates:false,
            bufferCommands:false,
            waitQueueTimeoutMS:10000,
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const db:mongoose.Connection = mongoose.connection;

db.on('error',(error:Error)=>{
    console.error(error);
})
.on('connected',()=>{
    console.log('db connected');
})
.on('disconnected',()=>{
    console.log('db disconnected');
})
.on('reconnected',()=>{
    console.log('db reconnected');
});
process.on("SIGINT",async()=>{
    await db.close();
    process.exit(0);
});