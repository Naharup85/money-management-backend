import { z } from "zod";

const accountSchema=z.object({
    name: z.string()
    .min(3,
        {
            message: "Account name must be at least 3 characters long"
        }
    )
    .max(100,
        {
            message: "Account name must be at most 100 characters long"
        }
    ),
    color:z.string().length(8, ""),
    type: z.enum(["bank", "card", "cash", "credit_card", "investment", "other"]),
    balance: z.coerce.number().optional().default(0),
    userId: z.string().min(1,"User ID is required"),
});

export{
    accountSchema
}
export type AccountDto = z.infer<typeof accountSchema>;