"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleRoomService = exports.getAllRoomsService = exports.createRoomService = void 0;
const RoomModel_1 = __importDefault(require("../models/RoomModel"));
const appAssert_1 = require("../utils/appAssert");
const http_1 = require("../constants/http");
const createRoomService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { topic, roomType, userId } = payload;
    const room = yield RoomModel_1.default.create({
        userId,
        topic,
        roomType,
        speakers: [userId]
    });
    (0, appAssert_1.appAssert)(room, http_1.HTTP.INTERNAL_SERVER_ERROR, "DB error");
    return room;
});
exports.createRoomService = createRoomService;
const getAllRoomsService = (types) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield RoomModel_1.default.find({ roomType: { $in: types } }).populate('speakers').populate('userId').exec();
    return rooms;
});
exports.getAllRoomsService = getAllRoomsService;
const getSingleRoomService = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield RoomModel_1.default.findById(roomId).populate('speakers').populate('userId').exec();
    (0, appAssert_1.appAssert)(room, http_1.HTTP.NOT_FOUND, 'No room found of this ID');
    return room;
});
exports.getSingleRoomService = getSingleRoomService;
