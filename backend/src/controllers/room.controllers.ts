import { createRoomService } from "../services/room.service";
import catchError from "../utils/catchErrorWrapper";
import { createRoomSchema } from "./room.schema";

export const roomCreateController = catchError(async (req, res, next) => {
    const { topic, roomType } = createRoomSchema.parse(req.body)
    const userId = req.userId
    //@ts-ignore
    const room = await createRoomService({ topic, roomType, userId })

    return res.status(200).json({
        msg: 'Room Created Success',
        room
    })
})