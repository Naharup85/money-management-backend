import bcrypt from "bcrypt";
import {eq} from "drizzle-orm";

import type { UserregisterDto,UserLoginDto } from "./auth.Dto.js"
import ApiError from "../../common/utility/apiErrors.js";
import {db} from "../../index.js"
import { usersTable } from "../../db/schema/users.js";
import { genraetAccessToken, genraetRefreshToken } from "../../common/utility/jwt.js";

const checkPassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
}
const register=async({firstName,lastName,email,password,confirmPassword,cashBalance}:UserregisterDto)=>{
    const exstingUser=await db.select().from(usersTable).where(eq(usersTable.email,email));
    if(exstingUser.length>0){
        throw ApiError.badRequest("User already exists");
    }

    if(password!==confirmPassword){
        throw ApiError.badRequest("Passwords do not match");
    }

    if(cashBalance<=0){
        throw ApiError.badRequest("Cash balance must be greater than 0");
    }
    
    const hashedPassword= await bcrypt.hash(password,10);
    const user=await db.insert(usersTable).values({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        cashBalance: cashBalance.toFixed(2),
    }).returning({id:usersTable.id});
    
    return user[0];
}

const login=async({email,password}:UserLoginDto)=>{
    const exstingUser=await db.select().from(usersTable).where(eq(usersTable.email,email));
    if(exstingUser.length===0){
        throw ApiError.badRequest("User does not exist");
    }
    if(!exstingUser[0]){
        throw ApiError.badRequest("User does not exist");
    }
    const isPasswordValid= await checkPassword(password,exstingUser[0].password);
    if(!isPasswordValid){
        throw ApiError.badRequest("Invalid password or email");
    }
    
    const accessToken=await genraetAccessToken(exstingUser[0].id);
    const refreshToken=await genraetRefreshToken(exstingUser[0].id);
    const user=await db.update(usersTable).set({
        refreshToken,
        refreshTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }).where(eq(usersTable.id,exstingUser[0].id)).returning({id:usersTable.id,email:usersTable.email,firstName:usersTable.firstName,lastName:usersTable.lastName,cashBalance:usersTable.cashBalance});
    return {user:user[0],tokens:{accessToken,refreshToken}};
}

export {
    register,
    login
}