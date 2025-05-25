import { RateLimiterRedis } from "rate-limiter-flexible";
import {redisClient} from '../app.ts';
import { type Request,type Response,type NextFunction } from "express";

export const RateMiddleware = ()=>{
    const rateLimiter = new RateLimiterRedis({
        storeClient:redisClient.getClient(),
        keyPrefix:'rl_http',
        points:5,
        duration:60,
        blockDuration:60*5,
        execEvenly:true,
    });
    return async (req:Request,res:Response,next:NextFunction)=>{
        const ip = req.ip;
        try {    
            if(!ip){
                res.status(400).json({message:'Could not determine the ip'});
                return;
            }
            const rateLimitRes = await rateLimiter.consume(ip);
            res.set({
                'X-RateLimit-Limit': rateLimiter.points,
                'X-RateLimit-Remaining': rateLimitRes.remainingPoints,
                'X-RateLimit-Reset': Math.ceil(rateLimitRes.msBeforeNext / 1000)
            })
            next()
        } catch (error:unknown) {
            res.status(429).json({message:'Too many requests'});
        }
    }
};