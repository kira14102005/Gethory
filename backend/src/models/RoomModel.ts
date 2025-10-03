import mongoose, { model } from "mongoose";

enum RoomType {
    'public',
    'private',
    'group'
}

export interface RoomModelDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    // expiresAt: Date;
    topic: string;
    roomType: RoomType;
    createdAt: Date;
}

const roomModelSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
        index: true
    },

    topic: { type: String, required: true },
    roomType: { type: RoomType, required: true }
    , createdAt: { type: Date, default: Date.now, required: true },
})

const RoomModel = model<RoomModelDocument>('Room', roomModelSchema, 'rooms')

export default RoomModel