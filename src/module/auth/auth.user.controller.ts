import type{ Request, Response } from "express";
import * as userServices from "./auth.services.js"
import ApiResponse from "../../common/utility/apiResponse.js";

const register=async(req:Request,res:Response)=>{
    const data=userServices.register(req.body);
    return ApiResponse.create(res,data,"User registered successfully");

}

const login=async(req:Request,res:Response)=>{
    const {user,tokens}=await userServices.login(req.body);
    
    res.cookie("accessToken",tokens.accessToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:15*60*1000,
    });
    
    res.cookie("refreshToken",tokens.refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:24*60*60*1000,
    });

    return ApiResponse.success(res,user,"User logged in successfully");
}

export {
    register,
    login,
    
}