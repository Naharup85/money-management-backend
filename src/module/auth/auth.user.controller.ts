import type{ Request, Response } from "express";
import * as userServices from "./auth.services.js"
import ApiResponse from "../../common/utility/apiResponse.js";

const register=async(req:Request,res:Response)=>{
    const data=userServices.register(req.body);
    return ApiResponse.create(res,data,"User registered successfully");

}



export {
    register
}