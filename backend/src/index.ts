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
import { socketHandlerV2 } from "./socket/socket_ver_2";


const server = createServer(app)
export const io = new Server(server, {
    cors: {
        origin: APP_ORIGIN,
        methods: ['POST', 'GET',]
    }
})

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use("/api/storage", express.static(path.join(__dirname, "/storage"))); app.use(cookieParser())
app.get("/error", catchError(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Hello")
    throw new Error("booo");
    return res.json({
        msg: "Welcome Home!"
    })
})
)
app.use('/api/auth', authRouter)

// protected routes 
app.use('/api/user', authenticate, userRouter)
app.use('/api/sessions', authenticate, sessionRouter)
app.use('/api/room', authenticate, roomRouter)

//Error Midware at the End
app.use(errorHandler)

//Sockets

io.on('connection', socketHandlerV2);

server.listen(PORT, async () => {
    try {
        console.log("Running  on PORT " + PORT + " in " + NODE_ENV + " environment")
        await connecttoDb(DB_URI);
    } catch (e) {
        console.log("Error in Joining to DB")
    }

})