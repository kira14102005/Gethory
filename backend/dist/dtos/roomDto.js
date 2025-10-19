"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomDto = void 0;
const RoomDto = (room) => {
    if (!room)
        return undefined;
    const roomDto = {
        _id: room._id,
        topic: room.topic,
        authors: room.speakers,
        createdAt: room.createdAt,
        roomType: room.roomType,
        count: 0
    };
    return roomDto;
};
exports.RoomDto = RoomDto;
