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
exports.getRoomController = exports.fetchAllRoomController = exports.roomCreateController = void 0;
const http_1 = require("../constants/http");
const roomDto_1 = require("../dtos/roomDto");
const room_service_1 = require("../services/room.service");
const appAssert_1 = require("../utils/appAssert");
const catchErrorWrapper_1 = __importDefault(require("../utils/catchErrorWrapper"));
const room_schema_1 = require("./room.schema");
exports.roomCreateController = (0, catchErrorWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { topic, roomType } = room_schema_1.createRoomSchema.parse(req.body);
    const userId = req.userId;
    //@ts-ignore
    const room = yield (0, room_service_1.createRoomService)({ topic, roomType, userId });
    return res.status(200).json({
        msg: 'Room Created Success',
        room
    });
}));
exports.fetchAllRoomController = (0, catchErrorWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield (0, room_service_1.getAllRoomsService)(['public']);
    //@ts-ignore
    const meetingArr = rooms.map((room) => (0, roomDto_1.RoomDto)(room));
    return res.status(200).json({
        msg: "Room Fetched success",
        meetingArr
    });
}));
exports.getRoomController = (0, catchErrorWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const roomId = req.params.roomId;
    (0, appAssert_1.appAssert)(roomId, http_1.HTTP.BAD_REQUEST, 'Room Id missing in the paramter');
    const room = yield (0, room_service_1.getSingleRoomService)(roomId);
    return res.status(200).json({
        msg: 'Here is your room',
        room
    });
}));
