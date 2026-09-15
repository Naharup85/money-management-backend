import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import type { UserRegisterDto } from "./dto.js"
import ApiError from "../../common/utility/apiErrors.js";
import { db } from "../../index.js"
import { usersTable } from "../../db/schema/users.js";
import ApiResponse from "../../common/utility/apiResponse.js";

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
        cashBalance: userData.cashBalance?.toString(),
        profilePicture:userData.profilePicture,
        logtoId:userData.sub,
    }).returning({"id":usersTable.id});
    return user;
}



const getUserProfile=async(logtoId: string)=>{
    const user=await db.select().from(usersTable).where(eq(usersTable.logtoId,logtoId))
    if(!user ||user.length===0){
        throw ApiError.notFound("User data not found");
    }
    return {
            id:user[0]?.id,
            firstName:user[0]?.firstName,
            lastName:user[0]?.lastName,
            email:user[0]?.email,
            cashBalance:user[0]?.cashBalance,
            profilePicture:user[0]?.profilePicture,
            createdAt:user[0]?.createdAt,
            updatedAt:user[0]?.updatedAt
    };
}


export{
    register,
    getUserProfile
}