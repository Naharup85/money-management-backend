import { z } from 'zod';
import type { NextFunction, Request, Response } from 'express';
import ApiError from '../utility/apiErrors.js';

const validate = (schema:any)=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        const result=await schema.safeParseAsync(req.body);
        if(!result.success){
            const {errors}=result.error;
            throw ApiError.badRequest(errors.map((err:any)=>err.message));
        }
        req.body=result.data;
        next();
    }
}

export default validate;