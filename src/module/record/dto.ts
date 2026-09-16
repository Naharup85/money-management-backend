import {z} from "zod"

const recordSchema=z.object({
    description:z.string().optional(),
    amount:z.number(),
    fromAccountId:z.string(),
    toAccountId:z.string().optional(),
    type:z.enum(["income", "expense", "transfer"]),
    date:z.string(),
    categoryId:z.string(),
    payer:z.string().optional(),
    paymentType:z.enum(["cash", "bank", "card", "upi"]),
    paymentStatus:z.enum(["cleared", "pending"]),
    note:z.string().optional(),
});


const updateRecordSchema=z.object({
    description:z.string().optional(),
    amount:z.number(),
    fromAccountId:z.string(),
    toAccountId:z.string().optional(),
    type:z.enum(["income", "expense", "transfer"]),
    date:z.string(),
    categoryId:z.string(),
    payer:z.string().optional(),
    paymentType:z.enum(["cash", "bank", "card", "upi"]),
    paymentStatus:z.enum(["cleared", "pending"]),
    note:z.string().optional(),
});

type RecordDto=z.infer<typeof recordSchema>
type UpdateRecordDto=z.infer<typeof updateRecordSchema>

export type{
    RecordDto,
    UpdateRecordDto
}
export {recordSchema,updateRecordSchema}