import { eq } from "drizzle-orm";
import { db } from "../../index.js";
import { usersTable } from "../../db/schema/users.js";
import { accountsTable } from "../../db/schema/accounts.js";
import type { AccountDto,UpdateAccountDto } from "./dto.js";

const createAccount = async (payload: AccountDto) => {
    const userId = payload.userId;
    const user = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!user) {
        throw new Error("User not found");
    }
    
    const account = await db.insert(accountsTable).values({
        userId: userId,
        accountName: payload.name,
        type: payload.type,
        color: payload.color,
        balance: String(payload.balance),
    }).returning()
    if (!account) {
        throw new Error("unable to create account");
    }
    return {
        accountId: account[0]?.id,
        accountName: account[0]?.accountName,
        accountType: account[0]?.type,
        accountColor: account[0]?.color,
        accountBalance: account[0]?.balance,
        createdAt:account[0]?.createdAt,
        updatedAt:account[0]?.updatedAt
    };
}

const getUserAccounts=async(userId:string)=>{
    const accounts=await db.select().from(accountsTable).where(eq(accountsTable.userId,userId));
    return accounts.map((account)=>{
        return {
            accountId: account.id,
            accountName: account.accountName,
            accountType: account.type,
            accountColor: account.color,
            accountBalance: account.balance,
            createdAt:account.createdAt,
            updatedAt:account.updatedAt
        };
    });
}

const updateAccount=async(accountId:string,payload:UpdateAccountDto)=>{
    const account=await db.update(accountsTable).set({
        accountName:payload.name,
        type:payload.type,
        color:payload.color,
        balance:String(payload.balance),
    }).where(eq(accountsTable.id,accountId)).returning();
    if(!account){
        throw new Error("unable to update account");
    }
    return {
        accountId: account[0]?.id,
        accountName: account[0]?.accountName,
        accountType: account[0]?.type,
        accountColor: account[0]?.color,
        accountBalance: account[0]?.balance,
        updatedAt:account[0]?.updatedAt
    };
}

const deleteAccount=async(accountId:string)=>{
    console.log("account id",accountId)
    const account=await db.delete(accountsTable).where(eq(accountsTable.id,accountId));
    if(!account){
        throw new Error("Account not found");
    }
    return;
}

export {
    createAccount,
    getUserAccounts,
    updateAccount,
    deleteAccount
}