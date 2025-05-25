import { Router } from "express";
import {signup} from '../controllers/signup.controller.ts';
import {RateMiddleware} from '../middleware/rateLimiter.ts';

export const signupRoute:Router = Router();

signupRoute.post('/signup',RateMiddleware(),signup);