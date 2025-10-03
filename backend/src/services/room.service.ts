import mongoose from "mongoose";
import RoomModel, { RoomModelDocument } from "../models/RoomModel";
import { appAssert } from "../utils/appAssert";
import { HTTP } from "../constants/http";

export const createRoomService = async (payload: RoomModelDocument) => {
    const { topic, roomType, userId } = payload

    const room = await RoomModel.create({
        userId,
        topic,
        roomType,
        speakers: [userId]
    })
    appAssert(room, HTTP.INTERNAL_SERVER_ERROR, "DB error")
    return room
}

export const getRoomService = async (types: any) => {
    const rooms = await RoomModel.find({ roomType: { $in: types } }
    ).populate('speakers').populate('userId').exec()
    return rooms
}