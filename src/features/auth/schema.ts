import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().min(3, {
        message: "Email is too short."
    }),
    password: z.string().min(6, {
        message: "Password is too short."
    }),
});

