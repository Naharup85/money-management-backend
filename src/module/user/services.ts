import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import type { UserRegisterDto, UserUpdateDto } from "./dto.js"
import ApiError from "../../common/utility/apiErrors.js";
import { db } from "../../index.js"
import { usersTable } from "../../db/schema/users.js";
import ApiResponse from "../../common/utility/apiResponse.js";
import * as accountServices from "../account/services.js";


const getDefaultAvatar=(firstName: string, lastName: string)=>{
  const seed = encodeURIComponent(`${firstName} ${lastName}`);
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`;
}

const register=async(userData: UserRegisterDto)=>{
    const userExists =await db.select().from(usersTable).where(eq(usersTable.email,userData.email))
    if(userExists.length>0){
        throw ApiError.badRequest("User already exists");
    }
    if(!userData.profilePicture){
        userData.profilePicture=getDefaultAvatar(userData.firstName,userData.lastName);
    }
    const user=await db.insert(usersTable).values({
        firstName:userData.firstName,
        lastName:userData.lastName,
        email:userData.email,
        profilePicture:userData.profilePicture,
        logtoId:userData.sub,
    }).returning({"id":usersTable.id});

    try {
        const account=await accountServices.createAccount({
            userId: user[0]?.id!,
            name: "Cash",
            type: "cash",
            balance: userData.cashBalance,
            color:"#83b5f0ff"
        });
    } catch (error) {
        await db.delete(usersTable).where(eq(usersTable.id,user[0]?.id!));
        throw ApiError.internalServerError("Failed to create account");
    }
    return user;
}



const getUser=async(logtoId: string)=>{
    const user=await db.select().from(usersTable).where(eq(usersTable.logtoId,logtoId))
    if(!user ||user.length===0){
        throw ApiError.notFound("User data not found");
    }

    return {
            id:user[0]?.id,
            firstName:user[0]?.firstName,
            lastName:user[0]?.lastName,
            email:user[0]?.email,
            profilePicture:user[0]?.profilePicture,
            createdAt:user[0]?.createdAt,
            updatedAt:user[0]?.updatedAt
    };
}

const updateUser=async(userId: string,userData: UserUpdateDto)=>{
    const user=await db.select().from(usersTable).where(eq(usersTable.id,userId))
    if(!user ||user.length===0){
        throw ApiError.notFound("User data not found");
    }
    const updatedUser=await db.update(usersTable).set({
        firstName:userData.firstName,
        lastName:userData.lastName,
        email:userData.email,
        profilePicture:userData.profilePicture,
        logtoId:userData.sub,
    }).where(eq(usersTable.id,userId)).returning();
    return {
            id:updatedUser[0]?.id,
            firstName:updatedUser[0]?.firstName,
            lastName:updatedUser[0]?.lastName,
            email:updatedUser[0]?.email,
            profilePicture:updatedUser[0]?.profilePicture,
            updatedAt:updatedUser[0]?.updatedAt
    };
}

const deleteUser=async(userId: string)=>{
    await db.delete(usersTable).where(eq(usersTable.id,userId));
    
    return;
}


export{
    register,
    getUser,
    updateUser,
    deleteUser,
}
