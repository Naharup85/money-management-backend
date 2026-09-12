import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import type { UserregisterDto, UserLoginDto } from "./dto.js"
import ApiError from "../../common/utility/apiErrors.js";
import { db } from "../../index.js"
import { usersTable } from "../../db/schema/users.js";


const register=async(userData: UserregisterDto)=>{
    console.log(userData);
    return "happy"
    
}

const login=async(userData: UserLoginDto)=>{
    
}

const getProfile=async(userId: string)=>{
    
}


export{
    register,
    login,
    getProfile
}