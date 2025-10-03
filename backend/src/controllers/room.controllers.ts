import { createRoomService } from "../services/room.service";
import catchError from "../utils/catchErrorWrapper";
import { createRoomSchema } from "./room.schema";

export const roomCreateController = catchError(async (req, res, next) => {
    const response = createRoomSchema.parse(req.body)
    const userId  =req.userId
    createRoomService(response , userId )
    

 })