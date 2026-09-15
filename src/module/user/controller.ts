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
const getUser=async(req:Request,res:Response)=>{
  const userData=await userServices.getUser(req.auth?.sub!);
  return ApiResponse.success(res,userData,"User Profile Fetch Success")
}

const updateUser=async(req:Request,res:Response)=>{
  const userData=await userServices.updateUser(req.user?.id!,req.body);
  return ApiResponse.success(res,userData,"User Profile Update Success")
}

const deleteUser=async(req:Request,res:Response)=>{
  await userServices.deleteUser(req.user?.id!);
  return ApiResponse.success(res,null,"User Deleted Successfully")
}


export{
    register,
    getUser,
    updateUser,
    deleteUser,

}
