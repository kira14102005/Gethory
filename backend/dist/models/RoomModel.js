"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var RoomType;
(function (RoomType) {
    RoomType[RoomType["public"] = 0] = "public";
    RoomType[RoomType["private"] = 1] = "private";
    RoomType[RoomType["group"] = 2] = "group";
})(RoomType || (exports.RoomType = RoomType = {}));
const roomModelSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User',
        required: true,
        index: true
    },
    topic: { type: String, required: true },
    roomType: {
        type: String,
        required: true,
        enum: Object.values(RoomType)
    },
    createdAt: { type: Date, default: Date.now, required: true },
    speakers: {
        type: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    }
}, {
    timestamps: true
});
const RoomModel = (0, mongoose_1.model)('Room', roomModelSchema, 'rooms');
exports.default = RoomModel;
