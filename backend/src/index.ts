import "dotenv/config"
import express from 'express'
import path from "path";
import { Request, Response, NextFunction } from "express";
import cors from 'cors'
import { DB_URI, PORT, NODE_ENV, APP_ORIGIN } from "./constants/env";
import { connecttoDb } from "./config/db";
import { errorHandler } from "./midwares/errorHandler";
import catchError from "./utils/catchErrorWrapper";
import { authRouter } from "./router/authRouter";
import cookieParser from 'cookie-parser'
import { userRouter } from "./router/userRouter";
import { authenticate } from "./midwares/authenticate";
import { sessionRouter } from "./router/sessionRouter";
import { roomRouter } from "./router/roomRouter";
const app = express();
import { createServer } from 'http'
import { Server } from "socket.io";
import { ACTIONS } from "./constants/socketActions";

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: APP_ORIGIN,
        methods: ['POST', 'GET',]
    }
})

app.use(cors({
    origin: APP_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use("/storage", express.static(path.join(__dirname, "/storage"))); app.use(cookieParser())
app.get("/error", catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Hello")
    throw new Error("booo");
    return res.json({
        msg: "Welcome Home!"
    })
})
)
app.use('/auth', authRouter)

// protected routes 
app.use('/user', authenticate, userRouter)
app.use('/sessions', authenticate, sessionRouter)
app.use('/room', authenticate, roomRouter)

//Error Midware at the End
app.use(errorHandler)

//Sockets
interface SocketUserMappingInterface {
    [socket_id: string]: string;
}
let socketUserMapping: SocketUserMappingInterface = {};
io.on('connection', (socket) => {
    console.log('New connection  : ', socket.id)
    socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
        socketUserMapping[socket.id] = user._id;
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) ?? [])
clients.forEach((clientId) => {
    io.to(clientId).emit(ACTIONS.ADD_PEER  , {})
});
socket.emit(ACTIONS.ADD_PEER)
        console.log(clients)

    });

})

server.listen(PORT, async () => {
    try {
        console.log("Running  on PORT " + PORT + " in " + NODE_ENV + " environment")
        await connecttoDb(DB_URI);
    } catch (e) {
        console.log("Error in Joining to DB")
    }

})