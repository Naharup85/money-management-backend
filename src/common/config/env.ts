import { z } from "zod";
import dotenv from 'dotenv';
import ApiError from "../utility/apiErrors.js";
dotenv.config();


const envSchema = z.object({
    PORT: z.string().transform((val) => parseInt(val, 10)),
    CORS: z.string(),
    LOGTO_ENDPOINT: z.string(),
    LOGTO_APP_ID: z.string(),
    LOGTO_APP_SECRET: z.string(),
    LOGTO_API_RESOURCE: z.string(),
    DATABASE_URL: z.string(),
});

export const env = (() => {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        throw ApiError.internalServerError("Invalid environment configuration");
    }
    return result.data;
})();
