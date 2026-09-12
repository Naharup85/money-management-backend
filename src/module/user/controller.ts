import type{ Request, Response } from "express";
import * as userServices from "./services.js"
import ApiResponse from "../../common/utility/apiResponse.js";



const register=async(req:Request,res:Response)=>{
   const data=await userServices.register(req.body);
   return ApiResponse.create(res,data);
}

const login=async(req:Request,res:Response)=>{
   
}

const getProfile=async(req:Request,res:Response)=>{
  
}


export{
    register,
    login,
    getProfile
}