import type { Request, Response } from "express";
import ApiResponse from "../../common/utility/apiResponse.js";
import * as accountService from "./services.js";


const createAccount=async(req:Request,res:Response)=>{
    const account=await accountService.createAccount(req.body);
    ApiResponse.create(res,account,"Account Created Successfully");
}


const getUserAccounts=async(req:Request,res:Response)=>{
    const userId = req.user?.id as string;
    const accounts=await accountService.getUserAccounts(userId);
    ApiResponse.success(res,accounts,"Accounts Fetched Successfully");
}

const updateAccount=async(req:Request,res:Response)=>{
    const account=await accountService.updateAccount(req.params.accountId as string,req.body);
    ApiResponse.success(res,account,"Account Updated Successfully");
}

const deleteAccount=async(req:Request,res:Response)=>{
    await accountService.deleteAccount(req.params.accountId as string);
    ApiResponse.success(res,null,"Account Deleted Successfully");
}


export {
    createAccount,
    getUserAccounts,
    updateAccount,
    deleteAccount
}