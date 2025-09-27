import z from 'zod'


const emailSchema = z.string().email();
const passwordSchema = z.string().min(8).max(255);
export const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    userAgent: z.string().optional(),
})

export const registerSchema = loginSchema.extend({
    confirmpassword: z.string().min(8).max(255),
    name: z.string().optional(),
}).refine(
    (data) => {
        return data.password === data.confirmpassword
    }, { message: "Password and Confirm Password do not match" }
)

export const verificationCodeSchema = z.string().min(1).max(24)

export const forgotPasswordSchema = z.string().email();

export const resetPasswordSchema = z.object({
    password: passwordSchema,
    code: verificationCodeSchema
})