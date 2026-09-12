import { z } from "zod";


const registerDto = z.object({
    firstName:z.string()
    .min(3,{
        message:"First name must be at least 3 characters long"})
    .max(225,{
        message:"First name must be at most 10 characters long"
    }),
    lastName:z.string()
    .min(3,{
        message:"Last name must be at least 3 characters long"
    })
    .max(225,{
        message:"Last name must be at most 10 characters long"
    }),
    email:z.email("Please provide a valid email")
    .max(225,"Email must be at most 225 characters long"),
    cashBalance:z.number().optional().default(0),
});

const loginDto = z.object({
    email:z.email("Please provide a valid email")
    .max(225,"Email must be at most 225 characters long"),
    password:z.string()
    .min(6,"Please provide a password password must be at least 6 characters long")
    .max(225,"Password must be at most 225 characters long"),
});

type UserregisterDto=z.infer<typeof registerDto>;
type UserLoginDto=z.infer<typeof loginDto>;


export {
    registerDto,
    loginDto
};    

export type { UserregisterDto,UserLoginDto };

