import z from 'zod'

export const UpdateUserSchema = z.object({
    name: z.string(),
    username: z.string(),
    avatar: z.string().optional()
})
export type UpdateProfileType = z.infer<typeof UpdateUserSchema>