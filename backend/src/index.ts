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
import { socketUserMapping } from "./constants/socketUserMapping";

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

io.on('connection', (socket) => {
    console.log('New connection  : ', socket.id)
    socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
        socketUserMapping[socket.id] = user;
        const clientsInRoom = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

        //    need to map socket IDs to the actual user Id.
        const existingPeers = clientsInRoom.map(socketId => ({
            socketId,
            user: socketUserMapping[socketId]
        }));

        // socket.emit(ACTIONS.RELAY_PEERS, existingPeers);
        clientsInRoom.forEach((clientId) => {
            socket.emit(ACTIONS.ADD_PEER, {
                peerId: clientId,
                createOffer: true,
                user: socketUserMapping[clientId]
            })
        })

        //    Use `socket.broadcast` to send to everyone except the current socket.
        socket.broadcast.to(roomId).emit(ACTIONS.ADD_PEER, {
            peerId: socket.id,
            createOffer: false,
            user,
        });

        socket.join(roomId);
        console.log(clientsInRoom)

    });

    // Handle  Relay ice
    socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
        io.to(peerId).emit(ACTIONS.RELAY_ICE ,  {
            peerId  : socket.id,
            icecandidate
        })
    })

});

server.listen(PORT, async () => {
    try {
        console.log("Running  on PORT " + PORT + " in " + NODE_ENV + " environment")
        await connecttoDb(DB_URI);
    } catch (e) {
        console.log("Error in Joining to DB")
    }

})