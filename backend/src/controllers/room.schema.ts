import z from 'zod'
export const createRoomSchema = z.object({
    topic : z.string().min(1),
    roomType   : z.enum(['public' , 'private'  , 'group'])
})
export type createRoomType  = z.infer<typeof createRoomSchema>