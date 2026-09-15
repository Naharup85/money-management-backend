import type{ Request, Response } from "express";
import * as userServices from "./services.js"
import ApiResponse from "../../common/utility/apiResponse.js";
import ApiError from "../../common/utility/apiErrors.js";


const register=async(req:Request,res:Response)=>{
    const userData=await userServices.register(req.body);
    return ApiResponse.create(res,userData);
}

// {
//   sub: '7lum025pwun1',
//   clientId: '8atr29lpknm8id3qkrxz7',
//   scopes: [ '' ],
//   audience: [ 'https://api.moneyflow' ]
// }
const getProfile=async(req:Request,res:Response)=>{
  const userData=await userServices.getUserProfile(req.auth?.sub!);
  return ApiResponse.success(res,userData,"User Profile Fetch Success")
}


export{
    register,
    getProfile
}