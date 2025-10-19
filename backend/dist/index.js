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
exports.io = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./constants/env");
const db_1 = require("./config/db");
const errorHandler_1 = require("./midwares/errorHandler");
const catchErrorWrapper_1 = __importDefault(require("./utils/catchErrorWrapper"));
const authRouter_1 = require("./router/authRouter");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRouter_1 = require("./router/userRouter");
const authenticate_1 = require("./midwares/authenticate");
const sessionRouter_1 = require("./router/sessionRouter");
const roomRouter_1 = require("./router/roomRouter");
const app = (0, express_1.default)();
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socket_ver_2_1 = require("./socket/socket_ver_2");
const server = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: env_1.APP_ORIGIN,
        methods: ['POST', 'GET',]
    }
});
app.use((0, cors_1.default)({
    origin: env_1.APP_ORIGIN,
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
app.use("/storage", express_1.default.static(path_1.default.join(__dirname, "/storage")));
app.use((0, cookie_parser_1.default)());
app.get("/error", (0, catchErrorWrapper_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Hello");
    throw new Error("booo");
    return res.json({
        msg: "Welcome Home!"
    });
})));
app.use('/auth', authRouter_1.authRouter);
// protected routes 
app.use('/user', authenticate_1.authenticate, userRouter_1.userRouter);
app.use('/sessions', authenticate_1.authenticate, sessionRouter_1.sessionRouter);
app.use('/room', authenticate_1.authenticate, roomRouter_1.roomRouter);
//Error Midware at the End
app.use(errorHandler_1.errorHandler);
//Sockets
exports.io.on('connection', socket_ver_2_1.socketHandlerV2);
server.listen(env_1.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Running  on PORT " + env_1.PORT + " in " + env_1.NODE_ENV + " environment");
        yield (0, db_1.connecttoDb)(env_1.DB_URI);
    }
    catch (e) {
        console.log("Error in Joining to DB");
    }
}));
