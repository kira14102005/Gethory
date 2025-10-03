import { RoomModelDocument } from "../models/RoomModel";

export const RoomDto = (room: RoomModelDocument | undefined) => {
    if (!room) return undefined
    const roomDto = {
        _id: room._id,
        topic: room.topic,
        authors: room.speakers,
        createdAt: room.createdAt,
        roomType : room.roomType,
        count : 0
    }
    return roomDto
}