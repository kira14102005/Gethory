"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const verifSchema = new mongoose_1.default.Schema({
    userID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    expiresAt: { type: Date, required: true },
});
const VerificationModel = mongoose_1.default.model("VerificationCode", verifSchema, "verification_codes");
exports.default = VerificationModel;
