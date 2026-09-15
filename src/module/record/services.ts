import { eq, sql } from "drizzle-orm";
import { db } from "../../index.js";
import { accountsTable } from "../../db/schema/accounts.js";
import { recordsTable } from "../../db/schema/recods.js";
import type {RecordDto,UpdateRecordDto} from "./dto.js";
import ApiError from "../../common/utility/apiErrors.js";


const toDbRecord = (paylod: RecordDto) => ({
    id:paylod.id,
    fromAccountId: paylod.fromAccountId,
    toAccountId: paylod.toAccountId,
    amount: paylod.amount.toString(),
    type: paylod.type,
    category: parseFloat(paylod.categoryId),
    description: paylod.description,
    date: new Date(paylod.date),
    note: paylod.note,
    payer: paylod.payer,
    paymentType: paylod.paymentType,
    paymentStatus: paylod.paymentStatus,
});

const toDbUpdateRecord = (paylod: UpdateRecordDto) => ({
    fromAccountId: paylod.fromAccountId,
    toAccountId: paylod.toAccountId,
    amount: paylod.amount.toString(),
    type: paylod.type,
    category: parseFloat(paylod.categoryId),
    description: paylod.description,
    date: new Date(paylod.date),
    note: paylod.note,
    payer: paylod.payer,
    paymentType: paylod.paymentType,
    paymentStatus: paylod.paymentStatus,
});


/**
 * Adjusts account balances only (no record insertion).
 *
 * - expense  : deducts amount from fromAccount
 * - income   : adds    amount to   fromAccount
 * - transfer : deducts amount from fromAccount, adds to toAccount
 *
 * Pass a negative amount to reverse a previous transaction.
 */
type TxClient = Parameters<Parameters<typeof db.transaction>[0]>[0];

const _adjustBalances = async (tx: TxClient, fromAccountId: string, toAccountId: string | undefined, amount: number, type: string) => {
    const [sourceAccount] = await tx.select().from(accountsTable).where(eq(accountsTable.id, fromAccountId));

    if (!sourceAccount) throw ApiError.notFound("Source account not found");

    const sourceBalance = parseFloat(sourceAccount.balance);

    if (type === "expense") {
        // Deduct from source (negative amount = refund)
        const newBalance = sourceBalance - amount;
        await tx.update(accountsTable).set({ balance: newBalance.toFixed(2) }).where(eq(accountsTable.id, fromAccountId));

    } else if (type === "income") {
        // Credit to source
        await tx.update(accountsTable).set({ balance: (sourceBalance + amount).toFixed(2) }).where(eq(accountsTable.id, fromAccountId));

    } else if (type === "transfer") {
        if (!toAccountId) throw ApiError.badRequest("toAccountId is required for transfer");

        const [destAccount] = await tx.select().from(accountsTable).where(eq(accountsTable.id, toAccountId));
        if (!destAccount) throw ApiError.notFound("Destination account not found");

        const newSourceBalance = sourceBalance - amount;
        const destBalance = parseFloat(destAccount.balance);

        await tx.update(accountsTable).set({ balance: newSourceBalance.toFixed(2) }).where(eq(accountsTable.id, fromAccountId));
        await tx.update(accountsTable).set({ balance: (destBalance + amount).toFixed(2) }).where(eq(accountsTable.id, toAccountId));
    }
};

/** Wraps balance reversal in its own transaction (used by updateRecord / deleteRecord). */
const adjustBalances = async (fromAccountId: string, toAccountId: string | undefined, amount: number, type: string) => {
    return db.transaction(async (tx) => {
        await _adjustBalances(tx, fromAccountId, toAccountId, amount, type);
    });
};

/**
 * Adjusts account balances AND inserts a new record row — all in one atomic transaction.
 * Used when creating a cleared (non-pending) record.
 */
const performTransactions = async (fromAccountId: string, toAccountId: string | undefined, amount: number, type: string, payload: RecordDto) => {
    return db.transaction(async (tx) => {
        await _adjustBalances(tx, fromAccountId, toAccountId, amount, type);
        const [record] = await tx.insert(recordsTable).values(toDbRecord(payload)).returning();
        return [record];
    });
};

