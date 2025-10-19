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
exports.deleteSessionController = exports.getSessionsController = void 0;
const http_1 = require("../constants/http");
const SessionModel_1 = __importDefault(require("../models/SessionModel"));
const appAssert_1 = require("../utils/appAssert");
const catchErrorWrapper_1 = __importDefault(require("../utils/catchErrorWrapper"));
const zod_1 = __importDefault(require("zod"));
exports.getSessionsController = (0, catchErrorWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, sessionId } = req;
    console.log(userId);
    const SessionList = yield SessionModel_1.default.find({
        userId,
        expiresAt: { $gt: new Date() }
    }, {
        _id: 1,
        createdAt: 1,
        userAgent: 1
    }, { sort: { createdAt: -1 } });
    console.log(SessionList);
    return res.json({
        msg: "Sessions List",
        sessions: SessionList.map((ses) => {
            const sesObject = ses.toObject();
            if (ses._id == sessionId)
                return Object.assign(Object.assign({}, sesObject), { currentSession: true });
            else
                return sesObject;
        })
    });
}));
exports.deleteSessionController = (0, catchErrorWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionId = zod_1.default.string().parse(req.params.id);
    (0, appAssert_1.appAssert)(sessionId, http_1.HTTP.BAD_REQUEST, "No session Id passed as parameter");
    const deletedRecord = yield SessionModel_1.default.deleteOne({ _id: sessionId, userId: req.userId });
    (0, appAssert_1.appAssert)(deletedRecord, http_1.HTTP.NOT_FOUND, "Not valid Session to be Deleted");
    return res.json({ msg: "Session Deleted SuccessFully" });
}));
