import mongoose from "mongoose";
import RoomModel, { RoomModelDocument } from "../models/RoomModel";

export const createRoomService = async (payload: RoomModelDocument) => {
    const { topic, roomType, userId } = payload
    const room = await RoomModel.create({
        userId,
        topic,
        roomType,
        speakers: [userId]
    })
    return room
}