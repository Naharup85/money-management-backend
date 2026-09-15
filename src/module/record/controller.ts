import type {Request,Response} from "express"
import * as RecordService from "./services.js"
import ApiResponse from "../../common/utility/apiResponse.js";


const createRecord=async(req:Request,res:Response)=>{
    const data=await RecordService.createRecord(req.body);
    return ApiResponse.create(res,data,"Record created successfully");

}

const getAllRecords=async(req:Request,res:Response)=>{
    const data=await RecordService.getAllRecords();
    return ApiResponse.success(res,data,"Records fetched successfully");

}

const updateRecord=async(req:Request,res:Response)=>{
    const {id}=req.params;
    const data=await RecordService.updateRecord(id as string,req.body);
    return ApiResponse.success(res,data,"Record updated successfully");

}

const deleteRecord=async(req:Request,res:Response)=>{
    const {id}=req.params;
    await RecordService.deleteRecord(id as string);
    return ApiResponse.success(res,{}, "Record deleted successfully");

}

const getRecord=async(req:Request,res:Response)=>{
    const {id}=req.params;
    const data=await RecordService.getRecord(id as string);
    return ApiResponse.success(res,data,"Record fetched successfully");

}


export {
    createRecord,
    getAllRecords,
    updateRecord,
    deleteRecord,
    getRecord
}