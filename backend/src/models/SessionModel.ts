import mongoose from "mongoose";
import { get30daysfromNow } from "../utils/date";

export interface SessionDocument extends mongoose.Document {
    userId : mongoose.Types.ObjectId;
    userAgent ?: string;
    expiresAt : Date;
    createdAt : Date;
}
const sessionSchema = new mongoose.Schema({
    userId: {type : mongoose.Schema.Types.ObjectId, ref: "User", required: true, index:  true},
    userAgent: {type : String},
    expiresAt: {type: Date, required : true, default : get30daysfromNow},
    createdAt: {type: Date, default: Date.now, required : true},
})

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema, "sessions")

export default SessionModel