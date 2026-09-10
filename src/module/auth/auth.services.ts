import bcrypt from "bcrypt";
import type { UserregisterDto } from "./auth.Dto.js"
import ApiError from "../../common/utility/apiErrors.js";
import {db} from "../../index.js"
import { usersTable } from "../../db/schema/users.js";
import {eq} from "drizzle-orm";


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
        cashBalance,
    }).returning({id:usersTable.id});
    
    return user[0];
}


export {
    register
}