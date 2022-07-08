import { Request, Response, NextFunction } from 'express';

import { findByApiKey } from './../repositories/companyRepository.js';
import { unauthorized } from './errorHandlerMiddleware.js';

export default async function validateApiKey(req:Request, res:Response, next:NextFunction){
    const { authorization } = req.headers;
    const apiKey = authorization?.replace('Bearer ', '').trim();
    if(!apiKey) throw unauthorized();

    const company = await findByApiKey(apiKey);
    if(!company) throw unauthorized();
    
    next();
}