const createRecord= async(paylod:RecordDto)=>{
    const {fromAccountId,toAccountId}=paylod;
    if(!fromAccountId) throw ApiError.badRequest("fromAccountId is required");
    const source=await db.select().from(accountsTable).where(eq(accountsTable.id,fromAccountId));
    if(!source[0] || !source[0].balance){
        throw ApiError.notFound("Source account not found");
    }
    let destinationAccount: typeof source[0] | null = null;
    if(toAccountId !== undefined){
        const destination=await db.select().from(accountsTable).where(eq(accountsTable.id,toAccountId));
        if(!destination[0] || !destination[0].balance){
            throw ApiError.notFound("Destination account not found");
        }
        destinationAccount = destination[0];
    }


    const sourceBalance = +source[0].balance;
    const destinationBalance = destinationAccount ? +(destinationAccount.balance) : 0;

    const amount=paylod.amount;

    let record:any;
    if(paylod.paymentStatus !== "pending"){
        record=await performTransactions(source[0].id,destinationAccount?.id,amount,paylod.type,paylod);
    }else{
        record=await db.insert(recordsTable).values(toDbRecord(paylod)).returning();
    }
    
    if (!record || !record[0]) throw ApiError.badRequest("Failed to create record");

     return {
        id: record[0].id,
        fromAccountId: record[0].fromAccountId,
        toAccountId: record[0].toAccountId ?? undefined,
        amount: parseFloat(record[0].amount),
        type: record[0].type!,
        categoryId: record[0].category.toString(),
        description: record[0].description ?? undefined,
        date: record[0].date.toISOString(),
        note: record[0].note ?? undefined,
        payer: record[0].payer ?? undefined,
        paymentType: record[0].paymentType!,
        paymentStatus: record[0].paymentStatus!,
    };
}

const getAllRecords=async()=>{
    const records=await db.select().from(recordsTable);
    return records.map((record)=>{
        return{
            id:record.id,
            fromAccountId:record.fromAccountId,
            toAccountId:record.toAccountId,
            amount:parseFloat(record.amount),
            type:record.type,
            category:record.category.toString(),
            description:record.description,
            date:record.date.toISOString(),
            note:record.note,
            payer:record.payer,
            paymentType:record.paymentType,
            paymentStatus:record.paymentStatus,
            createdAt:record.createdAt?.toISOString(),
            updatedAt:record.updatedAt?.toISOString(),
        }
    });
}

const updateRecord=async(id:string,paylod:UpdateRecordDto)=>{
    const record=await db.select().from(recordsTable).where(eq(recordsTable.id,id));
    if(!record[0]) throw ApiError.notFound("Record not found");
    // Reverse the previous transaction's balance effect before applying the updated one
    if(record[0].paymentStatus !== "pending"){
        await adjustBalances(record[0].fromAccountId,record[0].toAccountId ?? undefined,-+record[0].amount,record[0].type!);
    }
    // Apply the new transaction's balance effect if the updated status is not pending
    if(paylod.paymentStatus !== "pending"){
        await adjustBalances(paylod.fromAccountId,paylod.toAccountId,paylod.amount,paylod.type);
    }
    const updatedRecord=await db.update(recordsTable).set(toDbUpdateRecord(paylod)).where(eq(recordsTable.id,id)).returning();
    if(!updatedRecord || !updatedRecord[0]) throw ApiError.badRequest("Failed to update record");
    return {
        id: updatedRecord[0].id,
        fromAccountId: updatedRecord[0].fromAccountId,
        toAccountId: updatedRecord[0].toAccountId ?? undefined,
        amount: parseFloat(updatedRecord[0].amount),
        type: updatedRecord[0].type!,
        categoryId: updatedRecord[0].category.toString(),
        description: updatedRecord[0].description ?? undefined,
        date: updatedRecord[0].date.toISOString(),
        note: updatedRecord[0].note ?? undefined,
        payer: updatedRecord[0].payer ?? undefined,
        paymentType: updatedRecord[0].paymentType!,
        paymentStatus: updatedRecord[0].paymentStatus!,
    };


}

const deleteRecord=async(id:string)=>{
    const record=await db.select().from(recordsTable).where(eq(recordsTable.id,id));
    if(!record[0]) throw ApiError.notFound("Record not found");
    // Reverse the transaction's balance effect on deletion
    if(record[0].paymentStatus !== "pending"){
        await adjustBalances(record[0].fromAccountId,record[0].toAccountId ?? undefined,-+record[0].amount,record[0].type!);
    }
    await db.delete(recordsTable).where(eq(recordsTable.id,id));
    return;
}

const getRecord=async(id:string)=>{
    const records=await db.select().from(recordsTable).where(eq(recordsTable.id,id));
    return records;
}

export {
    createRecord,
    getAllRecords,
    updateRecord,
    deleteRecord,
    getRecord
}