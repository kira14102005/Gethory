import { HTTP } from "../constants/http";
import { RoomDto } from "../dtos/roomDto";
import RoomModel from "../models/RoomModel";
import { createRoomService, getAllRoomsService, getSingleRoomService } from "../services/room.service";
import { appAssert } from "../utils/appAssert";
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

export const fetchAllRoomController = catchError(async (req, res, next) => {
    const rooms = await getAllRoomsService(['public'])
    //@ts-ignore
    const meetingArr = rooms.map((room) => RoomDto(room))
    return res.status(200).json({
        msg: "Room Fetched success",
        meetingArr
    })
})

export const getRoomController = catchError(async (req, res, next) => {
    const roomId = req.params.roomId
    appAssert(roomId, HTTP.BAD_REQUEST, 'Room Id missing in the paramter')
    const room = await getSingleRoomService(roomId)
    return res.status(200).json({
        msg: 'Here is your room',
        room
    })

})