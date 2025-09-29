import z from 'zod'

export const UpdateUserSchema = z.object({
    name: z.string(),
    username: z.string()
})
export type UpdateProfileType = z.infer<typeof UpdateUserSchema>