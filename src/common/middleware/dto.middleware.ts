import { z } from 'zod';
import type { NextFunction, Request, Response } from 'express';
import ApiError from '../utility/apiErrors.js';

const validate = (schema:any)=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        const result=await schema.safeParseAsync({...req.body,...req.auth});
        if(!result.success){
            const errors=result.error.issues;
            let errString=errors.map((error:any)=>{
                return `${error?.path[0]} ${error?.message}`;
            }).join("\n");
           throw ApiError.badRequest(errString);
        }
        req.body=result.data;
        next();
    }
}

export default validate;