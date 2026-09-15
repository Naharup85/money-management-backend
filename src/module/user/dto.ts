import { z } from "zod";


const registerDto = z.object({
    firstName: z.string()
        .min(3, {
            message: "First name must be at least 3 characters long"
        })
        .max(225, {
            message: "First name must be at most 10 characters long"
        }),
    lastName: z.string()
        .min(3, {
            message: "Last name must be at least 3 characters long"
        })
        .max(225, {
            message: "Last name must be at most 10 characters long"
        }),
    email: z.email("Please provide a valid email")
        .max(225, "Email must be at most 225 characters long"),
    cashBalance: z.coerce.number().optional().default(0),
    profilePicture: z.string().optional(),
    sub: z.string()
    .min(3,
        {
            message: "Logto ID must be at least 3 characters long"
        }
    )
    .max(225,
        {
            message: "Logto ID must be at most 225 characters long"
        }
    )
});



type UserRegisterDto = z.infer<typeof registerDto>;


export {
    registerDto,
};

export type { UserRegisterDto };

