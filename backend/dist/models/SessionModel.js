"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const date_1 = require("../utils/date");
const sessionSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    userAgent: { type: String },
    expiresAt: { type: Date, required: true, default: date_1.get30daysfromNow },
    createdAt: { type: Date, default: Date.now, required: true },
});
const SessionModel = mongoose_1.default.model("Session", sessionSchema, "sessions");
exports.default = SessionModel;
