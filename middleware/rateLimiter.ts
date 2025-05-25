import { RateLimiterRedis } from "rate-limiter-flexible";
import {RedisClient} from '../config/redis.ts';
import { type Request,type Response,type NextFunction } from "express";

const rateLimiter = new RateLimiterRedis({
    storeClient:new RedisClient().connect(),
    keyPrefix:'rate_limit',
    points:5,
    duration:60,
});
export const createRateMiddleware = async(req:Request,res:Response,next:NextFunction)=>{
    try {
        if(!req.ip){
            res.status(400).json({message:'Missing ip'});
            return;
        }
        await rateLimiter.consume(req.ip);
        next();
    } catch (error) {
        res.status(429).json({message:'Too many requests'});
    }
};