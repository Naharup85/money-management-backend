import type { Response } from "express";

class ApiResponse {
    public static success(res:Response,data: any, message: string = "") {
        res.status(200).json({
            success: true,
            data,
            message,
        });
    }

   public static create(res:Response,data: any, message: string = "") {
        res.status(201).json({
            success: true,
            data,
            message,
        });
    }

   public static update(res:Response,data: any, message: string = "") {
        res.status(200).json({
            success: true,
            data,
            message,
        });
    }

   public static delete(res:Response,data: any, message: string = "") {
        res.status(200).json({
            success: true,
            data,
            message,
        });
    }
}

export default ApiResponse