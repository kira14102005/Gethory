import mongoose, { model } from "mongoose";
import { Schema } from "zod";

export enum RoomType {
    'public',
    'private',
    'group'
}
type SpeakerType = {
    id: mongoose.Types.ObjectId
}
export interface RoomModelDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    // expiresAt: Date;
    topic: string;
    roomType: RoomType;
    createdAt: Date;
    speakers: SpeakerType[]
}

const roomModelSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
        index: true
    },

    topic: { type: String, required: true },
    roomType: {
        type: String,
        required: true,
        enum: Object.values(RoomType)
    }
    , createdAt: { type: Date, default: Date.now, required: true },
    speakers: {
        type: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            }
        ]
    }
})

const RoomModel = model<RoomModelDocument>('Room', roomModelSchema, 'rooms')

export default RoomModel