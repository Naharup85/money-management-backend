import {createHmac,randomBytes} from "node:crypto"
import jwt from "jsonwebtoken";
import type ms from "ms";
import ApiError from "../../common/utility/apiErrors.js";


const genrateToken=()=>{
    const token=randomBytes(32).toString("hex");
    const hashToken= createHmac("sha256",token).digest("hex");
    return {token,hashToken}
}

const genraetAccessToken=(id:string)=>{
    return jwt.sign(
        {id},
        process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn:process.env.ACCESS_TOKEN_EXPIRY! as ms.StringValue}
    )
}

const genraetRefreshToken=(id:string)=>{
    return jwt.sign(
        {id},
        process.env.REFRESH_TOKEN_SECRET!,
        {expiresIn:process.env.REFRESH_TOKEN_EXPIRY! as ms.StringValue}
    )
}

const verifyAccessToken=(token:string)=>{
    return jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!,
    )
}

const verifyRefreshToken=(token:string)=>{
    return jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET!,
    )
}



export{
    genrateToken,
    genraetAccessToken,
    genraetRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}
